import React from "react";

function LoaderScreen() {
  return (
    <main className="min-h-screen bg-momentum-bg flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-white font-medium animate-pulse">Loading...</p>
    </main>
  );
}

export default LoaderScreen;
