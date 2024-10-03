const { withPlugins } = require('@expo/config-plugins');

module.exports = function withMLKit(config) {
  return withPlugins(config, [
    // Add any other native dependencies or plugins here
    // For example, if @react-native-ml-kit/text-recognition needs specific configuration, add it here
  ]);
};
