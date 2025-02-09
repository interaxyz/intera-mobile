import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppAnalytics from 'src/analytics/AppAnalytics'
import { BuilderHooksEvents } from 'src/analytics/Events'
import Touchable from 'src/components/Touchable'
import { hooksPreviewApiUrlSelector, hooksPreviewStatusSelector } from 'src/positions/selectors'
import { previewModeDisabled } from 'src/positions/slice'
import { useDispatch, useSelector } from 'src/redux/hooks'
import colors from 'src/styles/colors'
import { typeScale } from 'src/styles/fonts'

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)

const STATUS_COLORS = {
  idle: colors.inactive,
  loading: colors.inactive,
  success: colors.accent,
  error: colors.errorPrimary,
}

export default function HooksPreviewModeBanner() {
  const hooksPreviewApiUrl = useSelector(hooksPreviewApiUrlSelector)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const status = useSelector(hooksPreviewStatusSelector)

  function onPress() {
    AppAnalytics.track(BuilderHooksEvents.hooks_disable_preview)
    dispatch(previewModeDisabled())
  }

  if (!hooksPreviewApiUrl) {
    return null
  }

  return (
    <AnimatedSafeAreaView
      style={[styles.container, { backgroundColor: STATUS_COLORS[status] }]}
      edges={['top']}
      entering={SlideInUp}
      exiting={SlideOutUp}
    >
      <Touchable onPress={onPress} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Text style={styles.text} numberOfLines={1}>
          {t('hooksPreview.bannerTitle')}
        </Text>
      </Touchable>
    </AnimatedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    backgroundColor: colors.warningPrimary,
  },
  text: {
    ...typeScale.labelXSmall,
    color: colors.contentTertiary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
})
