import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { flexChild } from '../../styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabGroup, TabProps } from '../../components'

export const Dashboard = () => {


  return (
    <SafeAreaView style={flexChild}>
        <View>
            <Text>Dashboard</Text>
        </View>
        
    </SafeAreaView>
  )
}