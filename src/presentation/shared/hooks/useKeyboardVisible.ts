import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
}

function useKeyboardVisible(): boolean {
  return useKeyboardHeight() > 0;
}

export { useKeyboardHeight, useKeyboardVisible };
