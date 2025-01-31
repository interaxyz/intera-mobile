import { createApp } from '@interaxyz/mobile'
import { registerRootComponent } from 'expo'
import Constants from 'expo-constants'

const expoConfig = Constants.expoConfig
if (!expoConfig) {
  throw new Error('expoConfig is not available')
}

// Create Mobile Stack app
const App = createApp({
  // For now use 'Valora' so CPV works (since it's known by identity-service)
  // TODO: find a better long term solution
  registryName: 'Valora',
  displayName: expoConfig.name,
  deepLinkUrlScheme: expoConfig.scheme
    ? Array.isArray(expoConfig.scheme)
      ? expoConfig.scheme[0]
      : expoConfig.scheme
    : 'example',
  features: {
    // Special case for e2e tests as it doesn't handle cloud backup
    ...(process.env.EXPO_PUBLIC_MOBILE_STACK_E2E === 'true' && {
      cloudBackup: false,
    }),
  },
  locales: {
    'en-US': require('./locales/en-US/custom.json'),
    'es-419': require('./locales/es-419/custom.json'),
    'pt-BR': require('./locales/pt-BR/custom.json'),
    de: require('./locales/de/custom.json'),
    'ru-RU': require('./locales/ru-RU/custom.json'),
    'fr-FR': require('./locales/fr-FR/custom.json'),
    'it-IT': require('./locales/it-IT/custom.json'),
    'uk-UA': require('./locales/uk-UA/custom.json'),
    'pl-PL': require('./locales/pl-PL/custom.json'),
    'th-TH': require('./locales/th-TH/custom.json'),
    'tr-TR': require('./locales/tr-TR/custom.json'),
    'vi-VN': require('./locales/vi-VN/custom.json'),
    'zh-CN': require('./locales/zh-CN/custom.json'),
  },
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
