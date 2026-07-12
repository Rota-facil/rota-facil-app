import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import MapView, { type LatLng, Marker, Polyline, type Region } from "react-native-maps";
import { colors } from "@/presentation/shared/styles/colors";
import type { TripMapPoint, TripMapPointKind, TripMapViewModel } from "../utils";

interface TripNativeMapViewProps {
  readonly viewModel: TripMapViewModel;
}

const defaultRegionDelta = 0.015;
const minimumRegionDelta = 0.01;
const regionPaddingFactor = 1.45;
const routeStrokeColor = "#043DBC";
const mapEdgePadding = {
  top: 180,
  right: 48,
  bottom: 260,
  left: 48,
};

const markerIcons: Record<TripMapPointKind, ComponentProps<typeof MaterialIcons>["name"]> = {
  bus: "directions-bus",
  institution: "school",
  start: "trip-origin",
  stop: "location-on",
};

const markerStyles: Record<
  TripMapPointKind,
  { readonly background: string; readonly foreground: string; readonly halo: string }
> = {
  bus: {
    background: colors.blueAccent,
    foreground: "#FFFFFF",
    halo: "rgba(4, 61, 188, 0.18)",
  },
  institution: {
    background: colors.primaryGlow,
    foreground: "#FFFFFF",
    halo: "rgba(59, 130, 246, 0.18)",
  },
  start: {
    background: colors.accent,
    foreground: "#FFFFFF",
    halo: "rgba(245, 165, 36, 0.2)",
  },
  stop: {
    background: colors.stateSuccess,
    foreground: "#FFFFFF",
    halo: "rgba(22, 163, 74, 0.16)",
  },
};

function TripNativeMapView({ viewModel }: TripNativeMapViewProps) {
  const mapRef = useRef<MapView | null>(null);
  const mapCoordinates = useMemo(() => getMapCoordinates(viewModel), [viewModel]);
  const initialRegion = useMemo(() => getInitialRegion(mapCoordinates), [mapCoordinates]);

  useEffect(() => {
    if (mapCoordinates.length <= 1) {
      return;
    }

    const timeoutId = setTimeout(() => {
      mapRef.current?.fitToCoordinates(mapCoordinates, {
        animated: true,
        edgePadding: mapEdgePadding,
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mapCoordinates]);

  return (
    <MapView
      ref={mapRef}
      initialRegion={initialRegion}
      loadingEnabled
      mapType="standard"
      rotateEnabled
      scrollEnabled
      showsCompass
      showsMyLocationButton={false}
      showsUserLocation={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      zoomControlEnabled={false}
      zoomEnabled
      style={{ flex: 1 }}
    >
      {viewModel.routePolylineCoordinates.length > 1 ? (
        <Polyline
          coordinates={viewModel.routePolylineCoordinates}
          strokeColor={routeStrokeColor}
          strokeWidth={6}
          lineCap="round"
          lineJoin="round"
        />
      ) : null}

      {viewModel.points.map((point) => (
        <TripMapMarker key={point.id} point={point} />
      ))}
    </MapView>
  );
}

function TripMapMarker({ point }: { readonly point: TripMapPoint }) {
  const markerStyle = markerStyles[point.kind];
  const markerSize = point.kind === "bus" ? 42 : 34;
  const iconSize = point.kind === "bus" ? 24 : 20;

  return (
    <Marker
      coordinate={point.coordinate}
      title={point.title}
      description={point.description}
      zIndex={point.kind === "bus" ? 10 : 1}
    >
      <View className="items-center">
        <View
          className="items-center justify-center rounded-full border-[3px] border-white shadow-sm shadow-slate-500"
          style={{
            backgroundColor: markerStyle.background,
            height: markerSize,
            shadowColor: markerStyle.halo,
            width: markerSize,
          }}
        >
          <MaterialIcons
            name={markerIcons[point.kind]}
            size={iconSize}
            color={markerStyle.foreground}
          />
        </View>
        {point.kind === "bus" ? (
          <View className="mt-1 rounded-full bg-white/95 px-2 py-0.5 shadow-sm shadow-blue-100">
            <Text className="font-bold text-[10px] text-[#043DBC]">Ônibus</Text>
          </View>
        ) : null}
      </View>
    </Marker>
  );
}

function getMapCoordinates(viewModel: TripMapViewModel): LatLng[] {
  return [
    ...viewModel.routePolylineCoordinates,
    ...viewModel.points.map((point) => point.coordinate),
  ];
}

function getInitialRegion(coordinates: LatLng[]): Region {
  if (coordinates.length === 0) {
    return {
      latitude: 0,
      latitudeDelta: defaultRegionDelta,
      longitude: 0,
      longitudeDelta: defaultRegionDelta,
    };
  }

  if (coordinates.length === 1) {
    const [coordinate] = coordinates;

    return {
      ...coordinate,
      latitudeDelta: defaultRegionDelta,
      longitudeDelta: defaultRegionDelta,
    };
  }

  const latitudes = coordinates.map((coordinate) => coordinate.latitude);
  const longitudes = coordinates.map((coordinate) => coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * regionPaddingFactor, minimumRegionDelta),
    longitude: (minLongitude + maxLongitude) / 2,
    longitudeDelta: Math.max(
      (maxLongitude - minLongitude) * regionPaddingFactor,
      minimumRegionDelta,
    ),
  };
}

export { TripNativeMapView };
