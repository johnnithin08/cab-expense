import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

import { flexChild, colorGray, centerHV, fs24BoldBlack2, fs14BoldBlack2, fs16BoldBlack2, fs20BoldBlack2, colorBlue, flexRow, spaceBetweenHorizontal } from '../../styles'
import { CustomFlexSpacer, CustomSpacer } from '../../components';
import { RoundedButton } from '../../components/Touchables';
import { getUser } from '../../graphql/queries';

interface IUserDetails {
  name: string;
  email: string;
  phoneNo: string;
}

export const Profile = () => {
  const [userDetails, setUserDetails] = useState<IUserDetails>({ name: "", email: "", phoneNo: ""})
  const client = generateClient();

  const handleLogout = () => {
    signOut();
  }

  const fetchUserDetails = async () => {
    try
     {
        const currentUser = await getCurrentUser();
        const response = await client.graphql({
          query: getUser,
          variables: { id: currentUser.userId}
        })
        setUserDetails(response.data.getUser)
     }
    catch(err)
     {
      console.log('err', err)
     }
  }

  useEffect(() => {
    fetchUserDetails();
  },[])
  return (
    <View
    style={{...flexChild, backgroundColor: colorGray._1}}>
    <View
      style={{
        margin: wp(15),
        marginBottom: 0,
      }}>
      <View style={centerHV}>
        <Text style={{...fs24BoldBlack2, ...centerHV}}>
          Profile
        </Text>
      </View>
      <CustomSpacer space={hp(4)} />
      <View style={{...flexRow,...spaceBetweenHorizontal}}>
        <Text style={fs20BoldBlack2}>Name:</Text>
        <Text style={fs20BoldBlack2}>{userDetails.name}</Text>
      </View>
      <CustomSpacer space={hp(2)} />
      <View style={{...flexRow,...spaceBetweenHorizontal}}>
        <Text style={fs20BoldBlack2}>Email:</Text>
        <Text style={fs20BoldBlack2}>{userDetails.email}</Text>
      </View>
      {userDetails.phoneNo !== null ? (
        <>
      <CustomSpacer space={hp(2)} />
      <View style={{...flexRow,...spaceBetweenHorizontal}}>
        <Text style={fs20BoldBlack2}>Phone No:</Text>
        <Text style={fs20BoldBlack2}>{userDetails.phoneNo}</Text>
      </View>
        </>  
      ): null}
      <CustomSpacer space={hp(20)} />
      <View style={centerHV}>
      <RoundedButton buttonStyle={{backgroundColor: colorBlue._1, borderColor: colorBlue._1}} text="Logout" onPress={handleLogout} />
      </View>
    </View>
    </View>
  )
}