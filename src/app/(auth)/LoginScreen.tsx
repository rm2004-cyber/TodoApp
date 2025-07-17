import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { auth } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fade = useSharedValue(0);
  const translateY = useSharedValue(40);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required!');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        Alert.alert(
          'Verify Your Email',
          'Your email is not verified. Please check your inbox and verify your email before logging in.'
        );
        return;
      }

      router.replace('/(main)/TodoScreen');
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.heading}>Login</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.loginButton}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/(auth)/SignUpScreen')}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#021B79',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loginButton: {
    backgroundColor: '#0F52BA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0F52BA',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  signUpText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  signUpLink: {
    color: '#4FC3F7',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
