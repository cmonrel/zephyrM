import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBar from "../../../components/SearchBar";
import ViewAssetsDetails from "../../../components/ViewAssetsDetails";
import { useAssetsStore } from "../../../hooks/assetsHooks/useAssetsStore";
import { useUIStore } from "../../../hooks/ui/useUiStore";
import { useUsersStore } from "../../../hooks/users/useUsersStore";
import { Asset } from "../../../interfaces";
import { User } from "../../../interfaces/login/userInterface";

export default function SearchAssetsWorker() {
  const { assets, startLoadingAssets, setActiveAsset } = useAssetsStore();
  const {
    isAssetDetailsModalOpen,
    openAssetsDetailsModal,
    closeAssetsDetailsModal,
  } = useUIStore();
  const { users, startLoadingUsers } = useUsersStore();

  const [filteredAssets, setFilteredAssets] = useState(assets);

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

  const handleLongClick = (asset: Asset) => {
    setActiveAsset(asset);
    openAssetsDetailsModal();
  };

  useEffect(() => {
    startLoadingUsers();
    startLoadingAssets();
  }, []);

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
              style={styles.tableRow}
              onLongPress={() => handleLongClick(asset)}
            >
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{asset.title}</Text>
              <Text style={styles.cell}>{asset.category}</Text>
              <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
                {asset.description}
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
        onRequestClose={closeAssetsDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ViewAssetsDetails />
            <Pressable
              style={styles.closeButton}
              onPress={closeAssetsDetailsModal}
            >
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
