import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UserProfileProvider, useUserProfile } from '../navigation/UserProfileContext.js'; // Importar el contexto

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Main/HomeScreen';
import HistoryScreen from '../screens/Main/HistoryScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import ScanQRScreen from '../screens/Trip/ScanQR';
import PaymentScreen from '../screens/Trip/PaymentScreen';
import ConfirmationScreen from '../screens/Trip/ConfirmationScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserI from '../../assets/img/UserI.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation }) => {
  const { profile, fetchProfile } = useUserProfile();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuarioId');
    fetchProfile(); // Limpiar el perfil después de cerrar sesión
    navigation.navigate('Login');
  };

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Image source={profile.profilePicture ? { uri: profile.profilePicture } : UserI} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Hola,</Text>
          <Text style={styles.profileDetails}>{profile.nombre} {profile.apellido}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Icon name="sign-out-alt" size={24} color="#fff" style={styles.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};

function MainTabs({ isTabBarVisible }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'ticket-alt';
            color = focused ? '#000' : color;
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { display: isTabBarVisible ? 'flex' : 'none' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const [isTabBarVisible, setTabBarVisible] = useState(true);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTabBarVisible(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTabBarVisible(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <UserProfileProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen 
            name="Main" 
            options={({ navigation }) => ({
              header: () => <CustomHeader navigation={navigation} />
            })} 
          >
            {(props) => <MainTabs {...props} isTabBarVisible={isTabBarVisible} />}
          </Stack.Screen>
          <Stack.Screen 
            name="ScanQR" 
            component={ScanQRScreen} 
            options={({ navigation }) => ({
              header: () => <CustomHeader navigation={navigation} />
            })} 
          />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProfileProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    backgroundColor: '#1D305F',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileDetails: {
    color: '#fff',
    fontSize: 14,
  },
  menuIcon: {
    marginRight: 10,
  },
});

export default AppNavigation;
