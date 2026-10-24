import { Surface, Symbol } from "@ardia/shell";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { createCliDisclosure, type CliDisclosure } from "../lib/cliDisclosure";
import { stopCliControl, useCli } from "../lib/cliControl";
import { hex, useTheme } from "../lib/theme";
import { CLI_PILL_BOTTOM, CLI_PILL_HEIGHT } from "./layout/cliPillLayout";
import { useHover } from "./primitives";

export function useCliDisclosed(): boolean {
  const on = useCli((s) => s.server?.state === "on");
  const controlled = useCli((s) => s.server?.state === "on" && (s.server.connections ?? 0) > 0);
  const [shown, setShown] = useState(controlled);
  const disclosure = useRef<CliDisclosure | null>(null);
  useEffect(() => {
    const created = createCliDisclosure(setShown);
    disclosure.current = created;
    return () => {
      created.dispose();
      disclosure.current = null;
    };
  }, []);
  useEffect(() => {
    disclosure.current?.update({ on, controlled });
  }, [on, controlled]);
  return shown;
}

export function CliControlPill({ onWidth }: { onWidth: (width: number) => void }) {
  const shown = useCliDisclosed();
  const [mounted, setMounted] = useState(shown);
  useEffect(() => {
    if (shown) setMounted(true);
  }, [shown]);
  useEffect(() => {
    if (!mounted && !shown) onWidth(0);
  }, [mounted, shown]);
  useEffect(() => () => onWidth(0), []);
  if (!mounted && !shown) return null;
  return <ShownCliControlPill shown={shown} onHidden={() => setMounted(false)} onWidth={onWidth} />;
}

function ShownCliControlPill({ shown, onHidden, onWidth }: { shown: boolean; onHidden: () => void; onWidth: (width: number) => void }) {
  const theme = useTheme();
  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(
      appear,
      shown
        ? { toValue: 1, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true }
        : { toValue: 0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true },
    );
    animation.start(({ finished }) => finished && !shown && onHidden());
    return () => animation.stop();
  }, [shown]);
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 12, right: 12, bottom: CLI_PILL_BOTTOM, alignItems: "center" }}>
      <Animated.View
        pointerEvents={shown ? "auto" : "none"}
        onLayout={(e) => onWidth(e.nativeEvent.layout.width)}
        style={{
          maxWidth: "100%",
          opacity: appear,
          transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }, { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
        }}
      >
        <Surface
          fill={hex(theme.panel)}
          cornerRadius={CLI_PILL_HEIGHT / 2}
          borderColor={hex(theme.panelBorder)}
          borderWidth={0.5}
          shadowColor="#000000"
          shadowOpacity={theme.panelShadowOpacity}
          shadowRadius={14}
          shadowOffset={[0, 4]}
        >
          <View
            accessibilityRole="alert"
            accessibilityLabel="The ardia command is controlling Ardia"
            style={{ height: CLI_PILL_HEIGHT, flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 6, paddingRight: 4 }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: theme.textPrimary, alignItems: "center", justifyContent: "center" }}>
              <Symbol name="terminal.fill" size={9} weight="bold" color={theme.dark ? "#000000" : "#FFFFFF"} style={{ width: 14, height: 14 }} />
            </View>
            <Text numberOfLines={1} style={{ flexShrink: 1, fontSize: 12, color: theme.textSecondary }}>
              <Text style={{ fontWeight: "600", color: theme.textPrimary }}>ardia</Text>
              {" is controlling Ardia"}
            </Text>
            <StopButton />
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
}

function StopButton() {
  const theme = useTheme();
  const { hovered, hoverProps } = useHover();
  return (
    <View {...hoverProps}>
      <Pressable onPress={stopCliControl} accessibilityRole="button" accessibilityLabel="Stop">
        {({ pressed }) => (
          <View
            style={{
              height: CLI_PILL_HEIGHT - 8,
              paddingHorizontal: 10,
              borderRadius: (CLI_PILL_HEIGHT - 8) / 2,
              justifyContent: "center",
              backgroundColor: theme.dark ? `rgba(255,255,255,${pressed ? 0.18 : hovered ? 0.14 : 0.1})` : `rgba(0,0,0,${pressed ? 0.12 : hovered ? 0.09 : 0.06})`,
            }}
          >
            <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "500", color: theme.textPrimary }}>
              Stop
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
