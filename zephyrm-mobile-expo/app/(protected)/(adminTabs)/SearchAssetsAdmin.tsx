/**
 * SearchAssetsAdmin screen
 *
 * @module app/(protected)/(adminTabs)/SearchAssetsAdmin
 */

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewAssetsDetails from "../../../components/Assets/ViewAssetsDetails";
import SearchBar from "../../../components/SearchBar";
import { useAssetsStore } from "../../../hooks/assetsHooks/useAssetsStore";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useUIStore } from "../../../hooks/ui/useUiStore";
import { useUsersStore } from "../../../hooks/users/useUsersStore";
import { Asset } from "../../../interfaces";
import { User } from "../../../interfaces/login/userInterface";

/**
 * The SearchAssetsAdmin component displays a table with all the assets that an admin can manage.
 * The table includes the following columns: Title, Category, Description, Acquisition Date, Location, State, User.
 * The user can search for assets by typing in the search bar at the top of the screen.
 * Each row is a TouchableOpacity that displays the asset details modal when long pressed.
 * The modal displays the asset details and allows the user to delete or clear the asset.
 * The user can close the modal by pressing the close button at the bottom of the screen.
 * The table is updated every time the user navigates to the screen or when the user searches for assets.
 *
 * @returns {JSX.Element} A JSX element representing the component.
 */
export default function SearchAssetsAdmin() {
  const {
    assets,
    activeAsset,
    startLoadingAssets,
    setActiveAsset,
    startDeletingAsset,
    startSavingAsset,
  } = useAssetsStore();
  const {
    isAssetDetailsModalOpen,
    openAssetsDetailsModal,
    closeAssetsDetailsModal,
  } = useUIStore();
  const { users, startLoadingUsers } = useUsersStore();
  const { user } = useAuthStore();

  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;

  const [filteredAssets, setFilteredAssets] = useState(assets);

  /**
   * Returns the color code associated with the given asset state.
   *
   * @param {Asset["state"]} state - The state of the asset.
   * @returns {string} The hexadecimal color code representing the asset state.
   */
  const getStateColor = (state: Asset["state"]) => {
    switch (state) {
      case "Free":
        return "#4caf50";
      case "On loan":
        return "#fbc02d";
      case "Under maintenance":
        return "#03a9f4";
      case "Broken":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  /**
   * Filters the assets based on the given search term.
   *
   * This function will be called every time the user types in the search bar.
   * It will filter the assets based on the given search term and update the state of the component.
   *
   * The search term is case insensitive and will be searched in the following columns:
   * Title, Category, Location, State, User.
   *
   * @param {string} searchTerm - The search term to filter the assets by.
   */
  const handleAssetSearch = (searchTerm: string) => {
    const result = assets.filter((asset: Asset) => {
      const userName =
        users.find((user: User) => user.uid === asset.user)?.name ||
        "Unassigned";

      return (
        asset.title.toLocaleLowerCase().includes(searchTerm) ||
        asset.category.toLocaleLowerCase().includes(searchTerm) ||
        asset.location.toLocaleLowerCase().includes(searchTerm) ||
        asset.state.toLocaleLowerCase().includes(searchTerm) ||
        userName.toLocaleLowerCase()?.includes(searchTerm)
      );
    });
    setFilteredAssets(result);
  };

  /**
   * Handles the long press event on an asset in the list.
   *
   * When an asset is long pressed, this function will be called.
   * It will set the active asset to the asset that was long pressed and open the asset details modal.
   *
   * @param {Asset} asset - The asset that was long pressed.
   */
  const handleLongClick = (asset: Asset) => {
    setActiveAsset(asset);
    openAssetsDetailsModal();
  };

  /**
   * Handles the delete button being pressed in the asset details modal.
   *
   * This function will be called when the user presses the delete button in the asset details modal.
   * It will delete the active asset and close the asset details modal.
   *
   * @param {Asset} asset - The asset to be deleted.
   */
  const handleDelete = (asset: Asset) => {
    startDeletingAsset(asset.aid!);
    setActiveAsset(null);
    closeAssetsDetailsModal();
  };

  /**
   * Resets the state of the component when the user closes the asset details modal.
   *
   * @remarks
   * This function is called when the user presses the "Close" button in the asset details modal.
   * It resets the state of the component to not be displaying any asset details
   * and clears any existing active asset data.
   */
  const handleClose = () => {
    setActiveAsset(null);
    closeAssetsDetailsModal();
  };

  /**
   * Clears the NFC tag from the active asset and updates its state.
   *
   * @remarks
   * This function is called to remove the NFC tag associated with the active asset.
   * It updates the asset by clearing its NFC tag, saves the updated asset,
   * and sets the updated asset as the active asset.
   */
  const handleClear = () => {
    const updatedAsset = { ...activeAsset, nfcTag: "" };
    startSavingAsset(updatedAsset);
    setActiveAsset(updatedAsset);
  };

  /**
   * Loads the assets and users when the component mounts.
   *
   * @remarks
   * This function is called when the component mounts.
   * It loads the assets and users and sets the last loaded time to the current time.
   */
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();

      if (
        !lastLoadedRef.current ||
        now - lastLoadedRef.current > Number(reloadTime)
      ) {
        startLoadingAssets();
        startLoadingUsers();
        lastLoadedRef.current = now;
      }
    }, [])
  );

  /**
   * Sets the filtered assets to the assets when the assets change.
   */
  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleAssetSearch} placeholder="Search assets..." />

      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          <View style={styles.tableHeaderRow}>
            {[
              "#",
              "Title",
              "Category",
              "Description",
              "Acquisition Date",
              "Location",
              "State",
              "User",
            ].map((header) => (
              <Text key={header} style={styles.headerCell}>
                {header}
              </Text>
            ))}
          </View>
          <ScrollView style={styles.tableBody}>
            {filteredAssets.map((asset: Asset, index: number) => (
              <TouchableOpacity
                key={asset.aid}
                style={[
                  asset.user === user.uid
                    ? [styles.tableRow, { backgroundColor: "#e0f7fa" }]
                    : styles.tableRow,
                ]}
                onLongPress={() => handleLongClick(asset)}
              >
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{asset.title}</Text>
                <Text style={styles.cell}>{asset.category}</Text>
                <Text
                  style={styles.cell}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {asset.description.length > 15
                    ? asset.description.substring(0, 15) + "..."
                    : asset.description}
                </Text>
                <Text style={styles.cell}>
                  {asset.acquisitionDate
                    ? new Date(asset.acquisitionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not specified"}
                </Text>
                <Text style={styles.cell}>{asset.location}</Text>
                <Text
                  style={[
                    styles.cell,
                    { color: getStateColor(asset.state), fontWeight: "600" },
                  ]}
                >
                  {asset.state}
                </Text>
                <Text style={styles.cell}>
                  {users.find((user: User) => user.uid === asset.user)?.name ||
                    "Unassigned"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        visible={isAssetDetailsModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ViewAssetsDetails
              key={activeAsset?.aid}
              onDelete={handleDelete}
              onClear={handleClear}
            />
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableBody: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    padding: 12,
    fontWeight: "bold",
    color: "#495057",
    minWidth: 120,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cell: {
    padding: 12,
    minWidth: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
