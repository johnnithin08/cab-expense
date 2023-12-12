import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, NativeSyntheticEvent, TextInputChangeEventData, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

import { CustomSpacer, Icon, Icons, NewDatePicker } from '../../components'
import { centerHV, centerHorizontal, centerVertical, colorBlack, colorBlue, colorGray, flexChild, flexRow, flexRowCC, fs12BoldBlack2, fs12BoldGray6, fs18BoldBlack2, fs20BoldBlack2, fs24BoldBlack2 } from '../../styles';
import { CustomTextInput } from '../../components/Input';
import { NewDropdown } from '../../components/Dropdown';
import { CustomButton } from '../../components/Touchables/Button';
import { RoundedButton } from '../../components/Touchables';
import { createTransactions, updateTransactions } from '../../graphql/mutations';
import { getTransactions } from '../../graphql/queries';
import dayjs from 'dayjs';


interface ITransactonType  {
  amount: string;
  category: string;
  date: Date;
  description: string;
  name: string;
}

export const NewTransaction = () => {
  const [transactionData, setTransactionData] = useState<ITransactonType>({name: "", date: new Date, description: "", category: "", amount: ""})
  const {amount,category,date, description,name } = transactionData 
  const navigation = useNavigation();
  const route = useRoute()
  const client = generateClient();
  const type = route.params.type;
  const mode = route.params.mode;
  const id = route.params.id;

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

  const handleDateChange = (date: Date) => {
    setTransactionData({...transactionData, date: date})
  }


  const handleAddNewData = async () => {
    try 
     {
       const currentUser = await getCurrentUser();
       const response = await client.graphql({
         query: createTransactions,
         variables: { input: { amount: amount, category: category, date: dayjs(date).toDate(), description: description, name: name, type: type,userID: currentUser.userId} }
       });
       navigation.navigate("Transactions");
     }
    catch(err)
     {
      console.log("err", err)
     }
  }

  const handleEditData = async () => {
    try 
     {
       const response = await client.graphql({
         query: updateTransactions,
         variables: { input: { id: id, amount: amount, category: category, date: dayjs(date).toDate(), description: description, name: name, type: type} }
       });
       navigation.navigate("Transactions");
     }
    catch(err)
     {
      console.log("err", err)
     }
  }

  const handleSave = async () => {
    if(mode === "new")
     {
        handleAddNewData();
     }
    else
     {
        handleEditData();
     }
  }

  const handleFetchTransaction = async () => {
    try
     {
      const response = await client.graphql({
        query: getTransactions,
        variables: {  id: id }
      });
      const {amount, date, category, description, name } = response.data.getTransactions
      setTransactionData({ amount, category, date, description, name})
     }
    catch(err)
     {
      console.log("err", err)
     }
  }

  useEffect(() => {
    if(id)
     {
      handleFetchTransaction()
     }
  },[id])

  const earningTypes: TypeLabelValue[] = [
    {
      label: "RJ Cash",
      value: "RJ Cash"
    },
    {
      label: "RJ Card",
      value: "RJ Card"
    },
    {
      label: "Tips",
      value: "Tips"
    },
    {
      label: "Other",
      value: "Other"
    },
  ]
  const expenseTypes: TypeLabelValue[] = [
    {
      label: "Fuel",
      value: "Fuel"
    },
    {
      label: "Full Service",
      value: "Full Service"
    },
    {
      label: "Other",
      value: "Other"
    },
  ]

  const checkCategory = type === "Earning" ? earningTypes : expenseTypes;
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
          <Text style={fs12BoldGray6}>Transaction Date</Text>
          <CustomSpacer space={hp(1)} />
          <NewDatePicker 
            datePickerStyle={{width: wp(70)}}
            viewStyle={{width: wp(70)}}
            mode={"date"} 
            value={date}
            setValue={handleDateChange}            
          /> 
          <CustomSpacer space={hp(4)} />
          <NewDropdown 
            handleChange={handleCategory}
            items={checkCategory}
            label='Category'
            value={category}
            viewStyle={{width: wp(70)}}
          />
          <CustomSpacer space={hp(8)} />
          <View style={flexRowCC}>
            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleBack} text={'Cancel'} />
            <CustomSpacer isHorizontal={true} space={hp(4)} />
            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleSave} text={'Save'} />
          </View>
        </View>
    </SafeAreaView>
  )
}