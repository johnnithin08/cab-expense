import React, { useEffect, useRef } from 'react'
import {  Pressable, TouchableOpacity, View, ViewStyle } from 'react-native'
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { Dashboard, Expenses } from '../pages';
import { absolutePosition, colorBlack, colorGreen, colorWhite, flexChild, flexColCC } from '../styles';
import { Icon, Icons } from '../components/Icon';


const { Navigator, Screen} = createBottomTabNavigator();




export const HomeNavigation = () => {

    const tabsArray = [
        {
          name: "Movies",
          component: Dashboard,
          type: Icons.Fontisto,
          iconName: "film",
        },
        {
          name: "TV",
          component: Expenses,
          type: Icons.Feather,
          iconName: "tv",
        },
      ]

      const barStyle: ViewStyle = {
        ...absolutePosition,
        backgroundColor: colorWhite._1,
        bottom: 15,
        left: 15,
        right: 15,
        borderRadius: 16,
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
    
              <Icon type={item.type} name={item.iconName} color={focused ? colorGreen._1 : colorBlack._1} />
            </Animated.View>
          </Pressable>
        )
    
      }
    
  return (
    <NavigationContainer>
        <Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false, tabBarStyle: barStyle, tabBarHideOnKeyboard: true  }}>
        {tabsArray.map((eachScreen, index) => {
        const { name, component } = eachScreen;

        return (
          <Screen key={index} name={name} component={component} options={{ tabBarShowLabel: true, tabBarButton: (props) => <TabBarButton {...props} item={eachScreen} /> }} />
        )
      })}
        </Navigator>
    </NavigationContainer>
  )
}