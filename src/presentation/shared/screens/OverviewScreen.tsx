import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingCard } from "../components/atoms/overviewCard";
import { PaginationDots } from "../components/atoms/paginationDots";
import { SystemButton } from "../components/atoms/systemButton";
import { OnboardingHeader } from "../components/molecules/overviewHeader";
import { Slides } from "../data/slides";

export default function OverviewScreen() {
  const { replace } = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = Slides[currentIndex];
  const isLastSlide = currentIndex === Slides.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    replace("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={["#D5DAD8", "#D9E0E6", "#E4EDED", "#DFECEA"]}
      locations={[0, 0.49, 0.74, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex flex-1"
    >
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between">
            <OnboardingHeader onSkip={() => replace("/(auth)/login")} showSkip={!isLastSlide} />

            {currentSlide.iconType === "material" ? (
              <OnboardingCard
                title={currentSlide.title}
                description={currentSlide.description}
                iconName={currentSlide.iconName}
                iconType="material"
                gradientColors={currentSlide.gradientColors}
              />
            ) : (
              <OnboardingCard
                title={currentSlide.title}
                description={currentSlide.description}
                iconName={currentSlide.iconName}
                iconType="feather"
                gradientColors={currentSlide.gradientColors}
              />
            )}

            <View>
              <PaginationDots total={Slides.length} currentIndex={currentIndex} />

              <SystemButton
                title={isLastSlide ? "Começar" : "Continuar"}
                onPress={handleNext}
                iconRight="chevron-right"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
