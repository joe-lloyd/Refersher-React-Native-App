import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, Camera, CameraCapturedPicture } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);  // Updated type for photo

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync() as CameraCapturedPicture;
        setPhoto(photo);
      } catch (error) {
        console.error("Error taking picture: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Render the image preview if a photo is taken */}
      {photo && (
        <Image
          source={{ uri: photo.uri }}  // Set the source to the captured photo URI
          style={styles.thumbnail}  // Use the thumbnail style to position it in the bottom-right corner
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
    thumbnail: {
      position: 'absolute',
      bottom: 70,
      right: 10,
      width: 100,
      height: 100,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'white',
    },
});
