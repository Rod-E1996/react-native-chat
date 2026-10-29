import { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

// Punto con efecto "ping" (onda que se expande y desvanece), como animate-ping de Tailwind.
// El contenedor mide lo que alcanza la onda (size * MAX_SCALE) para que no se recorte.
const MAX_SCALE = 2.5;

export default function PingDot({ size = 10, color = "#c10007", style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const box = size * MAX_SCALE;
  const dot = { width: size, height: size, borderRadius: size / 2, backgroundColor: color };

  return (
    <View
      style={[{ width: box, height: box, alignItems: "center", justifyContent: "center" }, style]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { margin: (box - size) / 2 },
          dot,
          {
            opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] }),
            transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, MAX_SCALE] }) }],
          },
        ]}
      />
      <View style={dot} />
    </View>
  );
}
