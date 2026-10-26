import { Stack } from "expo-router";

import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AuthProvider } from "../src/context/AuthContext";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name="login" />
          <Stack.Screen name = "signup" />
          <Stack.Screen name = "(tabs)" />
          <Stack.Screen name = "modal" />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
