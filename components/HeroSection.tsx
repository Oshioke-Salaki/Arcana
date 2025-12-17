import React from "react";

function HeroSection() {
  return (
    <div className="text-center py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">
        <span className="bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Privacy is not a crime.
        </span>
      </h1>
      <p className="text-zinc-400 text-xl max-w-lg mx-auto mb-10 leading-relaxed">
        Wrap your public assets into the{" "}
        <span className="text-indigo-400">Arcana Vault</span>. Break the link
        between your identity and your wealth.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Live on Starknet Mainnet
      </div>
    </div>
  );
}

export default HeroSection;
