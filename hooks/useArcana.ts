// src/hooks/useArcana.ts
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";
import { hash, constants, ec, RpcProvider, CallData } from "starknet";
import { ASSETS } from "@/config/assets";

export type AssetType = "STRK" | "ETH" | "USDC" | "USDT" | "WBTC";

export const useArcana = () => {
  const { account, address } = useAccount();

  // State: Authentication & SDK
  const [tongoAccount, setTongoAccount] = useState<TongoAccount | null>(null);
  const [derivedKey, setDerivedKey] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // State: Assets & Balances
  const [selectedAssetKey, _setSelectedAssetKey] = useState<AssetType>("STRK"); // Renamed internal setter
  const [publicBalance, setPublicBalance] = useState<bigint>(0n);
  const [privateBalance, setPrivateBalance] = useState<bigint>(0n);
  const [pendingBalance, setPendingBalance] = useState<bigint>(0n);
  const [isSyncing, setIsSyncing] = useState(false);

  // NEW: Loading State
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);

  // Derived Values
  const selectedAsset = ASSETS[selectedAssetKey];

  // Wrapper to trigger loading state when switching assets
  const setSelectedAssetKey = (key: AssetType) => {
    setIsLoadingBalances(true);
    _setSelectedAssetKey(key);
  };

  // Dedicated Tongo Provider (Mainnet RPC)
  const tongoProvider = useMemo(() => {
    return new RpcProvider({
      nodeUrl:
        "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/L-VhhXxIK2EZXjZfcTn-q5tY4u_GHkoc",
    });
  }, []);

  // --- 3. LOGIN & KEY DERIVATION ---
  const login = useCallback(async () => {
    if (!account || !address) return;
    setIsInitializing(true);

    try {
      // Sign message to prove identity
      const signature = await account.signMessage({
        types: {
          StarkNetDomain: [
            { name: "name", type: "felt" },
            { name: "version", type: "felt" },
            { name: "chainId", type: "felt" },
          ],
          Message: [{ name: "action", type: "felt" }],
        },
        primaryType: "Message",
        domain: {
          name: "Arcana Tongo Identity",
          version: "1",
          chainId: constants.StarknetChainId.SN_MAIN,
        },
        message: { action: "login" },
      });

      // Extract R and S
      let r, s;
      if (Array.isArray(signature)) {
        r = signature[0];
        s = signature[1];
      } else {
        // @ts-ignore
        r = signature.r;
        s = signature.s;
      }

      // Generate deterministic Private Key
      let seed = hash.computePoseidonHash(r, s);
      if (typeof seed === "string" && !seed.startsWith("0x"))
        seed = "0x" + seed;

      let privateKey = ec.starkCurve.grindKey(seed);
      if (typeof privateKey === "string" && !privateKey.startsWith("0x"))
        privateKey = "0x" + privateKey;

      setDerivedKey(privateKey);
    } catch (err: any) {
      console.error("Login Error:", err);
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [account, address]);

  const logout = useCallback(() => {
    setDerivedKey(null);
    setTongoAccount(null);
    setPrivateBalance(0n);
    setPendingBalance(0n);
  }, []);

  // --- 4. INSTANTIATE TONGO SDK ---
  // Re-runs whenever the user switches assets or logs in
  useEffect(() => {
    if (!derivedKey || !selectedAsset || !tongoProvider) return;

    try {
      const newTongoAccount = new TongoAccount(
        derivedKey,
        selectedAsset.tongoAddress,
        tongoProvider as any
      );
      setTongoAccount(newTongoAccount);
    } catch (e) {
      console.error("SDK Init Error:", e);
    }
  }, [derivedKey, selectedAsset, tongoProvider]);

  // --- 5. FETCH BALANCES ---
  const fetchBalances = useCallback(async () => {
    if (!address || !selectedAsset) return;

    try {
      // A. Public ERC20 Balance
      // We use a basic call to the ERC20 contract
      const erc20Call = {
        contractAddress: selectedAsset.erc20Address,
        entrypoint: "balanceOf",
        calldata: CallData.compile([address]),
      };
      const result = await tongoProvider.callContract(erc20Call);
      // Result is [low, high] for Uint256
      const balanceLow = BigInt(result[0]);
      const balanceHigh = BigInt(result[1]);
      const publicBal = balanceLow + (balanceHigh << 128n);
      setPublicBalance(publicBal);

      // B. Private Tongo Balance (Only if logged in)
      if (tongoAccount) {
        // .state() automatically decrypts using the stored hint
        const state = await tongoAccount.state();
        console.log(state, "privateeee");
        setPrivateBalance(state.balance * selectedAsset.rate);
        setPendingBalance(state.pending);
      }
    } catch (e) {
      console.error("Balance Fetch Error:", e);
    } finally {
      // Stop loading once fetch is complete (success or fail)
      setIsLoadingBalances(false);
    }
  }, [address, selectedAsset, tongoAccount, tongoProvider]);

  // Auto-fetch loop
  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [fetchBalances]);

  // --- 6. ACTIONS (SYNC / ROLLOVER) ---
  const syncFunds = async () => {
    if (!tongoAccount || !account) return;
    setIsSyncing(true);
    try {
      const op = await tongoAccount.rollover({
        sender: address as `0x${string}`,
      });

      const call = op.toCalldata();

      const tx = await account.execute([call]);
      await tongoProvider.waitForTransaction(tx.transaction_hash);

      await fetchBalances(); // Refresh UI
    } catch (e) {
      console.error("Sync failed:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- 7. EXPORT ---
  return {
    // Auth & Status
    isAuthenticated: !!derivedKey,
    isInitializing,
    login,
    logout,

    // Core Objects
    tongoAccount,

    // Asset Management
    selectedAsset,
    setSelectedAssetKey, // This now triggers the loading state

    // Data
    publicBalance,
    privateBalance,
    pendingBalance,
    conversionRate: selectedAsset.rate,
    isLoadingBalances, // Exported for UI consumption

    // Actions
    syncFunds,
    isSyncing,
    refreshBalances: fetchBalances,
  };
};
