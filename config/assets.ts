export type AssetConfig = {
  symbol: string;
  name: string;
  decimals: number;
  erc20Address: string;
  tongoAddress: string;
  rate: bigint;
};

export const ASSETS: Record<string, AssetConfig> = {
  STRK: {
    symbol: "STRK",
    name: "Starknet Token",
    decimals: 18,
    erc20Address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    tongoAddress:
      "0x3a542d7eb73b3e33a2c54e9827ec17a6365e289ec35ccc94dde97950d9db498",
    rate: 50000000000000000n,
  },
  ETH: {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    erc20Address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    tongoAddress:
      "0x276e11a5428f6de18a38b7abc1d60abc75ce20aa3a925e20a393fcec9104f89",
    rate: 3000000000000n,
  },
  wBTC: {
    symbol: "wBTC",
    name: "Wrapped BTC",
    decimals: 8,
    erc20Address:
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    tongoAddress:
      "0x72098b84989a45cc00697431dfba300f1f5d144ae916e98287418af4e548d96",
    rate: 10n,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    erc20Address:
      "0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb",
    tongoAddress:
      "0x72098b84989a45cc00697431dfba300f1f5d144ae916e98287418af4e548d96",
    rate: 10000n,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    erc20Address:
      "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    tongoAddress:
      "0x659c62ba8bc3ac92ace36ba190b350451d0c767aa973dd63b042b59cc065da0",
    rate: 10000n,
  },
};
