import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, Camera, CameraCapturedPicture } from 'expo-camera';
import { processImage } from '@/services/ocrService';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [recognizedData, setRecognizedData] = useState<any[]>([]); // Store recognized text with position
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // To store displayed image size
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 }); // To store original image size

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

        // Set the original image size for scaling purposes
        setOriginalImageSize({ width: photo.width, height: photo.height });

        // Process the image using ML Kit's text recognition and get text with positions
        const recognizedTextData = await processImage(photo.uri);
        setRecognizedData(recognizedTextData);

      } catch (error) {
        console.error('Error taking picture: ', error);
      }
    }
  };

  const normalizeBoundingBox = (box, displayedImageWidth, displayedImageHeight, originalImageWidth, originalImageHeight) => {
    // Calculate scaling factor between the original image and displayed image
    const scaleX = displayedImageWidth / originalImageWidth;
    const scaleY = displayedImageHeight / originalImageHeight;

    const scaleAdjustment = 0.05;
    // Normalize the position of the bounding box (just for positioning)
    return {
      x: box.x * scaleX,
      y: box.y * scaleY,
    };
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.photoContainer}>
          {/* Display the captured image */}
          <Image
            source={{ uri: photo.uri }}
            style={styles.fullScreenImage}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setImageSize({ width, height });
            }}
          />

          {/* Display the recognized text as an overlay */}
          {recognizedData.length > 0 && recognizedData.map((item, index) => {
            if (!item.text) return null;

            const normalizedBox = normalizeBoundingBox(
              item.boundingBox,
              imageSize.width,
              imageSize.height,
              originalImageSize.width,
              originalImageSize.height,
            );

            return (
              <View
                key={index}
                style={[
                  styles.textOverlay,
                  {
                    top: normalizedBox.y,
                    left: normalizedBox.x,
                  },
                ]}
              >
                <Text style={styles.overlayText}>{item.text}</Text>
              </View>
            );
          })}

          {/* Close button to reset */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setPhoto(null)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
        </View>
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
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background of the text box
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5, // Optional padding to give the text more room inside
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
