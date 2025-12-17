import React, { Dispatch, SetStateAction } from "react";
import BalanceSkeleton from "./BalanceSkeleton";
import { formatBalance } from "@/utils/utils";
import { AssetConfig } from "@/config/assets";

function PrivateWallet({
  isLoadingBalances,
  privateBalance,
  selectedAsset,
  pendingBalance,
  syncFunds,
  setModalType,
  isSyncing,
}: {
  isLoadingBalances: boolean;
  privateBalance: bigint;
  selectedAsset: AssetConfig;
  pendingBalance: bigint;
  syncFunds: () => Promise<void>;
  setModalType: Dispatch<SetStateAction<"WRAP" | "UNWRAP" | "TRANSFER" | null>>;
  isSyncing: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-4xl opacity-30 blur-lg group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative h-full bg-zinc-950 rounded-[30px] border border-indigo-500/20 p-8 flex flex-col justify-between overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Arcana Vault
            </span>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          </div>

          <div className="mb-2 text-indigo-400/60 text-sm font-medium">
            Private Balance
          </div>

          {/* --- UPDATED: Loading State Logic --- */}
          <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight truncate h-12 flex items-center">
            {isLoadingBalances ? (
              <BalanceSkeleton />
            ) : (
              <>
                {formatBalance(privateBalance, selectedAsset.decimals)}
                <span className="text-2xl text-zinc-600 ml-2 font-normal">
                  z{selectedAsset.symbol}
                </span>
              </>
            )}
          </div>

          {/* PENDING NOTIFICATION */}
          <div className="mt-6 h-12">
            {pendingBalance > 0n ? (
              <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <span className="text-xs font-medium text-indigo-200">
                    Incoming:{" "}
                    <span className="text-white font-bold">
                      +{formatBalance(pendingBalance, selectedAsset.decimals)}
                    </span>
                  </span>
                </div>
                <button
                  onClick={syncFunds}
                  disabled={isSyncing}
                  className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-all uppercase tracking-wide"
                >
                  {isSyncing ? "Syncing..." : "Sync"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-500/80 leading-relaxed">
                Assets held here are cryptographically shielded.
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <button
            onClick={() => setModalType("UNWRAP")}
            className="py-4 bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 text-zinc-300 hover:text-white rounded-xl font-bold transition-all"
          >
            Unwrap
          </button>

          {/* COMING SOON - DISABLED */}
          <div className="relative group/btn">
            <button
              disabled
              className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-xl font-bold cursor-not-allowed opacity-70"
            >
              Private Transfer
            </button>
            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-lg transform rotate-3">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateWallet;
