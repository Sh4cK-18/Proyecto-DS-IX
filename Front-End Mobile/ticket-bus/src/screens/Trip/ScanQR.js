import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Button } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ScanQR = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código QR escaneado con éxito: ${data}`);
    // Aquí puedes navegar a otra pantalla o realizar alguna acción con los datos escaneados
    // navigation.navigate('SomeScreen', { qrData: data });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para usar la cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha otorgado permiso para usar la cámara</Text>;
  }

  return (
    <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Escanear Código QR</Text>
          <Text style={styles.subtitle}>
            Escanea los códigos QR para acceder a la información del boleto
          </Text>
        </View>
        <View style={styles.qrContainer}>
          <Text style={styles.infoText}>Para escanear el QR, coloque el código dentro del marco.</Text>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={styles.qrFrame}
          />
          {scanned && (
            <Button title={"Escanear de nuevo"} onPress={() => setScanned(false)} />
          )}
        </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 40, 
    paddingHorizontal: 10,
    backgroundColor: '#1D305F',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
  },
  helloText: {
    color: 'white',
    fontSize: 16,
  },
  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1D305F',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#1D305F',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrFrame: {
    width: 300,
    height: 300,
  },
  scanAgainButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F6BE15',
    borderRadius: 10,
  },
  scanAgainText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ScanQR;
