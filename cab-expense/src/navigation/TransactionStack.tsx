import React from 'react'
import {createStackNavigator} from "@react-navigation/stack"
import {  Transactions, NewTransaction } from '../pages'

const {Screen, Navigator} = createStackNavigator()

export const TransactionStack = () => {
  return (
    <Navigator initialRouteName='Transactions' screenOptions={{headerShown: false}}>
      <Screen name="Transactions" component={Transactions}/>
      <Screen name="NewTransaction" component={NewTransaction}/>
    </Navigator>
  )
}
