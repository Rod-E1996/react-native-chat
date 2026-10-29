import { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "./firebase";
import { UnreadContext } from "./UnreadContext";
import LoginScreen from "./views/LoginScreen";
import ChatScreen from "./views/ChatScreen";
import UsersScreen from "./views/UsersScreen";
import SettingsMenu from "./components/SettingsMenu";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState({});

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread({});
      return;
    }
    return onValue(ref(db, `unread/${user.uid}`), (snapshot) => setUnread(snapshot.val() || {}));
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const hasUnread = Object.keys(unread).length > 0;

  const menuItems = (navigation) => [
    { label: "Chat global", icon: "globe-outline", onPress: () => navigation.popTo("Chat") },
    { label: "Chat privado", icon: "chatbubbles-outline", ping: hasUnread, onPress: () => navigation.navigate("Users") },
    { label: "Cerrar sesión", icon: "log-out-outline", danger: true, onPress: () => signOut(auth) },
  ];

  return (
    <UnreadContext.Provider value={unread}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => <SettingsMenu items={menuItems(navigation)} />,
        })}
      >
        {user ? (
          <>
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat global" }} />
            <Stack.Screen name="Users" component={UsersScreen} options={{ title: "Chat privado con..." }} />
            <Stack.Screen
              name="PrivateChat"
              component={ChatScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar sesión", headerRight: undefined }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </UnreadContext.Provider>
  );
}
