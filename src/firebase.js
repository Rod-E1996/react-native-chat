import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPAhjt34o8_16ku1D2o4M7hEMSzTwnvDs",
  authDomain: "react-native-chat-53bd8.firebaseapp.com",
  databaseURL: "https://react-native-chat-53bd8-default-rtdb.firebaseio.com",
  projectId: "react-native-chat-53bd8",
  storageBucket: "react-native-chat-53bd8.firebasestorage.app",
  messagingSenderId: "368234648752",
  appId: "1:368234648752:web:91f28c61154a65b6029775",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
