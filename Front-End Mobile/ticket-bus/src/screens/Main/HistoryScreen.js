import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import { getTicketsByUserId } from '../../services/ticketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userId = await AsyncStorage.getItem('usuarioId');
        const userTickets = await getTicketsByUserId(userId);
        setTickets(userTickets);
      } catch (error) {
        Alert.alert('Error', 'No hay tickets que mostrar.');
      }
    };

    fetchTickets();
  }, []);

  const createPDF = async (ticket) => {
    try {
        const manipulatedQrImage = await ImageManipulator.manipulateAsync(
            ticket.qrCode,
            [],
            { base64: true }
        );

        const logoImageUri = Image.resolveAssetSource(require('../../../assets/img/logo2.jpg')).uri;
        const manipulatedLogoImage = await ImageManipulator.manipulateAsync(
            logoImageUri,
            [],
            { base64: true }
        );

        const html = `
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .header { text-align: center; margin-bottom: 20px; color: #1D305F; }
                  .header img { width: 200px; margin-bottom: 10px}
                  .header h1 { font-size: 24px; margin: 0; }
                  .info-section { margin-top: 20px; color: #1D305F; }
                  .info-section p { font-size: 18px; }
                  .qr-code { text-align: center; margin-top: 20px; }
                  .qr-code img { width: 200px; height: 200px; }
                  .email {margin-bottom: 15px;} 
                  .section-title { font-size: 20px; font-weight: bold; margin-top: 20px; }
                  .content { margin-top: 10px; }
                  .separator { border-bottom: 2px solid #1D305F; margin-top: 10px; margin-bottom: 10px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <img src="data:image/png;base64,${manipulatedLogoImage.base64}" alt="Logo" />

                  <h1>Información de Tu Boleto</h1>
                  <p>Presenta tu código qr a la hora de abordar el bus</p>
                  <p>Conctacto: +507 6171-3123</p>
                  <br/>

                </div>
                <div class="info-section">
                  <p class="section-title">INFORMACIÓN DEL CLIENTE</p>
                  <div class="separator"></div>
                  <p><strong>Nombre:</strong> </p>
                  <p><strong class="email">Correo Electrónico:</strong> </p>
                </div>
                <div class="info-section">
                  <p class="section-title">INFORMACIÓN DEL TICKET</p>
                  <div class="separator"></div>
                  <p><strong>Comienzo:</strong> ${ticket.salida}</p>
                  <p><strong>Destino:</strong> ${ticket.llegada}</p>
                  <p><strong>Hora de Salida:</strong> ${new Date(ticket.fecha_hora).toLocaleTimeString()}</p>
                  <p><strong>Total Pagado:</strong> B/. ${ticket.totalPrice}</p>
                </div>
                <div class="qr-code">
                  <img src="data:image/png;base64,${manipulatedQrImage.base64}" alt="QR Code" />
                  <p>QR DE TICKET</p>
                </div>
              </body>
            </html>
          `;

        const { uri } = await Print.printToFileAsync({ html });
        const fileUri = `${FileSystem.documentDirectory}ticket_${ticket.id}.pdf`;
        await FileSystem.moveAsync({
            from: uri,
            to: fileUri,
        });
        shareAsync(fileUri);
        Alert.alert('PDF Downloaded', `PDF has been downloaded to: ${fileUri}`);
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to download PDF');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketNotchLeft} />
      <View style={styles.ticketNotchRight} />
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketFrom}>{item.salida}</Text>
        <View style={styles.ticketLine} />
        <Icon name="bus" size={24} color="black" style={styles.busIcon} />
        <View style={styles.ticketLine} />
        <Text style={styles.ticketTo}>{item.llegada}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.ticketBody}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketPrice}>B/. {item.totalPrice}</Text>
          <Text style={styles.ticketTime}>{new Date(item.fecha_hora).toLocaleTimeString()}</Text>
          <Text style={styles.ticketDate}>{new Date(item.fecha_hora).toLocaleDateString()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <TouchableOpacity style={styles.downloadButton} onPress={() => createPDF(item)}>
            <Text style={styles.downloadButtonText}>Descargar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: item.qrCode }} style={styles.qrCode} />
    </View>
  );

  return (
    <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Historial de Tickets</Text>
      <Text style={styles.subtitle}>En esta sección podrás ver los tickets que has comprado y descargar los que aún no has canjeado</Text>
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    paddingTop: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#1D305F',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    backgroundColor: '#1D305F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 30,
    textAlign: 'center',
  },
  ticketContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  ticketNotchLeft: {
    position: 'absolute',
    top: '50%',
    left: -35,
    width: 50,
    height: 40,
    backgroundColor: '#CACDD4',
    borderRadius: 25,
  },
  ticketNotchRight: {
    position: 'absolute',
    top: '50%',
    right: -35,
    width: 50,
    height: 40,
    backgroundColor: '#CACDD4',
    borderRadius: 25,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6BE15',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  ticketLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#1D305F',
    marginHorizontal: 10,
  },
  ticketFrom: {
    color: '#1D305F',
    fontSize: 20,
    fontWeight: 'bold',
  },
  busIcon: {
    marginHorizontal: 10,
  },
  ticketTo: {
    color: '#1D305F',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#FFF',
  },
  ticketBody: {
    padding: 20,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketPrice: {
    color: '#1D305F',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ticketTime: {
    color: '#1D305F',
    fontSize: 18,
  },
  ticketDate: {
    color: '#1D305F',
    fontSize: 16,
  },
  qrCode: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  status: {
    color: '#1D305F',
    fontSize: 16,
    marginRight: 10,
  },
  downloadButton: {
    backgroundColor: '#1D305F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
