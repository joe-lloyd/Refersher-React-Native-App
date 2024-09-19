import React, { useEffect } from 'react';
import { Button, Platform, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { View, Text } from '@/components/Themed';
import * as Device from 'expo-device';

// Configure Notifications (triggered for both iOS and Android)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabOneScreen() {
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log(token));

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  const handlePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Push Notification 🎉',
        body: 'This is a local push notification!',
      },
      trigger: { seconds: 2 }, // Wait 2 seconds before triggering
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One - Push Notification</Text>
      <Button title="Send Push Notification" onPress={handlePushNotification} />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
