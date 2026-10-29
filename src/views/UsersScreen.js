import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db, auth } from "../firebase";
import { useUnread } from "../UnreadContext";
import PingDot from "../components/PingDot";

export default function UsersScreen({ navigation }) {
  const me = auth.currentUser;
  const [users, setUsers] = useState([]);
  const unread = useUnread();

  useEffect(() => {
    set(ref(db, `users/${me.uid}`), { name: me.displayName || me.email, email: me.email });
    return onValue(ref(db, "users"), (snapshot) => {
      const list = [];
      snapshot.forEach((child) => {
        if (child.key !== me.uid) list.push({ uid: child.key, ...child.val() });
      });
      setUsers(list);
    });
  }, []);

  const openChat = (user) => {
    const chatId = [me.uid, user.uid].sort().join("_");
    navigation.navigate("PrivateChat", { chatId, otherUid: user.uid, title: user.name });
  };

  // Los chats con mensajes sin leer aparecen primero.
  const sorted = [...users].sort((a, b) => !!unread[b.uid] - !!unread[a.uid]);

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.uid}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No hay otros usuarios registrados todavía.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => openChat(item)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
          {unread[item.uid] && <PingDot size={12} />}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: "#eee" },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { color: "#666", marginTop: 2 },
  empty: { textAlign: "center", color: "#666", marginTop: 40 },
});
