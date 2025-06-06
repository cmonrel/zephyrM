/**
 * NFCTags screen
 *
 * @module app/(protected)/(workersTabs)/NFCTags
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

import ViewAssetsDetails from "../../../components/Assets/ViewAssetsDetails";
import { useAssetsStore } from "../../../hooks/assetsHooks/useAssetsStore";
import { useAuthStore } from "../../../hooks/auth/useAuthStore";
import { Asset } from "../../../interfaces";

/**
 * Screen for scanning NFC tags.
 *
 * The user can scan an NFC tag and the app will display the details of the asset. If the asset is free
 * it will allow the user to request the use of that asset.
 * If the NFC tag is not assigned to an asset, it then displays the text "No asset found with this tag".
 *
 * @module app/(protected)/(workersTabs)/NFCTags
 * @returns {React.ReactElement} The NFC tags screen.
 */
export default function NFCTagScreen() {
  const { user } = useAuthStore();
  const {
    assets,
    activeAsset,
    setActiveAsset,
    startLoadingAssets,
    startSavingAsset,
  } = useAssetsStore();

  const [tag, setTag] = useState<TagEvent | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAsset, setIsAsset] = useState(false);

  const lastLoadedRef = useRef<number | null>(null);
  const reloadTime = process.env.EXPO_PUBLIC_RELOAD_TIME;

  /**
   * Reads an NFC tag and handles the result.
   * If the NFC tag is not assigned to an asset, displays the text "No asset found with this tag".
   * If the NFC tag is assigned to an asset, displays the details of the asset and allows the user to request
   *  the use of that asset.
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
          return;
        } else {
          setActiveAsset(asset);
          setTag(tag);
          setIsAsset(true);
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
   * Resets the state of the component when the user closes the asset details view.
   *
   * @remarks
   * This function is called to clear the active asset and tag information,
   * and to reset the asset view state when the user has finished viewing asset details.
   */
  const handleClose = () => {
    setActiveAsset(null);
    setTag(null);
    setIsAsset(false);
  };

  /**
   * Marks the active asset as "Free" and clears the user associated with the asset.
   *
   * @remarks
   * This function updates the state of the active asset to "Free" and removes
   * the user assignment, then saves the updated asset and sets it as the
   * active asset. It is typically called to release an asset back to inventory.
   */
  const handleMarkAsFree = () => {
    if (activeAsset) {
      const updatedAsset = { ...activeAsset, state: "Free", user: undefined };
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
   * Loads assets and updates the last loaded time if necessary.
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

      {tag &&
        (activeAsset ? (
          <View style={styles.assetContainer}>
            <ViewAssetsDetails key={activeAsset.aid} />

            <View style={styles.buttonGroup}>
              {activeAsset.user === user.uid && (
                <>
                  <View style={styles.topBtns}>
                    {activeAsset.state === "Under maintenance" && (
                      <Pressable
                        style={[styles.maintenanceBtn]}
                        onPress={handleMarkAsFree}
                      >
                        <Text style={styles.maintenanceBtnText}>
                          End maintenance
                        </Text>
                      </Pressable>
                    )}

                    {activeAsset.state === "On loan" && (
                      <Pressable
                        style={styles.buttonPrimary}
                        onPress={handleMarkAsFree}
                      >
                        <Text style={styles.buttonPrimaryText}>
                          Return asset
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </>
              )}
              <Pressable style={styles.buttonSecondary} onPress={handleClose}>
                <Text style={styles.buttonSecondaryText}>Close details</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.noAssetContainer}>
            <Text style={styles.noAssetText}>No asset found with this tag</Text>
          </View>
        ))}
      {!isAsset && (
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
  maintenanceBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  maintenanceBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  noAssetContainer: {
    width: "100%",
    alignItems: "center",
  },
  noAssetText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
});
