# Cupuri Portal - Development & Security Log
**Date:** May 7, 2026
**Lead Engineer:** Antigravity AI
**Status:** Production Ready / Hardened

## 📝 Executive Summary
Today's development cycle focused on transitioning the Cupuri Portal from a functional prototype to a production-hardened platform. We addressed critical security vulnerabilities, overhauled the file delivery infrastructure for mobile compatibility, and implemented a comprehensive Admin Management suite.

---

## 🛡️ SECTION 1: SECURITY HARDENING & AUDIT

### 1. Password Complexity Enforcement
*   **Vulnerability:** The system accepted weak passwords (e.g., `james123`), leaving accounts vulnerable to simple dictionary attacks.
*   **Remediation:** 
    *   **Backend:** Updated `authController.js` with a robust Regex validation: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`.
    *   **Frontend:** Added matching validation in `SignUp.jsx` to provide immediate feedback.
    *   **Result:** Passwords now require 8+ chars, uppercase, lowercase, numbers, and special characters.

### 2. Rate Limiting (DoS Prevention)
*   **Vulnerability:** Auth and Upload routes were unprotected, allowing for brute-force login attempts and storage-exhaustion attacks.
*   **Remediation:** 
    *   Implemented `express-rate-limit` on `/api/auth/login`, `/api/auth/register`, and `/api/exams/upload`.
    *   **Config:** Auth limited to 5 attempts/5 mins; Uploads limited to 10/hour.

### 3. Mass Assignment Protection
*   **Vulnerability:** The registration endpoint allowed users to pass a `role: "admin"` property in the request body to gain elevated privileges.
*   **Remediation:** Hardcoded the `role` to `"student"` in `authController.register`, ignoring any role sent in the `req.body`.

### 4. Database Integrity (LONGTEXT Migration)
*   **Vulnerability:** Multi-file exams caused `ER_DATA_TOO_LONG` errors because the `filePath` column (VARCHAR) couldn't store large arrays of Cloudinary URLs.
*   **Remediation:** Created `alter_db.js` to migrate the column to `LONGTEXT`, allowing unlimited file attachments per exam.

---

## 📁 SECTION 2: FILE INFRASTRUCTURE OVERHAUL

### 1. HEIC/HEIF Preview Compatibility
*   **Issue:** iPhones upload images in HEIC format, which most web browsers cannot render, showing broken images in the portal.
*   **Solution:** Implemented dynamic Cloudinary transformation in the frontend. If a file ends in `.heic`, the UI automatically requests a `.jpg` version from Cloudinary's on-the-fly transformation engine.

### 2. Secure PDF Delivery & 401 Resolution
*   **Issue:** Cloudinary blocked PDF downloads with `401 Unauthorized` due to "Strict Transformation" security policies and missing version signatures.
*   **Solution:** 
    *   Enabled **PDF/ZIP Delivery** in Cloudinary settings.
    *   Updated the backend to extract and pass the exact **Version String** (e.g., `v1778...`) into the signed URL generator, ensuring perfect cryptographic signatures.

### 3. Multi-Page ZIP Bundling
*   **Issue:** Downloading multi-page exams one-by-one was slow and often blocked by mobile "pop-up blockers."
*   **Solution:** Integrated `cloudinary.utils.download_zip_url`. The system now automatically bundles multi-file exams into a single `.zip` archive on the Cloudinary side for a fast, single-click download experience.

---

## 👑 SECTION 3: ADMIN USER MANAGEMENT

### 1. User Management Interface
*   **Feature:** Created `UserManagement.jsx` to allow administrators to manage portal access without using database tools.
*   **Capabilities:** 
    *   Live search by name/email/role.
    *   Joined-date tracking (using `created_at` alias).
    *   Secure user deletion with confirmation modals.

### 2. Administrator Safety Block
*   **Issue:** High risk of an admin accidentally deleting their own account, locking everyone out of the system.
*   **Solution:** Implemented a backend check in `authController.deleteUser` that compares the target ID with the `req.user.id`. If they match, the server returns a `400 Security Block` error.

---

## 🚀 FINAL DEPLOYMENT CHECKLIST
- [x] All database queries use Parameterized Inputs (SQL Injection Safe).
- [x] JWT Tokens are stored in HttpOnly, Secure, SameSite:None cookies.
- [x] Cloudinary URLs are signed and hidden from direct browser exposure.
- [x] Passwords are encrypted with `bcrypt` (Salt rounds: 10).
- [x] Rate limits are active on all sensitive endpoints.

**End of Log.**
