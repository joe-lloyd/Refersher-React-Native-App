import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, Camera, CameraCapturedPicture } from 'expo-camera';
import { processImage } from '@/services/ocrService';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [recognizedData, setRecognizedData] = useState<any[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });

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


        setOriginalImageSize({ width: photo.width, height: photo.height });


        const recognizedTextData = await processImage(photo.uri);
        setRecognizedData(recognizedTextData);

      } catch (error) {
        console.error('Error taking picture: ', error);
      }
    }
  };

  const normalizeBoundingBox = (box, displayedImageWidth, displayedImageHeight, originalImageWidth, originalImageHeight) => {

    const scaleX = displayedImageWidth / originalImageWidth;
    const scaleY = displayedImageHeight / originalImageHeight;


    return {
      x: box.x * scaleX,
      y: box.y * scaleY,
    };
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.photoContainer}>

          <View style={{width: '100%', position: 'relative', aspectRatio: '3 / 4'}}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            resizeMode="contain"
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

          </View>

          {/* Close button to reset */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setPhoto(null)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              onCameraReady={() => setIsCameraReady(true)}
              ratio={'4:3'}
            />
          </View>
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
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    maxWidth: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: 500,

  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
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
