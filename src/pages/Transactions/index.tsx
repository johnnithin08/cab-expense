import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, ViewStyle, ImageStyle, Image, Pressable } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { absolutePosition, border, colorBlack, colorWhite, flexChild, flexRow, fs12RegBlack2, fs14BoldBlack2, fs14RegBlack2, fs16BoldBlack2, fs18BoldBlack2, justifyContentEnd, px, py, spaceBetweenHorizontal, sw1 } from '../../styles'
import { CustomFlexSpacer, CustomSpacer, Icon, Icons, TabGroup, TabProps } from '../../components';
import { LabeledTitle } from '../../components/Views/LabeledTitle';
import { transactionsByUserID } from '../../graphql/queries';
import { onCreateTransactions, onUpdateTransactions } from '../../graphql/subscriptions';

interface ITrasnactions {
    amount: string;
    category: string;
    createdAt: Date;
    description: string;
    id: string;
    name: string;
    type: string;
}

export const Transactions = () => {
    const [transactions, setTransactions] = useState<ITrasnactions[]>([])
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState<number>(0)
    const client = generateClient();
    const isFocused = useIsFocused()

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

    const fetchTransactions = async () => {
        try 
         {
            const currentUser = await getCurrentUser();
            const response = await client.graphql({
                query: transactionsByUserID,
                variables: { userID: currentUser.userId, filter: { type: { eq: activeTab === 0 ? "Expense" : "Earning"} }}
              });
            setTransactions(response.data.transactionsByUserID.items)
            console.log("resps", response)
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
    },[activeTab, isFocused])

    const data = [
        {
        amount: "15",
        category: "Petrol",
        date: "24/03/2021",
        name: "Fuel for car"
        },
        {
        amount: "15",
        category: "Petrol",
        date: "24/03/2021",
        name: "Fuel for car"
        },
        {
        amount: "15",
        category: "Petrol",
        date: "24/03/2021",
        name: "Fuel for car"
        },
    ]

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
  return (
    <SafeAreaView style={flexChild}>
        <View style={flexChild}>
            <CustomSpacer space={hp(2)} />
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
                            </>
                        )
                    }}
                />
            </View>
            <Pressable onPress={handleAdd} style={addButtonStyle}>
                <Icon type={Icons.Ionicons} name="add" size={hp(4)} />
            </Pressable>
        </View>
    </SafeAreaView>
  )
}