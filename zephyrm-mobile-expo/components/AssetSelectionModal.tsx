/**
 * AssetSelectionModal component
 *
 * @module components/AssetSelectionModal
 */

import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAssetsStore } from "../hooks/assetsHooks/useAssetsStore";
import { useUIStore } from "../hooks/ui/useUiStore";
import { Asset } from "../interfaces";
import SearchBar from "./SearchBar";

/**
 * A modal that shows a list of assets without an NFC tag. The user can search
 * for specific assets and select one to return to the caller.
 *
 * @param {onSelect} - A callback function that takes the selected asset as an
 *   argument.
 *
 * @returns A JSX element that renders a modal with a search bar at the top and a
 *   list of assets below. When a user is selected, the modal is closed and the
 *   onSelect callback is called with the selected user as an argument.
 */
export const AssetSelectionModal = ({
  onSelect,
}: {
  onSelect: (asset: Asset) => void;
}) => {
  const { isAssetSelectionModalOpen, closeAssetSelectionModal } = useUIStore();
  const { assets } = useAssetsStore();

  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filters the assets based on the provided search term and updates the filteredAssets state.
   *
   * This function performs a case-insensitive search through the title and category fields of each asset
   * that does not have an NFC tag. Only assets that match the search term in these fields will be included
   * in the filtered results.
   *
   * @param {string} text - The term used to filter the assets.
   */
  const handleAssetSearch = (text: string) => {
    setSearchTerm(text);
    const term = text.toLowerCase();
    const freeAssets = assets.filter(
      (asset: Asset) =>
        asset.nfcTag === undefined ||
        asset.nfcTag === "" ||
        asset.nfcTag === null
    );
    const result = freeAssets.filter(
      (asset: Asset) =>
        asset.title.toLowerCase().includes(term) ||
        asset.category.toLowerCase().includes(term)
    );

    setFilteredAssets(result);
  };

  /**
   * Closes the asset selection modal and calls the onSelect callback with the selected asset as an argument.
   *
   * @param {Asset} asset - The selected asset.
   */
  const handleSelect = (asset: Asset) => {
    onSelect(asset);
    closeAssetSelectionModal();
  };

  /**
   * Updates the filteredAssets state whenever the assets state changes.
   */
  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  /**
   * Updates the filteredAssets state whenever the assets state changes.
   */
  useEffect(() => {
    const freeAssets = assets.filter(
      (asset: Asset) =>
        asset.nfcTag === undefined ||
        asset.nfcTag === "" ||
        asset.nfcTag === null
    );
    setFilteredAssets(freeAssets);
  }, [assets]);

  return (
    <Modal
      visible={isAssetSelectionModalOpen}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Asset</Text>

          <SearchBar
            onSearch={handleAssetSearch}
            placeholder="Search Asset..."
          />

          <FlatList
            data={filteredAssets}
            keyExtractor={(item) => item.aid}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleSelect(item)} style={styles.item}>
                <Text style={styles.itemText}>
                  {item.title} ({item.category})
                </Text>
                <Text style={styles.itemState}>{item.state}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity
            onPress={closeAssetSelectionModal}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  itemState: {
    fontSize: 12,
    color: "#888",
  },
  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "red",
    fontWeight: "500",
  },
});
