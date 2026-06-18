// src/app/overview/screens/OverviewScreen.tsx

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { OverviewButton } from "../components/OverviewButton";
import { OnboardingCard } from "../components/OverviewCard";
import { OnboardingHeader } from "../components/OverviewHeader";
import { PaginationDots } from "../components/PaginationDots";

import { Slides } from "../data/slides";

export default function OverviewScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = Slides[currentIndex];

  const isLastSlide = currentIndex === Slides.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    console.log("Ir para Login");
  };

  const handleSkip = () => {
    setCurrentIndex(Slides.length - 1);
  };

  return (
    <LinearGradient
      colors={["#D5DAD8", "#D9E0E6", "#E4EDED", "#DFECEA"]}
      locations={[0, 0.49, 0.74, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6 pb-8 justify-between">
        <View className="mt-4">
          <OnboardingHeader onSkip={handleSkip} showSkip={!isLastSlide} />
        </View>

        <OnboardingCard
          title={currentSlide.title}
          description={currentSlide.description}
          iconName={currentSlide.iconName}
          iconType={currentSlide.iconType}
          gradientColors={currentSlide.gradientColors}
        />

        <View>
          <PaginationDots total={Slides.length} currentIndex={currentIndex} />

          <OverviewButton title={isLastSlide ? "Começar" : "Continuar"} onPress={handleNext} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
