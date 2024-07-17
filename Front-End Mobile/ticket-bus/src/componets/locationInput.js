import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LocationInput = ({ label, value, placeholder, icon }) => {
  return (
    <View style={styles.inputRow}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.textInputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput 
          style={[styles.input, styles.inputBorder]} 
          placeholder={placeholder} 
          placeholderTextColor="#A9A9A9" 
          value={value}
          editable={false} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    backgroundColor: '#F6BE15',
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
});

export default LocationInput;
