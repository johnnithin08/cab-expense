import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, ViewStyle, ImageStyle, Image, Pressable } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { absolutePosition, border, centerHV, colorBlack, colorBlue, colorGray, colorTransparent, colorWhite, flexChild, flexRow, fs12BoldGray6, fs12RegBlack2, fs14BoldBlack2, fs14RegBlack2, fs16BoldBlack2, fs18BoldBlack2, fullWidth, justifyContentEnd, px, py, spaceBetweenHorizontal, sw1 } from '../../styles'
import { CustomFlexSpacer, CustomSpacer, Icon, Icons, NewDatePicker, SingleSelectPills, TabGroup, TabProps } from '../../components';
import { LabeledTitle } from '../../components/Views/LabeledTitle';
import { transactionsByUserID } from '../../graphql/queries';
import { onCreateTransactions, onUpdateTransactions } from '../../graphql/subscriptions';
import { AnimationUtils } from '../../utils';
import { RoundedButton } from '../../components/Touchables';

type TCustomDate = {
    from?: Date;
    to?: Date;
}



export const Transactions = () => {
    const [dateFilter, setDateFilter] = useState<TDateFilter>("Daily")
    const [customDate, setCustomDate] = useState<TCustomDate>({from: new Date, to: new Date})
    const [transactions, setTransactions] = useState<ITransactions[]>([])
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState<number>(0)
    const client = generateClient();
    const isFocused = useIsFocused();

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
        try 
         {
            const currentUser = await getCurrentUser();
            const checkTimeFilter = custom === true || dateFilter === "Custom" ? [dayjs(customDate.from).toISOString(), dayjs(customDate.to).toISOString()] : timeSlots[dateFilter] 
            const response = await client.graphql({
                query: transactionsByUserID,
                variables: { userID: currentUser.userId, filter: { date: { between: checkTimeFilter} }}
              });
            const expenseTransactions = response.data.transactionsByUserID.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Expense");
            const earningTransactions = response.data.transactionsByUserID.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Earning");
            const currentTransactions = activeTab === 0 ? expenseTransactions : earningTransactions
            setTransactions(currentTransactions)
         }
        catch(err)
         {
            console.log("err", err)
         }
    }

    useEffect(() => {
        fetchTransactions();
        const subscribeTransactions2 = client
        .graphql({ query:  onCreateTransactions})
        .subscribe({
          next: ({ data }) => setTransactions([data.onCreateTransactions, ...transactions]),
          error: (error) => console.warn(error)
        });
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
                <FlatList 
                    data={transactions}
                    renderItem={({item, index}) => {

                        const handleEdit = () => {
                            navigation.navigate("NewTransaction", { type: activeTab === 0 ? "Expense" : "Earning", mode: "edit", id: item.id})
                        }
                        return (
                            <>
                            {index !== 0 ? <CustomSpacer space={hp(2)} /> : null}
                            <Pressable onPress={handleEdit} style={itemContainer}>
                                <Image source={{uri: "https://img.freepik.com/free-vector/handle-pump-nozzle-with-gold-drop-expensive-fuel-gas-realistic-object-isolated-vector-illustration_1284-81457.jpg?w=1380&t=st=1701123749~exp=1701124349~hmac=a1f023bf723efb19c3b27597596eb6e24d36c97d242bae5a3192098e5df3eaca"}} style={imageStyle}/>
                                <CustomSpacer isHorizontal={true} space={wp(2)} />
                                <LabeledTitle label={item.name} labelStyle={fs18BoldBlack2} title={item.category} titleStyle={fs14RegBlack2}/>
                                <CustomFlexSpacer />
                                <View style={endContainer}>
                                    <Text style={fs18BoldBlack2}>£{item.amount}</Text>
                                    <Text style={fs14RegBlack2}>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Text>
                                </View>    
                            </Pressable>  
                            {index === transactions.length - 1 ? <CustomSpacer space={hp(30)} /> : null}  
                            </>
                        )
                    }}
                />
            </View>
            <CustomSpacer space={hp(4)} />
            
            <Pressable onPress={handleAdd} style={addButtonStyle}>
                <Icon type={Icons.Ionicons} name="add" size={hp(4)} />
            </Pressable>
        </View>
    </SafeAreaView>
  )
}