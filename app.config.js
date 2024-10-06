import 'dotenv/config';

export default () => ({
  'expo': {
    'name': 'refresher',
    'slug': 'to-do-app',
    'version': '1.0.0',
    'orientation': 'portrait',
    'icon': './assets/images/icon.png',
    'scheme': 'myapp',
    'userInterfaceStyle': 'automatic',
    'splash': {
      'image': './assets/images/splash.png',
      'resizeMode': 'contain',
      'backgroundColor': '#ffffff',
    },
    'ios': {
      'supportsTablet': true,
      'bundleIdentifier': 'com.joelloydwebapps.todoapp',
    },
    'android': {
      'adaptiveIcon': {
        'foregroundImage': './assets/images/adaptive-icon.png',
        'backgroundColor': '#ffffff',
      },
      'package': 'com.joelloydwebapps.todoapp',
    },
    'web': {
      'bundler': 'metro',
      'output': 'static',
      'favicon': './assets/images/favicon.png',
    },
    'plugins': [
      'expo-router',
      './plugins/withMLKit',
      [
        'react-native-google-mobile-ads',
        {
          'androidAppId': process.env.ANDROID_ADS_APP_ID,
          'userTrackingUsageDescription': 'This identaifier will be used to deliver personalized ads to you.',
        },
      ],
    ],
    'experiments': {
      'typedRoutes': true,
    },
    'extra': {
      'eas': {
        'projectId': process.env.EAS_PROJECT_ID,
      },
    },
    'owner': 'joelloydwebapps',
    'runtimeVersion': {
      'policy': 'appVersion',
    },
    'updates': {
      'url': process.env.EXPO_UPDATES_URL,
    },
  },
});
