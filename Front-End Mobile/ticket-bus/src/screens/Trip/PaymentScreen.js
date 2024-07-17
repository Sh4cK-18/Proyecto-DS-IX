import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import routeService from '../../services/routeService';
import paymentService from '../../services/paymentService';
import ticketService from '../../services/ticketService';
import LocationInput from '../../componets/locationInput';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { routeId, userId } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [compraId, setCompraId] = useState(null);
  const { confirmPayment } = useConfirmPayment();

  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [seniorTickets, setSeniorTickets] = useState(0);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const response = await routeService.getRoute(routeId);
        if (response) {
          setRouteData(response);
        } else {
          Alert.alert('Error', 'No se pudieron obtener los detalles de la ruta');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron obtener los detalles de la ruta');
      }
    };
    fetchRouteDetails();
  }, [routeId]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (routeData) {
        try {
          const totalAmount = calculateTotal();
          const ticketData = {
            rutaId: routeId,
            cantidad_adulto: adultTickets,
            cantidad_nino: childTickets,
            cantidad_tercera_edad: seniorTickets,
          };
          const ticketResponse = await ticketService.createTicket(ticketData);

          const boletoId = ticketResponse.ticket.boletoId;
          if (!boletoId) {
            throw new Error('Invalid boletoId');
          }

          const paymentResponse = await paymentService.createPayment(boletoId, userId);
          setClientSecret(paymentResponse.clientSecret);
          setCompraId(paymentResponse.compraId);
        } catch (error) {
          console.error('Error creating payment:', error);
          Alert.alert('Error', 'No se pudo crear el pago.');
        }
      }
    };

    fetchPaymentIntent();
  }, [routeData]);

  const handlePayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: { email: 'email@example.com' },
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentIntent) {
      try {
        const response = await paymentService.capturePayment(paymentIntent.id, compraId);
        Alert.alert('Success', response.message);
        navigation.navigate('Confirmation', { totalAmount: calculateTotal() });
      } catch (error) {
        Alert.alert('Error', 'Could not update payment status');
      }
    }
  };

  const calculateTotal = () => {
    return (adultTickets * parseFloat(routeData.precio_adulto) + childTickets * parseFloat(routeData.precio_nino) + seniorTickets * parseFloat(routeData.precio_tercera_edad)).toFixed(2);
  };

  if (!routeData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground source={require('../../../assets/img/wallpaperA.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.ticketContainer}>
            <View style={styles.ticketInfoContainer}>
              <Text style={styles.title}>Comprar Ticket</Text>
              <LocationInput
                label="Comienzo"
                value={routeData.salida}
                placeholder="Your Location"
                icon="A"
              />
              <View style={styles.dashedLineContainer}>
                <View style={styles.dashedLine} />
              </View>
              <LocationInput
                label="Tu destino"
                value={routeData.llegada}
                placeholder="London UK"
                icon="B"
              />
              <View style={[styles.row, styles.spaceBetween]}>
                <View style={styles.rowItem}>
                  <Icon name="clock" size={20} color="#F6BE15" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Hora de salida</Text>
                    <Text style={styles.station}>{new Date(routeData.fecha_hora).toLocaleTimeString()}</Text>
                  </View>
                </View>
                <View style={styles.rowItem}>
                  <Icon name="calendar" size={20} color="#F6BE15" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Fecha</Text>
                    <Text style={styles.station}>{new Date(routeData.fecha_hora).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.row, styles.spaceBetween]}>
                <View style={styles.rowItem}>
                  <Icon name="door-open" size={20} color="#F6BE15" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Puerta de embarque</Text>
                    <Text style={styles.station}>{routeData.puerta}</Text>
                  </View>
                </View>
                <View style={styles.rowItem}>
                  <Icon name="bus" size={20} color="#F6BE15" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Ruta</Text>
                    <Text style={styles.station}>{routeData.rutaId}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentTitle}>Pago</Text>
            <View style={styles.ticketSelectionContainer}>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Adulto</Text>
                <Text style={styles.ticketPrice}>B/. {routeData.precio_adulto}</Text>
                <View style={styles.ticketCounter}>
                  <TouchableOpacity onPress={() => setAdultTickets(Math.max(0, adultTickets - 1))}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.ticketCount}>{adultTickets}</Text>
                  <TouchableOpacity onPress={() => setAdultTickets(adultTickets + 1)}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Niño</Text>
                <Text style={styles.ticketPrice}>B/. {routeData.precio_nino}</Text>
                <View style={styles.ticketCounter}>
                  <TouchableOpacity onPress={() => setChildTickets(Math.max(0, childTickets - 1))}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.ticketCount}>{childTickets}</Text>
                  <TouchableOpacity onPress={() => setChildTickets(childTickets + 1)}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Tercera edad</Text>
                <Text style={styles.ticketPrice}>B/. {routeData.precio_tercera_edad}</Text>
                <View style={styles.ticketCounter}>
                  <TouchableOpacity onPress={() => setSeniorTickets(Math.max(0, seniorTickets - 1))}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.ticketCount}>{seniorTickets}</Text>
                  <TouchableOpacity onPress={() => setSeniorTickets(seniorTickets + 1)}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>B/. {calculateTotal()}</Text>
            </View>
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 30,
              }}
              onCardChange={(cardDetails) => {
                console.log('cardDetails', cardDetails);
              }}
            />
            <TouchableOpacity style={styles.buyButton} onPress={handlePayment}>
              <Text style={styles.buyButtonText}>Pagar</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketContainer: {
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketInfoContainer: {
    backgroundColor: '#1D305F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 15,
  },
  stationInfo: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    color: 'white',
  },
  station: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  paymentContainer: {
    padding: 20,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  ticketSelectionContainer: {
    marginBottom: 20,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketLabel: {
    fontSize: 16,
    color: 'black',
  },
  ticketPrice: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  ticketCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    fontSize: 20,
    color: 'black',
    paddingHorizontal: 10,
  },
  ticketCount: {
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: 'black',
  },
  totalAmount: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#F6BE15',
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
  loadingText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
