import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ConfirmationScreen = ({ route }) => {
  const { totalAmount } = route.params;

  return (
    <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={100} color="#1D305F" />
        </View>
        <Text style={styles.title}>PAGO EXITOSO!</Text>
        <Text style={styles.subtitle}>Se ha realizado el pago de</Text>
        <Text style={styles.amount}>B/. {totalAmount}</Text>
        <View style={styles.qrContainer}>
          <Image source={require('../../../assets/qr.png')} style={styles.qrImage} />
        </View>
        <Text style={styles.footerText}>
          Presentar el QR al abordar el transporte. Este QR también lo podrá encontrar en la sección de historial de boletos.
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F6BE15',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  },
  qrContainer: {
    marginBottom: 20,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  footerText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default ConfirmationScreen;
