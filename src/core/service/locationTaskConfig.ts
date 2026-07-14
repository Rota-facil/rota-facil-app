import * as Location from "expo-location";

const LOCATION_TRACKING_TASK_NAME = "rota-facil-location-tracking";

/**
 * Background location changes require a new Development Build. Metro reloads do not apply native
 * permission, UIBackgroundModes, or Android foreground-service changes.
 */
const DEFAULT_LOCATION_TRACKING_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.High,
  activityType: Location.ActivityType.AutomotiveNavigation,
  distanceInterval: 10,
  foregroundService: {
    killServiceOnDestroy: false,
    notificationBody: "Acompanhando o deslocamento do transporte escolar.",
    notificationColor: "#0B63CE",
    notificationTitle: "Rota Fácil em acompanhamento",
  },
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  timeInterval: 5000,
};

export { DEFAULT_LOCATION_TRACKING_OPTIONS, LOCATION_TRACKING_TASK_NAME };
