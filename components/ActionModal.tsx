"use client";

import { useState, useEffect } from "react";

import {
  Account as TongoAccount,
  //   pubKeyBase58ToAffine,
} from "@fatsolutions/tongo-sdk";
import { useAccount } from "@starknet-react/core";
import { AssetConfig } from "@/config/assets";
import { cairo, CallData } from "starknet";

type ActionType = "WRAP" | "UNWRAP" | "TRANSFER";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: ActionType;
  asset: AssetConfig;
  tongoAccount: TongoAccount;
  onSuccess: () => void;
  signer?: any;
}

// --- Helper: Convert Decimal String to BigInt ---
const parseInput = (amount: string, decimals: number): bigint => {
  if (!amount) return 0n;
  try {
    const [integer, fraction = ""] = amount.split(".");
    const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
    return BigInt(`${integer}${paddedFraction}`);
  } catch (e) {
    return 0n;
  }
};

export default function ActionModal({
  isOpen,
  onClose,
  type,
  asset,
  tongoAccount,
  onSuccess,
}: Props) {
  const { account } = useAccount();

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setRecipient("");
      setLoading(false);
      setStatus("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!account || !tongoAccount) {
      setError("Wallet connection lost");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const amountBigInt = parseInput(amount, asset.decimals);
      const tongoAmount = amountBigInt / (asset.rate || 1n);

      if (amountBigInt <= 0n) {
        throw new Error("Invalid amount");
      }

      let op;
      let approveCall;

      if (type === "WRAP") {
        setStatus("Generating Funding Proof...");
        op = await tongoAccount.fund({
          sender: account.address,
          amount: tongoAmount,
        });

        approveCall = {
          contractAddress: asset.erc20Address,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: asset.tongoAddress,
            amount: cairo.uint256(amountBigInt),
          }),
        };
      } else if (type === "UNWRAP") {
        setStatus("Generating Withdrawal Proof...");

        const destination = recipient.trim() || account.address;

        if (!destination.startsWith("0x")) {
          throw new Error(
            "Destination must be a valid Starknet address (0x...)"
          );
        }

        op = await tongoAccount.withdraw({
          sender: account.address,
          amount: tongoAmount,
          to: destination, // Send public funds here
        });
      }
      //   else if (type === "TRANSFER") {
      //     if (!recipient) throw new Error("Recipient required");

      //     setStatus("Resolving Address...");
      //     let recipientPubKey;
      //     try {
      //       recipientPubKey = pubKeyBase58ToAffine(recipient);
      //     } catch (err) {
      //       throw new Error("Invalid Tongo Address format");
      //     }

      //     setStatus("Encrypting & Proving Transfer...");
      //     op = await tongoAccount.transfer({
      //       sender: account.address,
      //       amount: amountBigInt,
      //       to: recipientPubKey,
      //     });
      //   }

      if (op) {
        setStatus("Sign in Wallet...");
        const call = op.toCalldata();
        const tx = await account.execute(
          approveCall ? [approveCall, call] : [call]
        );

        setStatus("Waiting for Confirmation...");
        await account.waitForTransaction(tx.transaction_hash);

        onSuccess();
        onClose();
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const title =
    type === "WRAP"
      ? `Wrap ${asset.symbol}`
      : type === "UNWRAP"
      ? `Unwrap ${asset.symbol}`
      : `Private Transfer`;

  const description =
    type === "WRAP"
      ? "Convert public assets to shielded Arcana tokens."
      : type === "UNWRAP"
      ? "Convert shielded tokens back to public assets."
      : "Send assets anonymously to another Arcana address.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Amount
              </label>
            </div>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 group-hover:border-zinc-700 focus:border-indigo-500 text-white text-2xl p-4 rounded-xl outline-none transition-all placeholder:text-zinc-800 font-bold"
                placeholder="0.00"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium pointer-events-none">
                {asset.symbol}
              </div>
            </div>
          </div>

          {/* UNWRAP DESTINATION INPUT (NEW) */}
          {type === "UNWRAP" && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Destination Address (Optional)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 focus:border-indigo-500 text-white text-sm p-4 rounded-xl outline-none transition-all placeholder:text-zinc-700 font-mono"
                placeholder={
                  account?.address
                    ? `${account.address.slice(0, 20)}... (Self)`
                    : "0x..."
                }
              />
              <p className="mt-2 text-[10px] text-zinc-500">
                Leave empty to unwrap to your own wallet.
              </p>
            </div>
          )}

          {/* TRANSFER RECIPIENT INPUT */}
          {type === "TRANSFER" && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Recipient (Tongo Address)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 focus:border-indigo-500 text-white text-sm p-4 rounded-xl outline-none transition-all placeholder:text-zinc-700 font-mono"
                placeholder="Um6Q..."
              />
              <p className="mt-2 text-[10px] text-zinc-600">
                ⚠️ Enter a Tongo Public Key (Base58), not a Starknet Address
                (0x...).
              </p>
            </div>
          )}

          {/* Status / Error Messages */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-indigo-400 font-medium animate-pulse">
                {status}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="py-4 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={loading}
              className="py-4 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
