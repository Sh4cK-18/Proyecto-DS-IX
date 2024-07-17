import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';
import { register } from '../../services/authService';
import { LinearGradient } from 'expo-linear-gradient';

const InputWithIcon = ({ icon, iconStyle, placeholder, value, onChangeText, secureTextEntry, keyboardType, showPassword, toggleShowPassword }) => {
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
        secureTextEntry={secureTextEntry && !showPassword}
        autoCapitalize="none"
        keyboardType={keyboardType}
        placeholderTextColor="#aaa"
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleRegister = async () => {
    if (!/^[a-zA-Z]+$/.test(name)) {
      showAlert('No utilizar caracteres especiales en el nombre.');
      return;
    }

    if (!/^[a-zA-Z]+$/.test(surname)) {
      showAlert('No utilizar caracteres especiales en el apellido.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert('El correo no tiene un formato válido.');
      return;
    }

    if (password.length < 8) {
      showAlert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.-/])(?=.*\d).*$/;
    const isPasswordValid = passwordRegex.test(password);

    if (!isPasswordValid) {
      showAlert('La contraseña debe contener al menos una mayúscula, un carácter especial y un número.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Las contraseñas no coinciden.');
      return;
    }

    const data = {
      nombre: name,
      apellido: surname,
      email: email,
      password: password,
      roles: ['USUARIO'],
    };

    try {
      await register(data);
      showAlert('Registro exitoso!', 'success');
      navigation.navigate('Login');
    } catch (error) {
      showAlert('Error en el registro. Por favor, intente nuevamente.', 'error');
    }
  };

  const showAlert = (message, severity = 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarVisible(true);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
                <Text style={[styles.welcomeText, styles.textOutline]}>Registrarse</Text>
                <Text style={styles.welcomeText}>Registrarse</Text>
              </View>

              <InputWithIcon
                icon="user"
                iconStyle="solid"
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
              />
              <InputWithIcon
                icon="user"
                iconStyle="solid"
                placeholder="Apellido"
                value={surname}
                onChangeText={setSurname}
              />
              <InputWithIcon
                icon="envelope"
                iconStyle="solid"
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputWithIcon
                icon="lock"
                iconStyle="regular"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
              <InputWithIcon
                icon="lock"
                iconStyle="regular"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />

              <TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
                <Text style={styles.signInButtonText}>Registrarse</Text>
              </TouchableOpacity>

              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.createAccountLink}>Iniciar Sesión</Text>
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
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
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
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
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
  showPasswordButton: {
    paddingHorizontal: 10,
  },
  signInButton: {
    backgroundColor: '#F6BE15',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 10,
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
    color: '#333',
    fontSize: 16,
  },
  createAccountLink: {
    color: '#1D305F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
