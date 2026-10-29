# Chat App (React Native + Firebase)

App de chat en tiempo real hecha con Expo, Firebase Authentication y Firebase Realtime Database.

## Funciones

- Registro e inicio de sesión con correo y contraseña (Firebase Authentication). La sesión se mantiene al cerrar la app.
- Chat global compartido en tiempo real.
- Chats privados entre usuarios registrados.
- Indicador de notificación (ping) cuando recibes un mensaje privado.
- Mostrar u ocultar la contraseña en los formularios.

## Requisitos

- [Node.js](https://nodejs.org/) **22.13 o superior** (se recomienda la LTS 22).
- La app **Expo Go** en tu celular (Android o iOS), o un emulador de Android.
- Un proyecto de Firebase (ver abajo).

## Instalación

```bash
git clone <URL-DEL-REPOSITORIO>
cd firebaseChatApp
npm install
```

## Ejecutar

```bash
npm start
```

- Escanea el QR con **Expo Go** (el celular y la PC deben estar en la misma red Wi-Fi).
- O pulsa `a` en la terminal para abrir un emulador de Android.

Para probar el chat, abre la app en dos dispositivos (o un dispositivo y un emulador), registra dos cuentas distintas y envía mensajes.

## Estructura

```
├── index.js              Punto de entrada
├── app.json              Configuración de Expo
├── assets/               Íconos e imágenes
└── src/
    ├── App.js            Navegación y estado de sesión
    ├── firebase.js       Configuración de Firebase (Auth y Database)
    ├── UnreadContext.js  Chats privados con mensajes sin leer
    ├── components/       PasswordInput, PingDot, SettingsMenu
    └── screens/          LoginScreen, ChatScreen, UsersScreen
```

## Estructura de datos en Realtime Database

- `messages/`: mensajes del chat global.
- `users/{uid}`: nombre y correo de cada usuario.
- `privateChats/{uidA_uidB}/messages/`: mensajes privados (los dos `uid` ordenados).
- `unread/{uidReceptor}/{uidEmisor}`: marca de mensaje privado sin leer.
