"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { createPortal } from "react-dom";
import { truncateAddress } from "@/utils/utils";
import { ArrowRight, ChevronDown, LogOut, User, Wallet, X } from "lucide-react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectModal = ({ isOpen, onClose }: ConnectModalProps) => {
  const { connect, connectors } = useConnect();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
          >
            <X />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {connectors.map((connector) => {
            if (!connector.available()) return null;

            return (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  onClose();
                }}
                className="w-full flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-x-2">
                  <img
                    src={connector.icon as string}
                    className="w-6 h-6"
                    alt=""
                  />
                  <span className="font-bold text-zinc-200 group-hover:text-white">
                    {connector.id === "argentX"
                      ? "Ready"
                      : connector.id === "braavos"
                      ? "Braavos"
                      : connector.name}
                  </span>
                </div>

                {/* Arrow Right Icon */}
                <div className="text-zinc-600 group-hover:text-indigo-400 transition-colors">
                  <ArrowRight />
                </div>
              </button>
            );
          })}

          {connectors.length === 0 && (
            <div className="text-center py-6 text-zinc-500 text-sm">
              No wallets detected. Please install Argent X or Braavos.
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-950/50 text-center">
          <p className="text-xs text-zinc-600">
            By connecting, you agree to Arcana's Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

const UserMenu = ({ address }: { address: string }) => {
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all"
      >
        <div className="rounded-full  flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
          <User size={20} />
        </div>
        <span className="text-sm font-medium text-zinc-300">
          {truncateAddress(address)}
        </span>
        <ChevronDown />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 animate-in slide-in-from-top-2 duration-150 z-40">
          <div className="px-4 py-3 border-b border-zinc-800 mb-2">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
              Connected Wallet
            </p>
            <p className="text-xs text-zinc-300 mt-1 font-mono truncate">
              {address}
            </p>
          </div>

          <button
            onClick={() => {
              disconnect();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-2 transition-colors"
          >
            <LogOut size={20} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default function WalletConnect() {
  const { address, status } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "connected" && address) {
    return <UserMenu address={address} />;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold rounded-full transition-all text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      >
        <Wallet />
        Connect Wallet
      </button>

      {isModalOpen &&
        createPortal(
          <ConnectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
}
