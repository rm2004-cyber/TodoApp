import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { auth } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(main)/TodoScreen');
      } else {
      
        setTimeout(() => {
          router.replace('/(auth)/LoginScreen'); 
        }, 1500);
      }
    });

   
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    return unsubscribe;
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedLogoStyle]}>
        <Text style={styles.logoText}>TODO</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#2C74B3', 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  logoText: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 5,
  },
});
