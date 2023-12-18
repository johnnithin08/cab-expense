import React, { useEffect, useState } from 'react'
import { View, Text, ViewStyle } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context'
import { PieChart } from "react-native-gifted-charts";
import {fetchUserAttributes, getCurrentUser} from "aws-amplify/auth"
import { ScrollView } from 'react-native-gesture-handler';
import dayjs from 'dayjs';

import { centerHV, centerHorizontal, centerVertical, colorBlue, colorGray, colorWhite, flexChild, flexRow, flexRowCC, flexWrap, fs14BoldBlack2, fs16BoldBlack2, fs18BoldBlack2, fs20BoldBlack2, fs24BoldBlack2, px, spaceBetweenHorizontal, spaceBetweenVertical } from '../../styles'
import { CustomSpacer, SingleSelectPills, TabGroup, TabProps } from '../../components'
import { generateClient } from 'aws-amplify/api';
import { transactionsByUserID, transactionsByUserIDAndDate } from '../../graphql/queries';
import { useIsFocused } from '@react-navigation/native';

interface IGroupedTransactions {
  name: string;
  value: number;
}

const colorArray = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF965A',
  '#2E7D32',
  '#8D6E63',
  '#FFD54F',
  '#AB47BC',
]


const renderDot = colorIndex => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: colorArray[colorIndex],
        marginRight: 10,
      }}
    />
  );
};



export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [dateFilter, setDateFilter] = useState<TDateFilter>("This month")
  const [transactions, setTransactions] = useState<ITransactions[]>([])
  const [groupedTransactions, setGroupedTransactions] = useState<IGroupedTransactions[]>([])
  const [selectedGroup, setSelectedGroup] = useState<IGroupedTransactions>(groupedTransactions[0] || { name: "", value: 0})
  const client = generateClient();
  const isFocused = useIsFocused()

  const timeSlots = {
    "This month": [dayjs().startOf("month").toISOString(),dayjs().endOf("month").toISOString()],
    "Last 6 months": [dayjs().subtract(6, "months").toISOString(), dayjs().toISOString()],
    "This Year": [dayjs().startOf("year").toISOString(), dayjs().toISOString()],
  }
  
  const handleDateFilter = (value: string) => {
    setDateFilter(value as TDateFilter)
  }

  const handleSelectSection = (_item, index: number) => {
    setSelectedGroup(groupedTransactions[index])
  }

  const handleTabs = (index: number) => {
    setActiveTab(index)
  }

  const groupByCategory = (transactions: ITransactions[]) => {
    const result: Record<string, number> = {};
  
    if(transactions.length > 0)
     {
       transactions.forEach((transaction) => {
         const { category, amount } = transaction;
         result[category] = (result[category] || 0) + parseFloat(amount);
       });
   
       const total = Object.values(result).reduce((acc, current) => acc + current)
       const groupByArray = Object.entries(result).map(([key, value]) => {
         return {
           name: key,
           value: (value / total) * 100
         }
       })
       setGroupedTransactions(groupByArray)
       setSelectedGroup(groupByArray[0])
     }
  }

  const fetchTransactionsByDate = async () => {
    try 
     {
        const currentUser = await getCurrentUser();
        const response = await client.graphql({
            query: transactionsByUserIDAndDate,
            variables: { userID: currentUser.userId, date: { between: timeSlots[dateFilter]}}
          });
        console.log("resp", response)
        const expenseTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Expense");
        const earningTransactions = response.data.transactionsByUserIDAndDate.items.filter((eachTransaction: ITransactions) => eachTransaction.type === "Earning");
        const transactionsToBeGrouped = activeTab === 0 ? expenseTransactions : earningTransactions
        setTransactions(response.data.transactionsByUserIDAndDate.items)
        groupByCategory(transactionsToBeGrouped)
     }
    catch(err)
     {
        console.log("err", err)
     }
  }

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            ...flexRow,
            ...flexWrap,
            ...centerVertical,
            ...spaceBetweenHorizontal,
          }}>
          {groupedTransactions.map((eachColor, eachIndex) => {
              return (
                <View
                    key={eachIndex}
                    style={{
                      ...flexRow,
                      ...centerVertical,
                      marginTop: hp(1),
                      width: wp(30),
                    }}>
                {renderDot(eachIndex)}
                <Text style={fs16BoldBlack2}>{eachColor.name}</Text>
              </View>
              )
          })}
        </View>
      </>
    );
  };


  const pieData = groupedTransactions.map((eachGroup,groupIndex ) => {
    return {
      focused: eachGroup.name === selectedGroup.name,
      value: eachGroup.value,
      color: colorArray[groupIndex],
    }
  })
  const tabs: TabProps[] = [{
    selected: activeTab === 0,
    text: "Expenses",
    style: {...flexChild, height: hp(5)},
    textStyle: fs14BoldBlack2,
    
  },
  {
    selected: activeTab === 1,
    text: "Earnings",
    style: {...flexChild, height: hp(5)},
    textStyle: fs14BoldBlack2,
    
  }]
  
  const dataFilterArray: IPillsWithSubLabel[] = [{ label: "This month" }, { label: "Last 6 months" }, { label: "This Year" }]
  
  useEffect(() => 
  {
    setSelectedGroup({name: "", value: 0});
    fetchTransactionsByDate();

  },[activeTab, dateFilter])

  useEffect(() => {
    fetchTransactionsByDate();
  },[isFocused])

  const tabGroupContainer: ViewStyle = {
    ...flexRowCC,
    backgroundColor: colorGray._3,
    borderRadius: wp(5),
  }

  const totalEarnings = transactions.length > 0 ? transactions.filter((eachEarning: ITransactions) => eachEarning.type === "Earning").map((typedTransaction: ITransactions) => parseInt(typedTransaction.amount,10)).reduce((total, current) => total + current) : 0
  const totalExpenses = transactions.length > 0 ? transactions.filter((eachEarning: ITransactions) => eachEarning.type === "Expense").map((typedTransaction: ITransactions) => parseInt(typedTransaction.amount,10)).reduce((total, current) => total + current) : 0
  const netIncome = transactions.length > 0 ? totalEarnings - totalExpenses : 0;


