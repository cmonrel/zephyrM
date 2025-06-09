/**
 * NFCTags screen
 *
 * @module app/(protected)/(adminTabs)/NFCTags
 */

import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NfcManager, { NfcTech, TagEvent } from "react-native-nfc-manager";

import CreateAssetByNFC from "../../../components/Assets/CreateAssetByNFC";
import ViewAssetsDetails from "../../../components/Assets/ViewAssetsDetails";
import { AssetSelectionModal } from "../../../components/AssetSelectionModal";
import { useAssetsStore } from "../../../hooks/assetsHooks/useAssetsStore";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { useUIStore } from "../../../hooks/ui/useUiStore";
import { Asset } from "../../../interfaces";

/**
 * Screen for scanning NFC tags to create, assign or view assets
 *
 * @returns {JSX.Element} The JSX element for the NFCTagScreen
 */
export default function NFCTagScreen() {
  const { user } = useAuthStore();
  const {
    assets,
    activeAsset,
    setActiveAsset,
    startLoadingAssets,
    startSavingAsset,
    startDeletingAsset,
  } = useAssetsStore();
  const {
    isCreatingModalOpen,
    openCreatingModal,
    closeCreatingModal,
    isAssetSelectionModalOpen,
    openAssetSelectionModal,
    closeAssetSelectionModal,
  } = useUIStore();

  const [tag, setTag] = useState<TagEvent | null>(null);
  const [nfcAsset, setNfcAsset] = useState<Asset | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);

  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;

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
   * Reads an NFC tag and handles the result.
   * If the NFC tag is not assigned to an asset, opens the decision buttons.
   * If the NFC tag is assigned to an asset, opens the view asset modal.
   * If the NFC tag is invalid, displays an error message.
   * If the NFC tag cannot be read, displays an error message.
   */
  const readNfc = async () => {
    setActiveAsset(null);
    setTag(null);

    const isEnabled = await NfcManager.isEnabled();

    if (!isEnabled) {
      Alert.alert("NFC Error", "NFC is not enabled on your device.");
      await NfcManager.goToNfcSetting();
      return;
    }

    try {
      setIsScanning(true);

      await NfcManager.requestTechnology(NfcTech.NfcA);

      const tag = await NfcManager.getTag();

      if (tag) {
        const asset = await assets.find(
          (asset: Asset) => asset.nfcTag === tag.id
        );
        if (!asset) {
          setTag(tag);
          setIsDeciding(true);
          return;
        } else {
          setNfcAsset(null);
          setActiveAsset(asset);
          setTag(tag);
          setIsDeciding(true);
        }
      }
    } catch (err) {
      console.warn("NFC Scan failed", err);
      Alert.alert("NFC Error", "Failed to read NFC tag.");
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
      NfcManager.unregisterTagEvent();
    }
  };

  /**
   * Resets the state of the component when the user closes the create asset modal.
   *
   * @remarks
   * This function is called when the user presses the "Cancel" button while deciding what to do with a new asset.
   * It resets the state of the component to not be deciding what to do with the NFC tag and clears any
   * existing new asset data.
   */
  const handleClose = () => {
    setActiveAsset(null);
    setTag(null);
    closeCreatingModal();
    setIsDeciding(false);
  };

  /**
   * Deletes the asset associated with the NFC tag.
   *
   * @remarks
   * This function is called when the user presses the "Delete" button while deciding what to do with a new asset.
   * It deletes the asset associated with the NFC tag and resets the state of the component to not be deciding what
   * to do with the NFC tag and clears any existing new asset data.
   */
  const handleDelete = () => {
    startDeletingAsset(activeAsset.aid);
    setTag(null);
    setIsDeciding(false);
  };

  /**
   * Opens the create asset modal when the user presses the "Create" button while deciding what to do with a new asset.
   *
   * @remarks
   * This function is called when the user presses the "Create" button while deciding what to do with a new asset.
   * It opens the create asset modal and resets the state of the component to not be deciding what to do with the
   * NFC tag and clears any existing new asset data.
   */
  const handleCreating = () => {
    openCreatingModal();
  };

  /**
   * Opens the asset selection modal when the user presses the "Assign" button while deciding what to do with a new asset.
   *
   * @remarks
   * This function is called when the user presses the "Assign" button while deciding what to do with a new asset.
   * It opens the asset selection modal and resets the state of the component to not be deciding what to do with the
   * NFC tag and clears any existing new asset data.
   */
  const handleAssetSelection = () => {
    openAssetSelectionModal();
    setIsDeciding(false);
  };

  /**
   * Handles the selection of an asset in the asset selection modal.
   *
   * @param {Asset} asset - The selected asset.
   *
   * @remarks
   * This function is called when the user selects an asset in the asset selection modal.
   * It assigns the NFC tag to the selected asset and saves the asset with the NFC tag.
   * It also resets the state of the component to not be deciding what to do with the NFC tag
   * and clears any existing new asset data.
   */
  const onSelectAsset = (asset: Asset) => {
    const nfcAsset = {
      ...asset,
      nfcTag: tag?.id,
    };

    if (nfcAsset) {
      startSavingAsset(nfcAsset);
      setNfcAsset(nfcAsset);
    }
    closeAssetSelectionModal();
  };

  /**
   * Removes the NFC tag associated with the active asset.
   *
   * @remarks
   * This function is called when the user presses the "Remove NFC tag" button while deciding what to do with a new asset.
   * It removes the NFC tag associated with the active asset and saves the asset without the NFC tag.
   * It also resets the state of the component to not be deciding what to do with the NFC tag
   * and clears any existing new asset data.
   */
  const removeNFCTag = async () => {
    const updatedAsset = { ...activeAsset, nfcTag: "" };
    await startSavingAsset(updatedAsset);

    setTag(null);
    setActiveAsset(null);
    setIsDeciding(false);
  };

  /**
   * Marks the active asset as "Free" and clears the user associated with the asset.
   *
   * @remarks
   * This function is called when the user presses the "Return asset" button when an nfc is scanned and is assigned.
   * It changes the state of the active asset to "Free", clears the user associated with the asset, and saves the updated asset.
   */
  const handleMarkAsFree = () => {
    if (activeAsset) {
      const updatedAsset = { ...activeAsset, state: "Free", user: null };
      startSavingAsset(updatedAsset);
      setActiveAsset(updatedAsset);
    }
  };

  /**
   * Cancels the NFC technology request when the component unmounts.
   */
  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  /**
   * Reloads the assets if they haven't been loaded recently.
   *
   * @remarks
   * This function is called when the component mounts and whenever the reload time has passed since the last load.
   * It reloads the assets and updates the last loaded time.
   */
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();

      if (
        !lastLoadedRef.current ||
        now - lastLoadedRef.current > Number(reloadTime)
      ) {
        startLoadingAssets();
        lastLoadedRef.current = now;
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan NFC Tag</Text>

      {tag && (
        <>
          {activeAsset && (
            <View style={styles.assetContainer}>
              <ViewAssetsDetails
                key={activeAsset.aid}
                onDelete={handleDelete}
                onClear={removeNFCTag}
              />

              {activeAsset.state === "On loan" &&
                activeAsset.user === user.uid && (
                  <Pressable
                    style={styles.buttonPrimary}
                    onPress={handleMarkAsFree}
                  >
                    <Text style={styles.buttonPrimaryText}>Return asset</Text>
                  </Pressable>
                )}

              <Pressable style={styles.buttonSecondary} onPress={handleClose}>
                <Text style={styles.buttonSecondaryText}>Close details</Text>
              </Pressable>
            </View>
          )}

          {isDeciding && !activeAsset && !isCreatingModalOpen && (
            <View style={styles.buttonGroup}>
              <View style={styles.topBtns}>
                <Pressable style={[styles.createBtn]} onPress={handleCreating}>
                  <Text style={styles.createBtnText}>Create Asset</Text>
                </Pressable>

                <Pressable
                  style={styles.assignBtn}
                  onPress={handleAssetSelection}
                >
                  <Text style={styles.assignBtnText}>Assign to Asset</Text>
                </Pressable>
              </View>

              <Pressable style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </>
      )}

      {isCreatingModalOpen && tag && (
        <CreateAssetByNFC
          key={tag.id}
          nfcTag={tag.id!}
          onClose={() => handleClose()}
        />
      )}

      {isAssetSelectionModalOpen && tag && (
        <AssetSelectionModal onSelect={onSelectAsset} />
      )}

      {!isDeciding && (
        <>
          {nfcAsset && tag && (
            <View style={styles.nfcInfoContainer}>
              <View style={styles.nfcContainer}>
                <Text style={styles.nfcTextTitle}>NFC Tag: </Text>
                <Text style={styles.nfcText}>{tag.id}</Text>
              </View>
              <View style={styles.nfcContainer}>
                <Text style={styles.nfcTextTitle}>Asset: </Text>
                <Text style={styles.nfcText}>{nfcAsset.title}</Text>
              </View>
              <View style={styles.nfcContainer}>
                <Text style={styles.nfcTextTitle}>Category: </Text>
                <Text style={styles.nfcText}>{nfcAsset.category}</Text>
              </View>
              <View style={styles.nfcContainer}>
                <Text style={styles.nfcTextTitle}>Asset state: </Text>

                <Text
                  style={[
                    styles.nfcText,
                    {
                      color: getStateColor(nfcAsset.state),
                      fontWeight: "600",
                    },
                  ]}
                >
                  {nfcAsset.state}
                </Text>
              </View>
            </View>
          )}

          <Pressable
            style={[styles.buttonPrimary, isScanning && styles.buttonDisabled]}
            onPress={readNfc}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Scan Tag</Text>
            )}
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#333",
  },
  assetContainer: {
    width: "100%",
    marginBottom: 24,
  },
  buttonPrimary: {
    backgroundColor: "#007aff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    marginTop: 16,
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonSecondaryText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGroup: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  topBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  createBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  assignBtn: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  assignBtnText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f44336",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  nfcInfoContainer: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  nfcContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nfcTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
  },
  nfcText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
});
