import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ViewStyle, ImageStyle, Image, Pressable, ActivityIndicator, PermissionsAndroid, Platform, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { absolutePosition, border, centerHV, colorBlack, colorBlue, colorGray, colorTransparent, colorWhite, flexChild, flexRow, fs12BoldGray6, fs12RegBlack2, fs14BoldBlack2, fs14RegBlack2, fs16BoldBlack2, fs18BoldBlack2, fs20BoldBlack2, fullWidth, justifyContentEnd, px, py, spaceBetweenHorizontal, sw1 } from '../../styles'
import { CustomFlexSpacer, CustomSpacer, Icon, Icons, NewDatePicker, SingleSelectPills, TabGroup, TabProps } from '../../components';
import { LabeledTitle } from '../../components/Views/LabeledTitle';
import { transactionsByUserIDAndDate } from '../../graphql/queries';
import { onCreateTransactions, onUpdateTransactions } from '../../graphql/subscriptions';
import { AnimationUtils, parseAmount } from '../../utils';
import { RoundedButton } from '../../components/Touchables';
import { LocalAssets } from '../../assets/images/LocalAssets';
import Entypo from 'react-native-vector-icons/Entypo';

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
    const {bottom} = useSafeAreaInsets()

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
        "This week": [dayjs().startOf("week").add(1, "day").toISOString(), dayjs().endOf("week").toISOString()],
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
    const netIncome = transactions.length > 0 ? total.totalIncome - total.totalExpense : 0;
  
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

    const exportExcel = async () => {
        const otherTab = activeTab === 0 ? "Earning" : "Expense";
        const currentUser = await getCurrentUser();
            const checkTimeFilter = dateFilter === "Custom" ? [dayjs(customDate.from).startOf("day").toISOString(), dayjs(customDate.to).endOf("day").toISOString()] : timeSlots[dateFilter] 
        const response = await client.graphql({
            query: transactionsByUserIDAndDate,
            variables: { userID: currentUser.userId, date: { between: checkTimeFilter}, filter: {type: {eq: otherTab}}, sortDirection: "DESC"}
          });
        const titles = ["Date", "Description", "Category", "Amount"];
        const currentTabArray = transactions.map((eachEarning) => {
            const {date, description, category, amount} = eachEarning
            return [dayjs(date).format('DD/MM/YYYY'), description, category, `£${amount}`]
        })

        const incomeSheetArray = activeTab === 0 ? response.data.transactionsByUserIDAndDate.items.map((eachExpense) => {
            const {date, description, category, amount} = eachExpense
            return [dayjs(date).format('DD/MM/YYYY'), description, category, `£${amount}`]
        }) : currentTabArray;
        const expenseSheetArray = activeTab === 1 ? response.data.transactionsByUserIDAndDate.items.map((eachEarning) => {
            const {date, description, category, amount} = eachEarning
            return [dayjs(date).format('DD/MM/YYYY'), description, category, amount]
        }) : currentTabArray;

        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.aoa_to_sheet([
            titles,
            ...incomeSheetArray,
            ["", "", "", ""],
            ["Total Expenses:", `£${parseFloat(total.totalExpense).toFixed(2)}`],
            ["Total Earning:", `£${parseFloat(total.totalIncome).toFixed(2)}` ],
            ["Net Income:", `£${parseFloat(netIncome).toFixed(2)}` ],
        ])
        const ws2 = XLSX.utils.aoa_to_sheet([
            titles,
            ...expenseSheetArray,
        ])

        XLSX.utils.book_append_sheet(wb,ws1, "Income")
        XLSX.utils.book_append_sheet(wb,ws2, "Expense")
        const excelBase64 = XLSX.write(wb, {type:"base64"});
        const path = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
        // // Write generated excel to Storage
        RNFS.writeFile(path + `/Taxi-Budget${dayjs().format("DD-MM-YYYY hh mm ss")}.xlsx`, excelBase64, 'base64').then((r)=>{
            Alert.alert("File successfully downloaded")
        }).catch((e)=>{
            Alert.alert('Download Failed');
        });
    }

    const handleExport = async () => {
        if(Platform.OS === "android")
         {

             try{
                if (Number(Platform.Version) >= 33) {
                     return exportExcel();
                  }
                
                  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
                
                  const hasPermission = await PermissionsAndroid.check(permission);
                  if (hasPermission) {
                    return exportExcel();
                  }
                
                  const status = await PermissionsAndroid.request(permission);
                  if(status === "granted")
                   {
                    exportExcel();
                   }
                 // Check for Permission (check if permission is already given or not)
                 else {
                     // Permission denied
                     console.log("Permission denied");
                   }
               }catch(e){
                 console.log(e);
                 return
               }
         }
        else
         {
            exportExcel();
         }
    }

    

    const fetchTransactions = async (custom?: boolean) => {
        setLoading(true)
        try 
         {
            const currentUser = await getCurrentUser();
            const checkTimeFilter = custom === true || dateFilter === "Custom" ? [dayjs(customDate.from).startOf("day").toISOString(), dayjs(customDate.to).endOf("day").toISOString()] : timeSlots[dateFilter] 
            const response = await client.graphql({
                query: transactionsByUserIDAndDate,
                variables: { userID: currentUser.userId, date: { between: checkTimeFilter}, sortDirection: "DESC", limit: 100000}
              });
            const expenseTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Expense");
            const earningTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Earning");
            const totalEarnings = earningTransactions.length > 0 ? earningTransactions.filter((eachEarning: ITransactions) => eachEarning.type === "Earning").map((typedTransaction: ITransactions) => parseAmount(typedTransaction.amount)).reduce((total, current) => total + current) : 0;
            const totalExpenses = expenseTransactions.length > 0 ? expenseTransactions.filter((eachEarning: ITransactions) => eachEarning.type === "Expense").map((typedTransaction: ITransactions) => parseAmount(typedTransaction.amount)).reduce((total, current) => total + current) : 0
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

    const exportContainer: ViewStyle = {
        ...absolutePosition,
        zIndex: 5,
        right: wp(5),
        ...border(colorGray._1, 1, wp(10)),
        backgroundColor: colorGray._3,
        padding: wp(2)
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
                {loading === true ? (
                    <View style={{...centerHV, height: hp(61)}}>
                        <ActivityIndicator size='large' />
                    </View>    
                ) : (
                <>
                    <View style={exportContainer}>
                        <Pressable onPress={handleExport}>
                            <Entypo color={colorBlack._1} name="export" size={hp(4)} />
                        </Pressable>
                    </View>
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
                                        <Text style={fs18BoldBlack2}>{item.description}</Text>
                                        <CustomSpacer space={wp(2)} />
                                        <Text style={fs14RegBlack2}>{item.category}</Text>
                                    </View>
                                    <CustomFlexSpacer />
                                    <View style={endContainer}>
                                        <Text style={fs18BoldBlack2}>£{item.amount}</Text>
                                        <Text style={fs14RegBlack2}>{dayjs(item.date).format('hh:mm DD/MM/YYYY')}</Text>
                                    </View>    
                                </Pressable>  
                                {index === transactions.length - 1 ? <CustomSpacer space={hp(10)} /> : null}  
                                </>
                            )
                        }}
                        style={{height: bottom === 0 ? hp(61) : hp(58)}}
                    />
                </>
                )}
            </View>
            <View style={centerHV}>
                <Text style={fs20BoldBlack2}>Total Earnings: £{parseFloat(total.totalIncome).toFixed(2)}</Text>
                <Text style={fs20BoldBlack2}>Total Expenses: £{parseFloat(total.totalExpense).toFixed(2)}</Text>
                <Text style={fs20BoldBlack2}>Net: £{parseFloat(netIncome).toFixed(2)}</Text>
            </View>
            <CustomSpacer space={hp(4)} />
            <Pressable onPress={handleAdd} style={addButtonStyle}>
                <Icon color={colorBlack._1} type={Icons.MaterialIcons} name="add" size={hp(4)} />
            </Pressable>
        </View>
    </SafeAreaView>
  )
}