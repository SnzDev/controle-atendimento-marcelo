import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "Minha Acessenet",
  slug: "acessenet-telecom",
  scheme: "acessenet",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-screen.png",
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/a61923ab-e576-4f2a-aab5-6595ba533622"

  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "br.com.morpheus.acessenet",
  },
  android: {
    versionCode: 3,
    package: "br.com.morpheus.acessenet",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptative-icon.png",
      backgroundColor: "#fff",
    },
  },
  extra: {
    eas: {
      projectId: "a61923ab-e576-4f2a-aab5-6595ba533622",
    },
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    [
      'expo-build-properties',
      {
        android: {
          "usesCleartextTraffic": true
        }
      }],
  ],
  runtimeVersion: {
    policy: "appVersion"
  }

});

export default defineConfig;