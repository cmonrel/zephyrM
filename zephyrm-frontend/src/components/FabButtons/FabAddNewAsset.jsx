import { useUIStore } from "../../ui/hooks/useUiStore";
import { useAssetsStore } from "../../modules/assetsModule";

export const FabAddNewAsset = () => {
  const { openAssetModal } = useUIStore();
  const { setActiveAsset } = useAssetsStore();

  const handleClickNew = () => {
    setActiveAsset({
      title: "",
      category: "",
      description: "",
      acquisitionDate: new Date(),
      location: "",
      state: "",
    });

    openAssetModal();
  };
  return (
    <button className="btn btn-primary fab" onClick={() => handleClickNew()}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
