import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NativeStackHeaderProps, NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { tabHeader } from 'src/navigator/Headers'
import { Screens } from 'src/navigator/Screens'
import { StackParamList } from 'src/navigator/types'
import { getAppConfig } from 'src/public/appConfig'
import { defaultTabs } from 'src/public/types'
import Colors from 'src/styles/colors'
import { typeScale } from 'src/styles/fonts'
import { Spacing } from 'src/styles/styles'
import variables from 'src/styles/variables'

const Tab = createBottomTabNavigator()

type Props = NativeStackScreenProps<StackParamList, Screens.TabNavigator>

// type TabScreenConfigWithExtraOptions = TabScreenConfig & {
//   options: TabOptions & {
//     freezeOnBlur?: boolean
//     lazy?: boolean
//   }
// }

export default function TabNavigator({ route }: Props) {
  const { t } = useTranslation()
  const config = getAppConfig()
  const screens = config.screens?.tabs?.screens ?? [
    defaultTabs.wallet,
    defaultTabs.activity,
    defaultTabs.discover,
  ]
  const initialScreen = config.screens?.tabs?.initialScreen ?? defaultTabs.activity.name

  // Find the initial screen config to be sure it's actually in the list
  const initialScreenConfig = screens.find((screen) => screen.name === initialScreen)

  const initialRouteName = initialScreenConfig?.name

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
      {screens.map((screenConfig) => {
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
