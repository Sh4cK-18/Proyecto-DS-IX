import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from '../../navigation/UserProfileContext.js';
import { updateUser, updateProfilePicture } from '../../navigation/UserProfileContext.js';

const InputWithIcon = ({ icon, iconStyle, placeholder, value, onChangeText, secureTextEntry, keyboardType }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color="#1D305F" solid={iconStyle === 'solid'} />
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
    </View>
  );
};

const ProfileScreen = () => {
  const { profile, fetchProfile } = useUserProfile();
  const [profileImage, setProfileImage] = useState(profile.profilePicture);
  const [name, setName] = useState(profile.nombre);
  const [lastName, setLastName] = useState(profile.apellido);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setProfileImage(profile.profilePicture);
    setName(profile.nombre);
    setLastName(profile.apellido);
    setEmail(profile.email);
  }, [profile]);

  const handleSave = async () => {
    if (!/^[a-zA-Z]+$/.test(name)) {
      showAlert('No utilizar caracteres especiales en el nombre.');
      return;
    }
  
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      showAlert('No utilizar caracteres especiales en el apellido.');
      return;
    }
  
    if (password.length > 0 && password.length < 8) {
      showAlert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.-/])(?=.*\d).*$/;
    if (password.length > 0 && !passwordRegex.test(password)) {
      showAlert('La contraseña debe contener al menos una mayúscula, un carácter especial y un número.');
      return;
    }
  
    const updateData = { 
      nombre: name, 
      apellido: lastName, 
      roles: ['USUARIO'] 
    };
  
    if (password) updateData.password = password;
  
    try {
      await updateUser(updateData);
      showAlert('Perfil actualizado correctamente', 'success');
      fetchProfile(); // Actualizar el perfil después de guardar
    } catch (error) {
      showAlert('Error al actualizar el perfil. Por favor, intente nuevamente.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        await updateProfilePicture(result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
        showAlert('Foto de perfil actualizada correctamente', 'success');
        fetchProfile(); // Actualizar el perfil después de actualizar la imagen
      } catch (error) {
        showAlert('Error al actualizar la foto de perfil. Por favor, intente nuevamente.');
      }
    } else {
      Alert.alert('Error', 'No seleccionaste ninguna imagen.');
    }
  };

  const showAlert = (message, severity = 'error') => {
    Alert.alert(severity === 'error' ? 'Error' : 'Éxito', message);
  };

  return (
    <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={profileImage ? { uri: profileImage } : require('../../../assets/img/UserI.png')}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
                  <Icon name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
          </View>
          <View style={styles.formContainer}>
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
              value={lastName}
              onChangeText={setLastName}
            />
            <InputWithIcon
              icon="envelope"
              iconStyle="solid"
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={false}
            />
            <InputWithIcon
              icon="lock"
              iconStyle="solid"
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1D305F',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F6BE15',
    borderRadius: 20,
    padding: 5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
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
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#F6BE15',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#1D305F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
