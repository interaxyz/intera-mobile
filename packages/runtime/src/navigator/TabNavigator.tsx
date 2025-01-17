import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackHeaderProps, NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import TabDiscover from 'src/dappsExplorer/TabDiscover'
import TabHome from 'src/home/TabHome'
import Discover from 'src/icons/navigator/Discover'
import Home from 'src/icons/navigator/Home'
import Wallet from 'src/icons/navigator/Wallet'
import { tabHeader } from 'src/navigator/Headers'
import { Screens } from 'src/navigator/Screens'
import { StackParamList } from 'src/navigator/types'
import { getAppConfig } from 'src/public/appConfig'
import { TabOptions, TabScreenConfig } from 'src/public/types'
import Colors from 'src/styles/colors'
import { typeScale } from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'
import variables from 'src/styles/variables'
import TabWallet from 'src/tokens/TabWallet'

const Tab = createBottomTabNavigator()

type Props = NativeStackScreenProps<StackParamList, Screens.TabNavigator>

type TabScreenConfigWithExtraOptions = TabScreenConfig & {
  options: TabOptions & {
    freezeOnBlur?: boolean
    lazy?: boolean
  }
}

const DEFAULT_SCREENS: Record<string, TabScreenConfigWithExtraOptions> = {
  wallet: {
    name: Screens.TabWallet,
    component: TabWallet,
    options: {
      icon: Wallet,
      label: (t) => t('bottomTabsNavigator.wallet.tabName'),
      testID: 'Tab/Wallet',
    },
  },
  activity: {
    // TODO: we'll rename this to TabActivity
    name: Screens.TabHome,
    component: TabHome,
    options: {
      icon: Home,
      label: (t) => t('bottomTabsNavigator.home.tabName'),
      testID: 'Tab/Home',
      // Extra options currently needed for the home screen
      // TODO: refactor so we don't need these
      freezeOnBlur: false,
      lazy: false,
    },
  },
  discover: {
    name: Screens.TabDiscover,
    component: TabDiscover,
    options: {
      icon: Discover,
      label: (t) => t('bottomTabsNavigator.discover.tabName'),
      testID: 'Tab/Discover',
    },
  },
  earn: {
    // TODO: we'll use the earn component here
    name: Screens.TabDiscover,
    component: TabDiscover,
    options: {
      icon: Discover,
      label: (t) => t('bottomTabsNavigator.earn.tabName'),
      testID: 'Tab/Earn',
    },
  },
}

export default function TabNavigator({ route }: Props) {
  const { t } = useTranslation()
  const config = getAppConfig()
  const screens = config.screens?.tabs?.screens ?? ['wallet', 'activity', 'discover']
  const initialScreen = config.screens?.tabs?.initialScreen ?? 'activity'

  const initialScreenConfig =
    typeof initialScreen === 'number'
      ? typeof screens[initialScreen] === 'string'
        ? DEFAULT_SCREENS[screens[initialScreen]]
        : screens[initialScreen]
      : DEFAULT_SCREENS[initialScreen]

  const screenConfigs = screens.map((screen, index) => {
    const isDefaultScreen = typeof screen === 'string'
    const screenConfig = isDefaultScreen ? DEFAULT_SCREENS[screen] : screen
    return screenConfig
  })

  // Find the initial screen config to be sure it's actually in the list
  const initialRouteName = screenConfigs.find(
    (screenConfig) => screenConfig === initialScreenConfig
  )?.name

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAllowFontScaling: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray3,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabBarItem,
        tabBarAllowFontScaling: false,
        tabBarStyle: {
          height: variables.height * 0.1,
        },
        ...(tabHeader as NativeStackHeaderProps),
      }}
    >
      {screenConfigs.map((screenConfig) => {
        return (
          <Tab.Screen
            key={screenConfig.name}
            name={screenConfig.name}
            component={screenConfig.component}
            options={{
              ...screenConfig.options,
              tabBarLabel: screenConfig.options.label(t),
              tabBarIcon: screenConfig.options.icon,
              tabBarButtonTestID: screenConfig.options.testID,
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  label: {
    ...typeScale.labelSemiBoldSmall,
  },
  tabBarItem: {
    paddingVertical: Spacing.Smallest8,
  },
})
