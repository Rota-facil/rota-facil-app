import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/presentation/shared/styles/colors";

type StudentTabRouteName =
  | "home/index"
  | "trips/index"
  | "map/index"
  | "notifications/index"
  | "profile/index";

interface StudentTabItem {
  routeName: StudentTabRouteName;
  activePrefix: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  iconOnly?: boolean;
}

const studentTabItems: StudentTabItem[] = [
  {
    routeName: "home/index",
    activePrefix: "home/",
    label: "Inicio",
    icon: "home",
  },
  {
    routeName: "trips/index",
    activePrefix: "trips/",
    label: "Viagens",
    icon: "directions-bus",
  },
  {
    routeName: "map/index",
    activePrefix: "map/",
    label: "Mapa",
    icon: "map",
    iconOnly: true,
  },
  {
    routeName: "notifications/index",
    activePrefix: "notifications/",
    label: "Avisos",
    icon: "notifications-none",
  },
  {
    routeName: "profile/index",
    activePrefix: "profile/",
    label: "Perfil",
    icon: "person-outline",
  },
];

function StudentPrivateTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute right-0 bottom-0 left-0 bg-[#F7FBFC]"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
    >
      <View className="h-[74px] flex-row items-center justify-between bg-white px-5 shadow-lg shadow-slate-300">
        {studentTabItems.map((item) => {
          const activeRouteName = state.routes[state.index]?.name;
          const routeIndex = state.routes.findIndex((route) => route.name === item.routeName);
          const isFocused =
            activeRouteName === item.routeName ||
            activeRouteName?.startsWith(item.activePrefix) === true;

          const handlePress = () => {
            if (routeIndex < 0 || isFocused) {
              return;
            }

            navigation.navigate(item.routeName);
          };

          if (item.iconOnly) {
            return (
              <Pressable
                key={item.routeName}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={isFocused ? { selected: true } : undefined}
                onPress={handlePress}
                className="-mt-8 h-16 w-16 items-center justify-center rounded-full bg-[#0D6BEE] shadow-lg shadow-blue-300 active:opacity-85"
              >
                <MaterialIcons name={item.icon} size={30} color="#FFFFFF" />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.routeName}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={isFocused ? { selected: true } : undefined}
              onPress={handlePress}
              className="h-14 min-w-[58px] flex-1 items-center justify-center rounded-2xl active:opacity-85"
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={isFocused ? colors.primaryGlow : colors.muted}
              />
              <Text
                className="mt-1 text-center font-medium text-xs"
                style={{ color: isFocused ? colors.primaryGlow : colors.muted }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { StudentPrivateTabBar };
