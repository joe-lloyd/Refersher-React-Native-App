import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ImageOverlay from '@/components/ImageOverlay';

interface PhotoProps {
  photoUri: string;
  recognizedData: any[];
  imageSize: { width: number, height: number };
  originalImageSize: { width: number, height: number };
  onClose: () => void;
  setImageSize: (size: { width: number, height: number }) => void;
}

const Photo: React.FC<PhotoProps> = ({
                                       photoUri,
                                       recognizedData,
                                       imageSize,
                                       originalImageSize,
                                       onClose,
                                       setImageSize,
                                     }) => {
  return (
    <View style={styles.photoContainer}>
      <View style={styles.photoWrapper}>
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setImageSize({ width, height });
          }}
        />
        <ImageOverlay
          recognizedData={recognizedData}
          imageSize={imageSize}
          originalImageSize={originalImageSize}
        />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    transform: [{ rotate: '45deg' }],
  },
});

export default Photo;
