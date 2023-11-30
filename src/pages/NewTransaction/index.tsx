import React, { useState } from 'react'
import { View, Text, Pressable, NativeSyntheticEvent, TextInputChangeEventData, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';

import { CustomSpacer, Icon, Icons } from '../../components'
import { centerHV, centerHorizontal, centerVertical, colorBlack, colorBlue, colorGray, flexChild, flexRow, flexRowCC, fs12BoldBlack2, fs18BoldBlack2, fs20BoldBlack2, fs24BoldBlack2 } from '../../styles';
import { CustomTextInput } from '../../components/Input';
import { NewDropdown } from '../../components/Dropdown';
import { CustomButton } from '../../components/Touchables/Button';
import { RoundedButton } from '../../components/Touchables';


interface ITransactonType  {
  amount: string;
  category: string;
  description: string;
  name: string;
}

export const NewTransaction = () => {
  const [transactionData, setTransactionData] = useState<ITransactonType>({name: "", description: "", category: "", amount: ""})
  const {amount,category, description,name } = transactionData 
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate("Transactions")
  }

  const handleChange = (value: string, key: string ) => {
      setTransactionData({
        ...transactionData,
        [key]: value
      })
  }

  const handleCategory = (value: string) => {
    setTransactionData({...transactionData, category: value})
  }

  const categoryArray: TypeLabelValue[] = [
    {
      label: "Gas",
      value: "Gas"
    },
    {
      label: "Petrol",
      value: "Petrol"
    },
  ]
  return (
    <SafeAreaView style={flexChild}>
        <CustomSpacer space={hp(2)} />
        <View style={{...flexChild, marginHorizontal: wp(6)}}>
          <Pressable onPress={handleBack} style={{...flexRow, ...centerVertical}}>
            <Icon type={Icons.Ionicons} name="arrow-back" color={colorBlack._2}/>
            <CustomSpacer isHorizontal={true} space={wp(2)} />
            <Text style={fs20BoldBlack2}>Back</Text> 
          </Pressable>
          <CustomSpacer space={hp(4)} />
          <CustomTextInput id="name" label='Name' value={name} onChangeText={(value) => handleChange(value, "name")} viewStyle={{width: wp(50)}}/>
          <CustomSpacer space={hp(4)} />
          <CustomTextInput 
            id="name" 
            label='Description' 
            value={description} 
            onChangeText={(value) => handleChange(value, "description")} 
            viewStyle={{width: wp(50)}}
          />
          <CustomSpacer space={hp(4)} />
          <CustomTextInput id="name" label='Amount' value={amount} onChangeText={(value) => handleChange(value, "amount")} viewStyle={{width: wp(50)}}/>
          <CustomSpacer space={hp(4)} />
          <NewDropdown 
            handleChange={handleCategory}
            items={categoryArray}
            label='Category'
            value={category}
            viewStyle={{width: wp(50)}}
          />
          <CustomSpacer space={hp(8)} />
          <View style={flexRowCC}>
            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleBack} text={'Cancel'} />
            <CustomSpacer isHorizontal={true} space={hp(4)} />
            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleBack} text={'Save'} />
          </View>
        </View>
    </SafeAreaView>
  )
}