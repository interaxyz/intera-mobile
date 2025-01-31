const { withPlugins } = require('@expo/config-plugins')

/**
 * Use this plugin to conditionally apply Detox plugin
 * @param {ExpoConfig} config
 * @return {ExpoConfig}
 */
module.exports = (config, properties = {}) => {
  // Check if E2E testing is enabled via env variable
  if (process.env.EXPO_PUBLIC_MOBILE_STACK_E2E === 'true') {
    // Only apply Detox plugin if E2E testing is enabled
    return withPlugins(config, ['@config-plugins/detox'])
  }

  // Return unmodified config if E2E testing is disabled
  return config
}
