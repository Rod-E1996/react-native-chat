import { createContext, useContext } from "react";

// Mapa { uidDelRemitente: true } con los chats privados que tienen mensajes sin leer.
export const UnreadContext = createContext({});
export const useUnread = () => useContext(UnreadContext);
