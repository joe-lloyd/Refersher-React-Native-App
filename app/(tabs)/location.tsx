import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Text } from '@/components/Themed';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  return (
    <View style={styles.container}>
      <Button title="Get Location" onPress={getLocation} />

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        location && (
          <View>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});
