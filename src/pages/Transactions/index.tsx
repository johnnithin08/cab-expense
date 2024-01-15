import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, ViewStyle, ImageStyle, Image, Pressable, ActivityIndicator } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { absolutePosition, border, centerHV, colorBlack, colorBlue, colorGray, colorTransparent, colorWhite, flexChild, flexRow, fs12BoldGray6, fs12RegBlack2, fs14BoldBlack2, fs14RegBlack2, fs16BoldBlack2, fs18BoldBlack2, fs20BoldBlack2, fullWidth, justifyContentEnd, px, py, spaceBetweenHorizontal, sw1 } from '../../styles'
import { CustomFlexSpacer, CustomSpacer, Icon, Icons, NewDatePicker, SingleSelectPills, TabGroup, TabProps } from '../../components';
import { LabeledTitle } from '../../components/Views/LabeledTitle';
import { transactionsByUserIDAndDate } from '../../graphql/queries';
import { onCreateTransactions, onUpdateTransactions } from '../../graphql/subscriptions';
import { AnimationUtils } from '../../utils';
import { RoundedButton } from '../../components/Touchables';
import { LocalAssets } from '../../assets/images/LocalAssets';

interface ICustomDate  {
    from?: Date;
    to?: Date;
}

interface ITotal {
    totalIncome: number;
    totalExpense: number;
}



