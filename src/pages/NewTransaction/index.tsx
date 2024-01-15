import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, NativeSyntheticEvent, TextInputChangeEventData, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import dayjs from 'dayjs';

import { CustomSpacer, Icon, Icons, NewDatePicker } from '../../components'
import { alignItemsEnd, centerHV, centerHorizontal, centerVertical, circle, colorBlack, colorBlue, colorGray, colorRed, colorWhite, flexChild, flexRow, flexRowCC, fs12BoldBlack2, fs12BoldGray6, fs18BoldBlack2, fs20BoldBlack2, fs24BoldBlack2 } from '../../styles';
import { CustomTextInput } from '../../components/Input';
import { NewDropdown } from '../../components/Dropdown';
import { CustomButton } from '../../components/Touchables/Button';
import { RoundedButton } from '../../components/Touchables';
import { createCategories, createTransactions, updateCategories, updateTransactions } from '../../graphql/mutations';
import { categoriesByUserID, getTransactions } from '../../graphql/queries';
import { Switch } from '../../components/Switch/Switch';


interface ITransactonType  {
  amount: string;
  category: string;
  date: Date;
  description: string;
  name: string;
  newCategory: boolean;
  newCategoryValue: string;
}

interface ICategoryData {
  id: string;
  categories: string[];
}

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
    label: "Car Insurance",
    value: "Car Insurance"
  },
  {
    label: "Road Tax",
    value: "Road Tax"
  },
  {
    label: "Other",
    value: "Other"
  },
]

export const NewTransaction = () => {
  const [categories, setCategories] = useState<ICategoryData | undefined>(undefined)
  const [transactionData, setTransactionData] = useState<ITransactonType>({name: "", date: new Date, description: "", category: "", newCategory: false, newCategoryValue: "", amount: ""})
  const [amountError, setAmountError] = useState<boolean>(false)
  const {amount,category,date, description,name, newCategory, newCategoryValue } = transactionData 
  const navigation = useNavigation();
  const route = useRoute()
  const client = generateClient();
  const type = route.params.type;
  const mode = route.params.mode;
  const id = route.params.id;

  const checkCategory = type === "Earning" ? earningTypes : expenseTypes;
  const currentCategories = categories !== undefined ? categories.categories.map((eachCategory) => ({ label: eachCategory, value: eachCategory})) : checkCategory;


  const handleBack = () => {
    navigation.navigate("Transactions")
  }

  const handleChange = (value: string, key: string ) => {
      if(key === "amount")
       {
          const checkAmount = value.match(/^[0-9]+$/)
          setAmountError(!checkAmount)
       }
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

  const handleAddNewCategory = () => {
    setTransactionData({...transactionData, newCategory: !transactionData.newCategory})
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

  const handleAdd = async () => {
    try
     {
        const currentUser = await getCurrentUser();
        const currentCategoryLabels = currentCategories.map((eachCategory) => eachCategory.label)
        if(categories !== undefined)
         {
          await client.graphql({
            query: updateCategories,
            variables: { input: {id: categories.id , categories: [...currentCategoryLabels, newCategoryValue]}}
          })
          
         }
        else
         {
          await client.graphql({
            query: createCategories,
            variables: { input: {userID: currentUser.userId, type: type, categories: [...currentCategoryLabels, newCategoryValue]}}
          })
         }
        setTransactionData({...transactionData, newCategory: false})
        handleFetchCategories()
     }
    catch(err)
     {
        console.log("err", err)
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
      setTransactionData({ amount, category, date, description, name, newCategory: false, newCategoryValue: "" })
     }
    catch(err)
     {
      console.log("err", err)
     }
  }

  const handleFetchCategories = async () => {
    try
     {
       const currentUser = await getCurrentUser();
       const response = await client.graphql({
             query: categoriesByUserID,
             variables: { userID: currentUser.userId, filter: {type: {eq: type}}}
           })
        if(response.data.categoriesByUserID.items.length > 0)
         {
          setCategories({id: response.data.categoriesByUserID.items[0].id, categories: response.data.categoriesByUserID.items[0].categories})
         }
     }
     catch(err)
      {
        console.log("err", err)
      }
  }

  useEffect(() => {
    if(id)
     {
      handleFetchTransaction();
     }
  },[id])

  useEffect(() => {
    handleFetchCategories();
  },[])

  const disableSave = name === "" || description === "" || amount === "" || amountError === true || category === ""

  
  return (
    <SafeAreaView style={flexChild}>
      <ScrollView>
        <CustomSpacer space={hp(2)} />
        <View style={{...flexChild, marginHorizontal: wp(6)}}>
          <Pressable onPress={handleBack} style={{...flexRow, ...centerVertical}}>
            <Icon type={Icons.Ionicons} name="arrow-back" color={colorBlack._1}/>
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
          {amountError === true ? (
            <Text style={{...fs12BoldBlack2, color: colorRed._1, marginLeft: wp(1), marginTop: hp(1)}}>Please enter a proper amount</Text>
            ): null}
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
            items={currentCategories}
            label='Category'
            value={category}
            viewStyle={{width: wp(70)}}
          />
          <CustomSpacer space={hp(4)} />
          <View style={{...flexRow, ...centerVertical }}>
            <Switch 
              label="Add New Category"
              toggle={newCategory}
              onPress={handleAddNewCategory} 
              thumbStyleProp={{...circle(wp(4), colorWhite._1)}}
              style={{width: wp(10), height: hp(3), borderRadius: wp(3)}}
            />
          </View>
          <CustomSpacer space={hp(4)} />
          {newCategory === true ? (
            <>
              <View style={{...flexRow, ...alignItemsEnd}}>
                <CustomTextInput id="name" label='New Category' value={newCategoryValue} onChangeText={(value) => handleChange(value, "newCategoryValue")} viewStyle={{width: wp(50)}}/>
                <CustomSpacer isHorizontal={true} space={wp(20)} />
                <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleAdd} text={'Add'} />
              </View>  
              <CustomSpacer space={hp(6)} />
            </>
          ): null}
          <View style={flexRowCC}>
            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleBack} text={'Cancel'} />
            <CustomSpacer isHorizontal={true} space={hp(4)} />
            <RoundedButton disabled={disableSave} buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleSave} text={'Save'} />
          </View>
        </View>
        <CustomSpacer space={hp(12)} />
      </ScrollView>
    </SafeAreaView>
  )
}