import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function NFCTagScreen() {
  const [tag, setTag] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const readNfc = async () => {
    try {
      setIsScanning(true);
      console.log(isScanning);
      // TODO: scan Tag
      // setTag(tag);
    } catch (error) {
      console.warn("NFC Scan failed", error);
      Alert.alert("NFC Error", "Failed to read NFC tag.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      // NfcManager.cancelTechnologyRequest().catch(() => null);
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan NFC Tag</Text>
      <Button
        title={isScanning ? "Scanning..." : "Scan Tag"}
        onPress={readNfc}
        disabled={isScanning}
      />

      {tag && (
        <View style={styles.result}>
          <Text style={styles.tagText}>Tag Detected:</Text>
          <Text selectable>{JSON.stringify(tag, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  result: {
    marginTop: 20,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
  },
  tagText: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  note: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
});
