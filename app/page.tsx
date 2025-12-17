"use client";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useArcana } from "../hooks/useArcana";
import WalletConnect from "../components/WalletConnect";
import ActionModal from "@/components/ActionModal";
import { Layers } from "lucide-react";
import AssetSelector from "@/components/AssetSelector";
import HeroSection from "@/components/HeroSection";
import PublicWallet from "@/components/PublicWallet";
import AuthRequired from "@/components/AuthRequired";
import PrivateWallet from "@/components/PrivateWallet";
import Footer from "@/components/Footer";

export default function ArcanaApp() {
  const { status } = useAccount();
  const {
    isAuthenticated,
    isInitializing,
    login,
    selectedAsset,
    setSelectedAssetKey,
    publicBalance,
    privateBalance,
    pendingBalance,
    isLoadingBalances,
    syncFunds,
    isSyncing,
    tongoAccount,
    refreshBalances,
  } = useArcana();

  const [modalType, setModalType] = useState<
    "WRAP" | "UNWRAP" | "TRANSFER" | null
  >(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 bg-[url('/noise.png')] bg-fixed">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <Layers />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              Arcana.
            </span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      <main className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto z-10">
        {status === "connected" && (
          <AssetSelector
            selectedAsset={selectedAsset}
            setSelectedAssetKey={setSelectedAssetKey}
          />
        )}
        {status !== "connected" ? (
          <HeroSection />
        ) : !isAuthenticated ? (
          <AuthRequired isInitializing={isInitializing} login={login} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <PublicWallet
              isLoadingBalances={isLoadingBalances}
              publicBalance={publicBalance}
              selectedAsset={selectedAsset}
              setModalType={setModalType}
            />

            <PrivateWallet
              isLoadingBalances={isLoadingBalances}
              privateBalance={privateBalance}
              selectedAsset={selectedAsset}
              pendingBalance={pendingBalance}
              syncFunds={syncFunds}
              setModalType={setModalType}
              isSyncing={isSyncing}
            />
          </div>
        )}
      </main>

      {tongoAccount && status === "connected" && modalType && (
        <ActionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
          asset={selectedAsset}
          tongoAccount={tongoAccount}
          signer={tongoAccount as any}
          onSuccess={refreshBalances}
        />
      )}

      <Footer />
    </div>
  );
}
