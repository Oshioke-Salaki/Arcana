function AuthRequired({
  login,
  isInitializing,
}: {
  isInitializing: boolean;
  login: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative group cursor-pointer" onClick={login}>
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-24 h-24 bg-zinc-900 ring-1 ring-white/10 rounded-full flex items-center justify-center shadow-2xl">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white group-hover:scale-110 transition-transform duration-300"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-white mt-8 mb-3">
        Authenticate Identity
      </h3>
      <p className="text-zinc-500 mb-10 text-center max-w-sm">
        Sign a message to derive your zero-knowledge keys. This session is
        stored locally.
      </p>

      <button
        onClick={login}
        disabled={isInitializing}
        className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isInitializing ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Deriving Keys...
          </span>
        ) : (
          "Initialize Vault"
        )}
      </button>
    </div>
  );
}

export default AuthRequired;
