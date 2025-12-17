export const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (amount: bigint, decimals: number) => {
  if (amount === 0n) return "0.00";
  const str = amount.toString();
  const padded = str.padStart(decimals + 1, "0");
  const integerPart = padded.slice(0, -decimals);
  const fractionalPart = padded.slice(-decimals).slice(0, 3);
  return `${integerPart}.${fractionalPart}`;
};
