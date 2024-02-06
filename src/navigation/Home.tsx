import React, { useEffect, useRef } from 'react'
import {  Pressable, TouchableOpacity, View, ViewStyle } from 'react-native'
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { NavigationContainer } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import {useSafeAreaInsets} from "react-native-safe-area-context"

import { Dashboard } from '../pages';
import { absolutePosition, colorBlack, colorBlue, colorGray, colorGreen, colorWhite, flexChild, flexColCC } from '../styles';
import { Icon, Icons } from '../components/Icon';
import { TransactionStack } from './TransactionStack';
import { Profile } from '../pages/Profile';


const { Navigator, Screen} = createBottomTabNavigator();




export const HomeNavigation = () => {

    const {bottom} = useSafeAreaInsets()

    const tabsArray = [
        {
          name: "Dashboard",
          component: Dashboard,
          type: Icons.AntDesign,
          iconName: "dashboard",
        },
        {
          name: "TransactionsStack",
          component: TransactionStack,
          type: Icons.FontAwesome6,
          iconName: "money-bill-transfer",
        },
        {
          name: "Profile",
          component: Profile,
          type: Icons.MaterialCommunityIcons,
          iconName: "account",
        },
      ]

      const dynamicStyles: ViewStyle = bottom === 0  ? {
        ...absolutePosition,
        bottom: hp(2),
        left: wp(8),
        right: wp(8),

      } : {}

      const barStyle: ViewStyle = {
        borderRadius: 16,
        margin: 0,
        padding: 0,
        ...dynamicStyles
      }

      const TabBarButton = (props: BottomTabBarButtonProps) => {
        const { item, onPress, accessibilityState } = props;
        const focused = accessibilityState.selected;
        const scale = useSharedValue(1)
    
        useEffect(() => {
          if (focused === true) {
    
            scale.value = 1.5
          }
          else {
            scale.value = 1
          }
        }, [focused])
    
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withTiming(scale.value, { duration: 500 }) }]
          };
        }, [focused]);
    
        return (
          <Pressable onPress={onPress} style={{ ...flexChild, ...flexColCC }}>
            <Animated.View style={animatedStyle}>
    
              <Icon type={item.type} name={item.iconName} color={focused ? colorBlue._1 : colorGray._4} />
            </Animated.View>
          </Pressable>
        )
    
      }
    
  return (
    <NavigationContainer>
        <Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false, tabBarStyle: barStyle, tabBarHideOnKeyboard: true  }} >
        {tabsArray.map((eachScreen, index) => {
        const { name, component } = eachScreen;

        return (
          <Screen key={index} name={name} component={component} options={{ tabBarShowLabel: true, tabBarButton: (props) => <TabBarButton  {...props} item={eachScreen} /> }} />
        )
      })}
        </Navigator>
    </NavigationContainer>
  )
}