return (
  <ScrollView
    style={{...flexChild, backgroundColor: colorGray._1}}>
    <View
      style={{
        margin: wp(15),
        marginBottom: 0,
        marginTop: hp(6)
      }}>
      <View style={centerHV}>
        <Text style={{...fs24BoldBlack2, ...centerHV}}>
          Dashboard
        </Text>
        <CustomSpacer space={hp(4)} />
        <View style={tabGroupContainer}>
          <TabGroup activeTab={activeTab} setActiveTab={handleTabs} tabs={tabs} selectedViewStyle={{borderBottomWidth: 0, backgroundColor: colorBlue._1, borderRadius: wp(5)}} selectedTextStyle={{color: colorWhite._1}} />
        </View>
      </View>
      <View style={{padding: 20, alignItems: 'center'}}>
        <PieChart
          data={pieData}
          onPress={handleSelectSection}
          donut
          sectionAutoFocus
          focusOnPress={true}
          toggleFocusOnPress={false}
          radius={wp(25)}
          innerRadius={wp(15)}
          centerLabelComponent={() => {
            return (
              <View style={centerHV}>
                <Text style={fs20BoldBlack2}>
                  {`${selectedGroup.value.toFixed(1)}%`}
                </Text>
                <Text style={fs20BoldBlack2}>{selectedGroup.name}</Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
    <CustomSpacer space={hp(4)} />
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
    <CustomSpacer space={hp(5)} />
    <View style={centerHV}>
          <Text style={fs20BoldBlack2}>Total Earnings: £{totalEarnings}</Text>
          <Text style={fs20BoldBlack2}>Total Expenses: £{totalExpenses}</Text>
          <Text style={fs20BoldBlack2}>Net: £{netIncome}</Text>
    </View>
    <CustomSpacer space={hp(20)} />
  </ScrollView>
  )
}