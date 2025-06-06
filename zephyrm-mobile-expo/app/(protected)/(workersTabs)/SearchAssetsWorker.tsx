/**
 * SearchAssetsWorker screen
 *
 * @module app/(protected)/(workersTabs)/SearchAssetsWorker
 */

import { useFocusEffect } from "expo-router";
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
 * SearchAssetsWorker component
 *
 * This component displays a searchable table of assets for workers. It allows
 * users to filter assets by various fields such as title, category, location,
 * state, and user. The assets are displayed in a scrollable table format with
 * columns for Title, Category, Description, Acquisition Date, Location, State,
 * and User. Each row in the table is a touchable element that opens a modal
 * displaying detailed information about the asset when long-pressed.
 *
 * The component loads assets and users from the store and updates the table
 * based on user input in the search bar. It also highlights assets assigned
 * to the current user. The modal allows users to view asset details and close
 * it as needed.
 */
export default function SearchAssetsWorker() {
  const { assets, activeAsset, startLoadingAssets, setActiveAsset } =
    useAssetsStore();
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
   * Filters the assets based on the provided search term and updates the filtered assets state.
   *
   * This function performs a case-insensitive search through various fields of each asset,
   * including the title, category, location, state, and associated user's name.
   *
   * @param {string} searchTerm - The term used to filter the assets.
   * The search is case-insensitive and matches any part of the text within the asset fields.
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
   * Resets the state of the component when the asset details modal is closed.
   *
   * @remarks
   * This function is called when the user closes the asset details modal.
   * It clears the active asset state and closes the modal.
   */
  const handleClose = () => {
    setActiveAsset(null);
    closeAssetsDetailsModal();
  };

  /**
   * It loads assets and users when the screen is focused
   *
   * @remarks
   * This function is called when the screen is focused and whenever the reload time has passed since the last load.
   * It loads the assets and users and updates the last loaded time.
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
   * It sets the filtered assets to the assets array when the assets array changes
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
            ].map((header, i) => (
              <Text key={i} style={styles.headerCell}>
                {header}
              </Text>
            ))}
          </View>

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
              <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
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
            <ViewAssetsDetails key={activeAsset?.aid} onDelete={handleClose} />
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
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  tableContainer: {
    marginBottom: 20,
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
    maxHeight: "80%",
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
