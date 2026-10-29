import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordInput({ style, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput {...props} style={styles.input} secureTextEntry={!visible} autoCapitalize="none" />
      <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
        <Ionicons name={visible ? "eye-off" : "eye"} size={22} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  input: { flex: 1, padding: 12 },
  eye: { paddingHorizontal: 12 },
});
