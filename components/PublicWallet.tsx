import React, { Dispatch, SetStateAction } from "react";
import BalanceSkeleton from "./BalanceSkeleton";
import { formatBalance } from "@/utils/utils";
import { AssetConfig } from "@/config/assets";

function PublicWallet({
  isLoadingBalances,
  publicBalance,
  selectedAsset,
  setModalType,
}: {
  isLoadingBalances: boolean;
  publicBalance: bigint;
  selectedAsset: AssetConfig;
  setModalType: Dispatch<SetStateAction<"WRAP" | "UNWRAP" | "TRANSFER" | null>>;
}) {
  return (
    <div className="relative p-1 rounded-3xl bg-linear-to-b from-zinc-800 to-zinc-900/50 backdrop-blur-sm border border-white/5">
      <div className="h-full bg-zinc-900/90 rounded-[22px] p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Public Layer
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>

          <div className="mb-2 text-zinc-500 text-sm font-medium">
            Wallet Balance
          </div>

          <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight truncate h-12 flex items-center">
            {isLoadingBalances ? (
              <BalanceSkeleton />
            ) : (
              <>
                {formatBalance(publicBalance, selectedAsset.decimals)}
                <span className="text-2xl text-zinc-600 ml-2 font-normal">
                  {selectedAsset.symbol}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
            This balance is visible to everyone on the Starknet blockchain.
          </p>
        </div>

        <div className="mt-10">
          <button
            onClick={() => setModalType("WRAP")}
            className="group w-full py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3"
          >
            <span>Shield Assets</span>
            <svg
              className="text-zinc-400 group-hover:translate-x-1 transition-transform"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicWallet;
