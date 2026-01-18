import { useState, useEffect } from "react";

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

const OfflineHandler = ({ children }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return children;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M12 18.75a20.77 20.77 0 005.184-1.582m-5.184-11.33A20.768 20.768 0 0012 3a20.768 20.768 0 00-6.044 1.58m7.525 3.375c2.406-.396 4.981.082 7.158 1.486m-9.358 1.056c-1.554-.647-3.238-.857-4.877-.577m3.435 4.314a5.96 5.96 0 002.8-1.582m-4.234 4.195a9.013 9.013 0 01-1.38.586"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">No Internet Connection</h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        It seems you are offline. Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition duration-300"
      >
        Retry
      </button>
    </div>
  );
};

export default OfflineHandler;
