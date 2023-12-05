import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { signOut } from 'aws-amplify/auth';

import { flexChild, colorGray, centerHV, fs24BoldBlack2, fs14BoldBlack2, fs16BoldBlack2, fs20BoldBlack2, colorBlue } from '../../styles'
import { CustomSpacer } from '../../components';
import { RoundedButton } from '../../components/Touchables';

export const Profile = () => {

  const handleLogout = () => {
    signOut();
  }
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
      <Text style={fs20BoldBlack2}>Name: Nithin</Text>
      <CustomSpacer space={hp(2)} />
      <Text style={fs20BoldBlack2}>Username: johnnithin08</Text>
      <CustomSpacer space={hp(2)} />
      <Text style={fs20BoldBlack2}>Email: johnnithin08@gmail.com</Text>
      <CustomSpacer space={hp(20)} />
      <View style={centerHV}>
      <RoundedButton buttonStyle={{backgroundColor: colorBlue._1}} text="Logout" onPress={handleLogout} />
      </View>
    </View>
    </View>
  )
}