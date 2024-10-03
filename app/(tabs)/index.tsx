import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, Camera, CameraCapturedPicture } from 'expo-camera';
import { processImage, convertToPinyin } from '@/services/ocrService';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [pinyinResult, setPinyinResult] = useState<string | null>(null);

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

        // Process the image using ML Kit's text recognition and convert to Pinyin
        const recognizedText = await processImage(photo.uri); // Pass the photo URI
        console.log("Recognized Text: ", recognizedText)
        const pinyinText = convertToPinyin(recognizedText); // Convert the recognized text to Pinyin
        setPinyinResult(pinyinText);

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

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={styles.thumbnail}
        />
      )}

      {/* Display the pinyin result after processing */}
      {pinyinResult && (
        <Text style={styles.pinyinText}>Pinyin: {pinyinResult}</Text>
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
  pinyinText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'white'
  }
});
