import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Camera from '@/components/Camera';
import Photo from '@/components/Photo';
import AdBanner from '@/components/AdBanner';
import { processImage } from '@/services/ocrService';
import { CameraCapturedPicture } from 'expo-camera';

export default function CameraScreen() {
  const [photo, setPhoto] = useState<CameraCapturedPicture>();
  const [recognizedData, setRecognizedData] = useState<any[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });

  const handlePictureTaken = async (photo: CameraCapturedPicture) => {
    setPhoto(photo);
    setOriginalImageSize({ width: photo.width, height: photo.height });

    const recognizedTextData = await processImage(photo.uri);
    setRecognizedData(recognizedTextData);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <Photo
          photoUri={photo.uri}
          recognizedData={recognizedData}
          imageSize={imageSize}
          originalImageSize={originalImageSize}
          onClose={() => setPhoto(null)}
          setImageSize={setImageSize}
        />
      ) : (
        <Camera onPictureTaken={handlePictureTaken} />
      )}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
