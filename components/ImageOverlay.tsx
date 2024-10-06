import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ImageOverlayProps {
  recognizedData: any[];
  imageSize: { width: number, height: number };
  originalImageSize: { width: number, height: number };
}

export default function ImageOverlay({ recognizedData, imageSize, originalImageSize }: ImageOverlayProps) {
  const normalizeBoundingBox = (box, displayedImageWidth, displayedImageHeight, originalImageWidth, originalImageHeight) => {
    const scaleX = displayedImageWidth / originalImageWidth;
    const scaleY = displayedImageHeight / originalImageHeight;
    return { x: box.x * scaleX, y: box.y * scaleY };
  };

  return (
    <>
      {recognizedData.map((item, index) => {
        if (!item.text) return null;

        const normalizedBox = normalizeBoundingBox(
          item.boundingBox,
          imageSize.width,
          imageSize.height,
          originalImageSize.width,
          originalImageSize.height
        );

        return (
          <View
            key={index}
            style={[
              styles.textOverlay,
              { top: normalizedBox.y, left: normalizedBox.x }
            ]}
          >
            <Text style={styles.overlayText}>{item.text}</Text>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
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
});
