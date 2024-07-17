import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';
import { login } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfile } from '../../navigation/UserProfileContext.js'; 

const InputWithIcon = ({ icon, iconStyle, placeholder, value, onChangeText, secureTextEntry, keyboardType, rightIcon, rightIconOnPress }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color="#f0f0f0" solid={iconStyle === 'solid'} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        keyboardType={keyboardType}
        placeholderTextColor="#aaa"
      />
      {rightIcon && (
        <TouchableOpacity onPress={rightIconOnPress} style={styles.rightIconBox}>
          <Icon name={rightIcon} size={20} color="#1D305F" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [showPassword, setShowPassword] = useState(false);
  const { fetchProfile } = useUserProfile(); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const data = { email, password };
      const response = await login(data);
      const { token, usuarioId, roles } = response;
      
      if (!roles) {
        showAlert('No tienes permiso para acceder.');
        return;
      }

      const userRoles = roles.map(roleObj => roleObj.rol.name);

      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuarioId', usuarioId.toString());
      await fetchProfile(); 
      if (userRoles.includes('USUARIO')) {
        navigation.navigate('Main');
      } else if (userRoles.includes('CONDUCTOR')) {
        navigation.navigate('ScanQR');
      } else {
        showAlert('No tienes permiso para acceder.');
      }
    } catch (error) {
      showAlert('Inicio de sesión inválido.');
    }
  };

  const showAlert = (message, severity = 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
        <LinearGradient colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)']} style={styles.overlayGradient}>
          <KeyboardAwareScrollView contentContainerStyle={styles.overlayContainer} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.welcomeContainer}>
                <Text style={[styles.welcomeText, styles.textOutline]}>¡Bienvenido/a De Nuevo!</Text>
                <Text style={styles.welcomeText}>¡Bienvenido/a De Nuevo!</Text>
              </View>

              <InputWithIcon
                icon="envelope"
                iconStyle="solid"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputWithIcon
                icon="lock"
                iconStyle="regular"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-slash' : 'eye'}
                rightIconOnPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                <Text style={styles.signInButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.createAccountLink}>Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </ImageBackground>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{ backgroundColor: snackbarSeverity === 'error' ? 'red' : 'green' }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 150,
    height: 130,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
  },
  formContainer: {
    width: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  welcomeContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1D305F',
  },
  textOutline: {
    zIndex: -1,
    color: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  iconBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    backgroundColor: '#1D305F',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  signInButton: {
    backgroundColor: '#F6BE15',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#1D305F',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  createAccountText: {
    color: 'black',
    fontSize: 16,
  },
  createAccountLink: {
    color: '#1D305F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightIconBox: {
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
