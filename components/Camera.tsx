import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import { CameraView, CameraCapturedPicture, Camera as ExpoCamera } from 'expo-camera';

interface CameraComponentProps {
  onPictureTaken: (photo: CameraCapturedPicture) => void;
}

export default function Camera({ onPictureTaken }: CameraComponentProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [buttonFill] = useState(new Animated.Value(0)); // For button fill animation

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        Animated.timing(buttonFill, {
          toValue: 1, // Fill the button
          duration: 200,
          useNativeDriver: false,
        }).start();

        const photo = await cameraRef.current.takePictureAsync() as CameraCapturedPicture;
        onPictureTaken(photo);

        Animated.timing(buttonFill, {
          toValue: 0, // Reset fill after picture taken
          duration: 200,
          useNativeDriver: false,
        }).start();
      } catch (error) {
        console.error('Error taking picture: ', error);
      }
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
        ratio="4:3"
      />
      {/* Camera Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.outerButton} onPress={takePicture}>
          <Animated.View style={[styles.innerButton, { transform: [{ scale: buttonFill }] }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 65,
    alignItems: 'center',
  },
  outerButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  innerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Default transparent fill
  },
});
