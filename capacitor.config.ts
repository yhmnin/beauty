import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.beauty.aesthetic",
  appName: "Beauty",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0A0A0A",
      showSpinner: false,
    },
  },
};

export default config;
