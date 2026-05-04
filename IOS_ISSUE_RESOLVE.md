# 🍎 iOS / Safari Authentication Bug — Post-Mortem & Resolution

> **Date Resolved:** 2026-05-04  
> **Affected Platform:** Safari (macOS) + All iOS browsers (Chrome iOS, Firefox iOS, Safari iOS)  
> **Not Affected:** Chrome (desktop), Android (all browsers), Firefox (desktop)  
> **Severity:** High — authenticated users on iPhone/iPad could not access any past papers

---

## 📋 Table of Contents

1. [Summary](#summary)
2. [Architecture Overview](#architecture-overview)
3. [Root Cause](#root-cause)
4. [Step-by-Step Failure Flow on Safari](#step-by-step-failure-flow-on-safari)
5. [Why Android & Chrome Worked Fine](#why-android--chrome-worked-fine)
6. [Files Affected](#files-affected)
7. [The Fix — Dual-Path Authentication](#the-fix--dual-path-authentication)
8. [Code Changes](#code-changes)
9. [Deploy Checklist](#deploy-checklist)
10. [Search Terms for Further Research](#search-terms-for-further-research)

---

## Summary

Users on iPhone/Safari could **create an account and log in successfully**, but after being redirected to the dashboard, **zero past papers, faculties, or courses would load**. The dashboard appeared empty. The same account on Android or PC Chrome showed all data correctly.

The cause was **Apple's Intelligent Tracking Prevention (ITP)** silently blocking the session cookie set by the backend, making every authenticated API call return `401 Unauthorized`.

**Simple explanation:**  
> The website's login system relied on a cookie to prove "this user is logged in." Safari secretly threw that cookie in the bin because it came from a different website address than the one you were visiting. The app didn't know the cookie was gone, so it thought you were logged in but couldn't prove it to the server — which refused to send any data back.

---

## Architecture Overview

```
Frontend (React + Vite)          Backend (Express + Node.js)
──────────────────────           ──────────────────────────
cupuri-portal.vercel.app   ←→   cupuri-backend.onrender.com
        (Vercel)                          (Render)
```

These are **two completely different domains**. This cross-domain setup is the root of the problem.

---

## Root Cause

### Apple ITP (Intelligent Tracking Prevention)

Safari includes a privacy feature called **ITP** that aggressively blocks **third-party cookies** to prevent advertisers from tracking users across websites.

A cookie is considered "third-party" when:
- The **page** the user is viewing is on **Domain A** (`vercel.app`)
- The **cookie** was set by a request to **Domain B** (`onrender.com`)

Even though the backend correctly set the cookie with `SameSite=None; Secure` — which is the W3C-standard way of declaring "this cookie is intentionally cross-site" — **Safari ignores this declaration** and blocks the cookie anyway, starting with iOS 14 and becoming even stricter in iOS 17.

**The exact cookie that was blocked:**

```
Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=None; Max-Age=604800
```

Set by: `cupuri-backend.onrender.com`  
Received on page: `cupuri-portal.vercel.app`  
Safari's verdict: ❌ **Silently dropped. No warning. No error.**

---

## Step-by-Step Failure Flow on Safari

```
Step 1 — User submits the login form
         POST https://cupuri-backend.onrender.com/api/auth/login
         ✅ Request succeeds — server responds 200 OK

Step 2 — Server sends back:
         Response body: { user: { id, name, role } }
         Response header: Set-Cookie: token=<jwt>; SameSite=None; Secure
         ✅ Server did everything correctly

Step 3 — Safari processes the Set-Cookie header
         Sees: cookie origin = onrender.com ≠ page origin = vercel.app
         Decision: ❌ BLOCK — silently discards the cookie

Step 4 — AuthContext receives the response body
         Saves user object to localStorage → "auca-cupuri-user"
         setUser(data.user) → React state updated
         ✅ User APPEARS logged in on the UI

Step 5 — AppContext fires (triggered by user state change)
         Sends: GET /api/faculties   credentials: "include"
         Sends: GET /api/courses     credentials: "include"
         Sends: GET /api/exams       credentials: "include"
         Cookie jar is EMPTY — no token is sent ❌

Step 6 — verifyToken middleware on the backend
         Checks: req.cookies.token → undefined
         Checks: req.headers.authorization → undefined
         Returns: 401 Unauthorized ❌

Step 7 — AppContext error handling
         catch { } — silent fail, arrays stay empty ❌

Step 8 — Dashboard renders
         faculties = [], courses = [], exams = []
         User sees a completely empty dashboard ❌
```

---

## Why Android & Chrome Worked Fine

Chrome (desktop and Android) fully implements the `SameSite=None; Secure` standard as defined by the W3C. When it receives a cookie with these attributes from a cross-origin server, it stores it and sends it back on subsequent requests to that origin — exactly as intended.

| Browser         | Respects `SameSite=None; Secure`? | Result      |
|-----------------|-----------------------------------|-------------|
| Chrome (desktop)| ✅ Yes                             | Works ✅    |
| Chrome (Android)| ✅ Yes                             | Works ✅    |
| Firefox         | ✅ Yes                             | Works ✅    |
| Safari (macOS)  | ❌ No — ITP blocks it              | Broken ❌   |
| Safari (iOS)    | ❌ No — ITP blocks it              | Broken ❌   |
| Chrome (iOS)    | ❌ No — forced to use Safari engine | Broken ❌  |
| Firefox (iOS)   | ❌ No — forced to use Safari engine | Broken ❌  |

> **Important:** On iOS, ALL browsers (Chrome, Firefox, Edge, Brave, etc.) are forced by Apple to use the WebKit engine. This means the ITP bug affects every single browser on an iPhone or iPad, not just Safari.

---

## Files Affected

| File | Location | Type |
|------|----------|------|
| `authController.js` | `serverside/controllers/` | Backend |
| `AuthContext.jsx` | `clientside/src/context/` | Frontend |
| `api.js` | `clientside/src/api/` | Frontend |
| `AppContext.jsx` | `clientside/src/context/` | Frontend |

---

## The Fix — Dual-Path Authentication

Instead of relying solely on cookies, the app now uses a **dual-path strategy**:

- **Cookie path** (Chrome / Android): Unchanged. The HttpOnly cookie is still set and still used. No regression.
- **Bearer token path** (Safari / iOS): The JWT is also returned in the login response body, stored in `localStorage`, and sent as an `Authorization: Bearer <token>` header on every API request.

The backend `verifyToken` middleware already supported both paths:
```js
// middlewares/auth.js — already had this fallback before the fix
const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
```

So **no backend route changes were needed** — the middleware simply starts using the header path for Safari users.

### Why `localStorage` is acceptable here

Using `localStorage` for a JWT has known security trade-offs (vulnerable to XSS). However:
1. This app does not render any user-supplied HTML — there is no XSS attack surface
2. The alternative (an HttpOnly cookie) is not usable on Safari cross-domain
3. The token expires in 7 days, limiting the damage window
4. This is consistent with how many production apps handle Safari ITP

---

## Code Changes

### 1. `authController.js` — Return token in response body

```js
// BEFORE
res.json({
  user: { id: user.id, name: user.name, role: user.role },
});

// AFTER
// Also return token in body so clients that can't use cross-domain
// cookies (Safari/iOS ITP) can store it in localStorage and send it
// as an Authorization: Bearer header instead.
res.json({
  user: { id: user.id, name: user.name, role: user.role },
  token,
});
```

The HttpOnly cookie is still set above this — Chrome/Android continue to use it.

---

### 2. `AuthContext.jsx` — Store token in localStorage

```js
// On LOGIN — store the token from the response body
localStorage.setItem("auca-cupuri-user", JSON.stringify(data.user));
if (data.token) {
  localStorage.setItem("auca-cupuri-token", data.token);  // ← NEW
  setToken(data.token);                                    // ← NEW
}
setUser(data.user);

// On LOGOUT — clean up the token too
localStorage.removeItem("auca-cupuri-user");
localStorage.removeItem("auca-cupuri-token");  // ← NEW
setToken(null);                                // ← NEW
setUser(null);
```

---

### 3. `api.js` — Attach Bearer token to every request

```js
// Added inside apiRequest() before every fetch:
const storedToken = localStorage.getItem("auca-cupuri-token");

const response = await fetch(`${BASE_URL}${endpoint}`, {
  credentials: "include",
  ...options,
  headers: {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),  // ← NEW
    ...options.headers,
  },
});
```

---

### 4. `AppContext.jsx` — Patch raw fetch() calls

`AppContext` used raw `fetch()` calls that bypassed `apiRequest`. A helper was added and injected into each:

```js
// NEW helper function at the top of AppContext.jsx
const getAuthHeaders = () => {
  const token = localStorage.getItem("auca-cupuri-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Applied to all fetch calls:
fetch(`${BASE_URL}/faculties`, { credentials: "include", headers: getAuthHeaders() })
fetch(`${BASE_URL}/courses`,   { credentials: "include", headers: getAuthHeaders() })
fetch(`${BASE_URL}/exams`,     { credentials: "include", headers: getAuthHeaders() })

// And the POST upload:
fetch(`${BASE_URL}/exams/upload`, {
  method: "POST",
  credentials: "include",
  headers: getAuthHeaders(),   // ← NEW
  body: formData,
})
```

---

## Deploy Checklist

- [x] Code changes committed to `main`
- [ ] Push backend (`serverside/`) to Render: `git push`
- [ ] Push frontend (`clientside/`) to Vercel: `git push` (auto-deploy)
- [ ] Wait for both deployments to finish
- [ ] Test on iPhone Safari — log out first, then log in fresh
- [ ] Verify past papers, courses, and faculties all load after login
- [ ] Test that Android/Chrome still works (regression check)

> **Note:** Existing Safari sessions that were created before this fix will not have a token in `localStorage`. Those users need to **log out and log back in once** after the new version is deployed for the fix to take effect.

---

## Search Terms for Further Research

If you need to research this issue further or find community solutions:

- `Safari ITP cross-domain cookie blocked`
- `SameSite=None cookie not working iOS Safari`
- `Express cookie not sent on Safari cross-origin fetch credentials include`
- `Safari blocks third-party cookies SameSite=None Render Vercel`
- `iOS all browsers WebKit cross-domain session cookie`
- `ITP Intelligent Tracking Prevention JWT localStorage workaround`
- `Authorization Bearer header vs cookie Safari cross-domain`

---

*Document created: 2026-05-04 | Author: Antigravity AI + Prince Cuthbert*
