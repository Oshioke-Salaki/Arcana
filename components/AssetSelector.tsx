import { AssetConfig, ASSETS } from "@/config/assets";
import { AssetType } from "@/hooks/useArcana";

function AssetSelector({
  selectedAsset,
  setSelectedAssetKey,
}: {
  selectedAsset: AssetConfig;
  setSelectedAssetKey: (key: AssetType) => void;
}) {
  return (
    <div className="mb-16 flex justify-center">
      <div className="flex p-1.5 bg-zinc-900/60 border border-white/5 rounded-2xl backdrop-blur-xl shadow-2xl">
        {(Object.keys(ASSETS) as AssetType[]).map((assetKey) => (
          <button
            key={assetKey}
            onClick={() => setSelectedAssetKey(assetKey)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              selectedAsset.symbol === assetKey
                ? "bg-zinc-800 text-white shadow-lg ring-1 ring-white/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
            }`}
          >
            {assetKey}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AssetSelector;