export const Transactions = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [dateFilter, setDateFilter] = useState<TDateFilter>("Daily")
    const [customDate, setCustomDate] = useState<ICustomDate>({from: new Date, to: new Date})
    const [transactions, setTransactions] = useState<ITransactions[]>([])
    const [total, setTotal] = useState<ITotal>({totalExpense: 0, totalIncome: 0})
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState<number>(0)
    const client = generateClient();
    const isFocused = useIsFocused();

    const transactionTypeImages: TTransactionTypesObject = {
        "Car Insurance" : LocalAssets.carInsurance,
        "Fuel": LocalAssets.gas,
        "Full Service" : LocalAssets.service,
        "Other" : LocalAssets.general,
        "RJ Card" : LocalAssets.card,
        "RJ Cash" : LocalAssets.money,
        "Road Tax" : LocalAssets.roadTax,
        "Tips" : LocalAssets.tips,
    }

    const timeSlots = {
        "Daily": [dayjs().startOf("day").toISOString(),dayjs().endOf("day").toISOString()],
        "This week": [dayjs().startOf("week").toISOString(), dayjs().endOf("week").toISOString()],
      }

    const tabs: TabProps[] = [{
      selected: activeTab === 0,
      text: "Expenses",
      style: flexChild,
      textStyle: fs18BoldBlack2,
      
    },
    {
      selected: activeTab === 1,
      text: "Earnings",
      style: flexChild,
      textStyle: fs18BoldBlack2,
      
    }]
  
    const handleTabs = (index: number) => {
      setActiveTab(index)
    }

    const handleAdd = () => {
        navigation.navigate("NewTransaction", { type: activeTab === 0 ? "Expense" : "Earning", mode: "new"})
    }

    const handleDateFilter = (value: string) => {
        setDateFilter(value as TDateFilter)
        if(value === "Custom")
         {
            setShowFilter(true)
         }
        else
        {
            setCustomDate({from: new Date, to: new Date})
            setShowFilter(false)
        }
        AnimationUtils.layout({duration: 500})
    }

    const handleDateChangeFrom = (date: Date) => {
        setCustomDate({...customDate, from: date})
    }

    const handleDateChangeTo = (date: Date) => {
        setCustomDate({...customDate, to: date})
    }

    const handleFilter = () => {
        fetchTransactions(true);
        setShowFilter(false)
        AnimationUtils.layout({duration: 500})

    }

    const fetchTransactions = async (custom?: boolean) => {
        setLoading(true)
        try 
         {
            const currentUser = await getCurrentUser();
            const checkTimeFilter = custom === true || dateFilter === "Custom" ? [dayjs(customDate.from).startOf("day").toISOString(), dayjs(customDate.to).endOf("day").toISOString()] : timeSlots[dateFilter] 
            const response = await client.graphql({
                query: transactionsByUserIDAndDate,
                variables: { userID: currentUser.userId, date: { between: checkTimeFilter}, sortDirection: "DESC"}
              });
            const expenseTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Expense");
            const earningTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Earning");
            const totalEarnings = earningTransactions.length > 0 ? earningTransactions.filter((eachEarning: ITransactions) => eachEarning.type === "Earning").map((typedTransaction: ITransactions) => parseInt(typedTransaction.amount,10)).reduce((total, current) => total + current) : 0
            const totalExpenses = expenseTransactions.length > 0 ? expenseTransactions.filter((eachEarning: ITransactions) => eachEarning.type === "Expense").map((typedTransaction: ITransactions) => parseInt(typedTransaction.amount,10)).reduce((total, current) => total + current) : 0
            const currentTransactions = activeTab === 0 ? expenseTransactions : earningTransactions
            setTransactions(currentTransactions)
            setTotal({ totalExpense: totalExpenses, totalIncome: totalEarnings})
            setLoading(false)
         }
        catch(err)
         {
            setLoading(false)
            console.log("err", err)
         }
    }

    useEffect(() => {
        fetchTransactions();
    },[activeTab, dateFilter, isFocused])

    const dataFilterArray: IPillsWithSubLabel[] = [{ label: "Daily" }, { label: "This week" }, { label: "Custom" }]

    const itemContainer: ViewStyle = {
        ...flexRow,
        ...px(wp(4)),
        ...py(hp(4)),
        backgroundColor: colorWhite._1,
        borderRadius: wp(4),
    }
    const imageStyle: ImageStyle = {
        height: hp(6),
        width: wp(15),
        resizeMode: "contain",
    }
    const endContainer: ViewStyle = {
        ...spaceBetweenHorizontal,
    }
    const addButtonStyle: ViewStyle = {
        ...absolutePosition,
        ...border(colorBlack._2, sw1, wp(10)),
        backgroundColor: colorWhite._1,
        bottom: hp(12),
        right: wp(8),
        ...px(wp(2)),
        ...py(wp(2)),
    }
    const filterContainer: ViewStyle = {
        ...flexChild, 
        backgroundColor: showFilter === true ? colorWhite._1 : colorTransparent, 
        borderRadius: wp(2),  
        paddingVertical: showFilter === true ? hp(2) : 0
    }

    const netIncome = transactions.length > 0 ? total.totalIncome - total.totalExpense : 0;
  return (
    <SafeAreaView style={flexChild}>
        <View style={flexChild}>
            <CustomSpacer space={hp(4)} />
            <View style={{...px(wp(4)), ...absolutePosition, ...fullWidth, top: hp(2), zIndex: 10}}>
                <View style={filterContainer}>
                    <View style={centerHV}>
                        <SingleSelectPills
                            direction="row"
                            labels={dataFilterArray}
                            labelStyle={px(wp(4))}
                            space={wp(2)}
                            onSelect={handleDateFilter}
                            value={dateFilter}
                        />
                    </View>
                    {showFilter === true ? (
                        <View style={{...px(wp(2))}}>
                            <CustomSpacer space={hp(4)} />
                            <Text style={fs12BoldGray6}>Date From</Text>
                            <CustomSpacer space={hp(1)} />
                            <NewDatePicker 
                                datePickerStyle={{width: wp(70)}}
                                viewStyle={{width: wp(70)}}
                                mode={"date"} 
                                value={customDate.from}
                                setValue={handleDateChangeFrom}            
                            /> 
                            <CustomSpacer space={hp(4)} />
                            <Text style={fs12BoldGray6}>Date To</Text>
                            <CustomSpacer space={hp(1)} />
                            <NewDatePicker 
                                datePickerStyle={{width: wp(70)}}
                                viewStyle={{width: wp(70)}}
                                mode={"date"} 
                                value={customDate.to}
                                setValue={handleDateChangeTo}            
                            /> 
                            <CustomSpacer space={hp(4)} />
                            <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} onPress={handleFilter} text={'Filter'} />
                        </View>
                    ): null}
                </View>
            </View>
            <CustomSpacer space={hp(4)} />
            <TabGroup activeTab={activeTab} setActiveTab={handleTabs} tabs={tabs} />
            <CustomSpacer space={hp(2)} />
            <View style={{...px(wp(4))}}>
                {loading === true ? (
                    <View style={{...centerHV, height: hp(61)}}>
                        <ActivityIndicator size='large' />
                    </View>    
                ) : (

                <FlatList 
                    data={transactions}
                    renderItem={({item, index}) => {

                        const handleEdit = () => {
                            navigation.navigate("NewTransaction", { type: activeTab === 0 ? "Expense" : "Earning", mode: "edit", id: item.id})
                        }

                        const defaultImage = activeTab === 0 ? LocalAssets.general : LocalAssets.money;
                        const checkImage = transactionTypeImages[item.category] !== undefined ? transactionTypeImages[item.category] : defaultImage
                        return (
                            <>
                            {index !== 0 ? <CustomSpacer space={hp(2)} /> : null}
                            <Pressable onPress={handleEdit} style={itemContainer}>
                                <Image source={checkImage} style={imageStyle}/>
                                <CustomSpacer isHorizontal={true} space={wp(2)} />
                                <View>
                                    <LabeledTitle label={item.name} labelStyle={fs18BoldBlack2} title={item.category} titleStyle={fs14RegBlack2}/>
                                    <CustomSpacer space={wp(2)} />
                                    <Text style={fs14RegBlack2}>{item.description}</Text>
                                </View>
                                <CustomFlexSpacer />
                                <View style={endContainer}>
                                    <Text style={fs18BoldBlack2}>£{item.amount}</Text>
                                    <Text style={fs14RegBlack2}>{dayjs(item.createdAt).format('hh:mm DD/MM/YYYY')}</Text>
                                </View>    
                            </Pressable>  
                            {index === transactions.length - 1 ? <CustomSpacer space={hp(10)} /> : null}  
                            </>
                        )
                    }}
                    style={{height: hp(61)}}
                />
                )}
            </View>
            <View style={centerHV}>
                <Text style={fs20BoldBlack2}>Total Earnings: £{total.totalIncome}</Text>
                <Text style={fs20BoldBlack2}>Total Expenses: £{total.totalExpense}</Text>
                <Text style={fs20BoldBlack2}>Net: £{netIncome}</Text>
            </View>
            <CustomSpacer space={hp(4)} />
            <Pressable onPress={handleAdd} style={addButtonStyle}>
                <Icon color={colorBlack._1} type={Icons.MaterialIcons} name="add" size={hp(4)} />
            </Pressable>
        </View>
    </SafeAreaView>
  )
}