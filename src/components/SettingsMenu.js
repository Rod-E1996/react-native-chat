import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PingDot from "./PingDot";

// Para agregar opciones al menú, añade un elemento a `items`.
// Con `ping: true` la opción (y la tuerca) muestran el indicador de notificación.
export default function SettingsMenu({ items }) {
  const [open, setOpen] = useState(false);
  const anyPing = items.some((i) => i.ping);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} hitSlop={10} style={styles.gear}>
        <Ionicons name="settings-sharp" size={24} color="#0a84ff" />
        {anyPing && <PingDot size={10} style={styles.gearPing} />}
      </TouchableOpacity>
      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.item}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
              >
                <Ionicons name={item.icon} size={20} color={item.danger ? "#d00" : "#333"} />
                <Text style={[styles.label, item.danger && { color: "#d00" }]}>{item.label}</Text>
                {item.ping && <PingDot size={10} style={styles.itemPing} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "flex-end", paddingTop: 60, paddingRight: 12 },
  menu: { backgroundColor: "#fff", borderRadius: 10, minWidth: 200, paddingVertical: 6, elevation: 8 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16 },
  label: { marginLeft: 12, fontSize: 16, color: "#333" },
  gear: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  gearPing: { position: "absolute", top: 0, right: 0 },
  itemPing: { marginLeft: 4 },
});
