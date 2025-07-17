import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { auth } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      Alert.alert(
        'Account Created',
        'A verification email has been sent to your email address. Please verify your email before logging in.'
      );

      router.replace('/(auth)/LoginScreen');
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.heading}>Create Account</Text>

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
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8} style={styles.loginButton}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(auth)/LoginScreen')}>
          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021B79',
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
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loginButton: {
    backgroundColor: '#205295',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#205295',
    shadowOpacity: 0.5,
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
