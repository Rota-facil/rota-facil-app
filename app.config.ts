import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    name: config.name ?? "rota-facil",
    slug: config.slug ?? "rota-facil",
    scheme: "rotafacil",

    android: {
      ...config.android,

      config: {
        ...config.android?.config,

        ...(googleMapsApiKey
          ? {
              googleMaps: {
                apiKey: googleMapsApiKey,
              },
            }
          : {}),
      },
    },
  };
};
