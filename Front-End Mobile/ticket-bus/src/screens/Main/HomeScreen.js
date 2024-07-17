import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, ImageBackground, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import routeService from '../../services/routeService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [routes, setRoutes] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await routeService.getRoutes();
        setRoutes(routes);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron obtener las rutas');
      }
    };
    fetchRoutes();

    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario');
      }
    };
    fetchUserId();
  }, []);

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearch = async () => {
    try {
      let routes;
      if (fromLocation === '' && toLocation === '') {
        routes = await routeService.getRoutes(); // Get all routes if both fields are empty
      } else {
        routes = await routeService.findRoute({ salida: fromLocation, llegada: toLocation });
      }
      setRoutes(routes);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener las rutas');
      setRoutes([]);
    }
  };

  const handleBuyTicket = (route) => {
    navigation.navigate('Payment', { routeId: route.rutaId, userId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.searchSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>A</Text>
              </View>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Salida</Text>
                <TextInput
                  style={[styles.input, styles.inputBorder]}
                  placeholder="Tu Ubicación"
                  placeholderTextColor="#A9A9A9"
                  value={fromLocation}
                  onChangeText={setFromLocation}
                />
              </View>
            </View>
            <View style={styles.dashedLineContainer}>
              <View style={styles.dashedLine} />
            </View>
            <View style={styles.inputRow}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>B</Text>
              </View>
              <View style={styles.textInputContainer}>
                <Text style={styles.label}>Destino</Text>
                <TextInput
                  style={[styles.input, styles.inputBorder]}
                  placeholder="Parada final"
                  placeholderTextColor="#A9A9A9"
                  value={toLocation}
                  onChangeText={setToLocation}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.swapIcon} onPress={handleSwap}>
              <Icon name="exchange-alt" size={20} color="#000" style={styles.swapIconImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter" size={16} color="white" />
              <Text style={styles.filterButtonText}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Icon name="search" size={16} color="#fff" style={styles.searchIcon} />
              <Text style={styles.searchButtonText}>Buscar Ruta</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowContainer}>
            <TouchableOpacity style={styles.arrowButton}>
              <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <View style={styles.resultsSection}>
            {routes.length > 0 ? (
              routes.map((route, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultCardInfo}>
                    <Text style={styles.departureText}>HORA DE SALIDA:</Text>
                    <Text style={styles.departureTime}>{new Date(route.fecha_hora).toLocaleTimeString()}</Text>
                    <Text style={styles.departureText}>FECHA DE SALIDA:</Text>
                    <Text style={styles.departureTime}>{new Date(route.fecha_hora).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.resultCardDetails}>
                    <Text style={styles.resultTitle}>Salida: {route.salida}</Text>
                    <Text style={styles.resultDescription}>Destino: {route.llegada}</Text>
                    <Text style={styles.gateText}>Puerta: {route.puerta}</Text>
                    <View style={styles.resultActions}>
                      <Text style={styles.resultDetailsLink}>Ruta: <Text style={styles.routeNumber}>{route.rutaId}</Text></Text>
                      <TouchableOpacity style={styles.buyTicketButton} onPress={() => handleBuyTicket(route)}>
                        <Text style={styles.buyTicketButtonText}>COMPRAR TICKET</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noResultsText}>No se encontraron rutas</Text>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1D305F',
  },
  logo: {
    width: 150,
    height: 100,
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#1D305F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    backgroundColor: '#FFA500',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textInputContainer: {
    flex: 1,
    marginLeft: 10,
    maxWidth: '70%',
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 0,
    marginTop: 5,
  },
  inputBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  dashedLineContainer: {
    height: 20,
    marginLeft: 15,
  },
  dashedLine: {
    width: 1,
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'white',
  },
  swapIcon: {
    position: 'absolute',
    right: 5,
    top: '45%',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
  },
  swapIconImage: {
    transform: [{ rotate: '90deg' }],
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: -15,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#1D305F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsSection: {
    padding: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  resultCardInfo: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    padding: 10,
  },
  departureText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  departureTime: {
    color: '#1D305F',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultCardDetails: {
    width: '70%',
    paddingLeft: 10,
    paddingRight: 15,
    justifyContent: 'center',
  },
  resultTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  resultDescription: {
    color: '#000',
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  resultDetailsLink: {
    color: '#1D305F',
    fontSize: 18,
  },
  gateText: {
    color: 'black',
    fontSize: 18,
  },
  routeNumber: {
    color: '#F6BE15',
    fontWeight: 'bold',
  },
  buyTicketButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    padding: 8,
    marginTop: 0,
    alignSelf: 'flex-end',
  },
  buyTicketButtonText: {
    color: '#1D305F',
    fontWeight: 'bold',
  },
  noResultsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;
