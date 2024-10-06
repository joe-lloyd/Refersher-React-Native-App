import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AdBanner = () => {
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={TestIds.BANNER} // Replace with your real Ad Unit ID when ready
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('Ad loaded')}
        onAdFailedToLoad={(error) => console.error('Ad failed to load: ', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default AdBanner;
