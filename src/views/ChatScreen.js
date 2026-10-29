import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { ref, onValue, push, set, remove, query, orderByChild } from "firebase/database";
import { db, auth } from "../firebase";
import { useUnread } from "../UnreadContext";
import { useHeaderHeight } from "@react-navigation/elements";

export default function ChatScreen({ route }) {
  const headerHeight = useHeaderHeight();
  const chatId = route.params?.chatId;
  const path = chatId ? `privateChats/${chatId}/messages` : "messages";
  const username = auth.currentUser.displayName || auth.currentUser.email;
  const uid = auth.currentUser.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);
  const unread = useUnread();
  const otherUid = route.params?.otherUid;

  useEffect(() => {
    if (otherUid && unread[otherUid]) remove(ref(db, `unread/${uid}/${otherUid}`));
  }, [otherUid, unread]);

  useEffect(() => {
    const q = query(ref(db, path), orderByChild("timestamp"));
    const unsubscribe = onValue(q, (snapshot) => {
      const list = [];
      snapshot.forEach((child) => {
        list.push({ id: child.key, ...child.val() });
      });
      setMessages(list);
    });
    return unsubscribe;
  }, []);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    push(ref(db, path), {
      user: username,
      uid,
      text: trimmed,
      timestamp: Date.now(),
    });
    if (otherUid) set(ref(db, `unread/${otherUid}/${uid}`), true);
    setText("");
  };

  const renderItem = ({ item }) => {
    const mine = item.uid === uid;
    return (
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        <Text style={styles.sender}>{item.user}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  list: { padding: 12 },
  bubble: { maxWidth: "80%", padding: 10, borderRadius: 12, marginBottom: 8 },
  mine: { alignSelf: "flex-end", backgroundColor: "#cce5ff" },
  theirs: { alignSelf: "flex-start", backgroundColor: "#fff" },
  sender: { fontWeight: "bold", fontSize: 12, marginBottom: 2, color: "#333" },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: "row", padding: 8, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  sendButton: { marginLeft: 8, backgroundColor: "#0a84ff", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "bold" },
});
