import React, { useState } from 'react'
import { View, Text } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context'
import { PieChart } from "react-native-gifted-charts";

import { centerHV, centerHorizontal, centerVertical, colorGray, flexChild, flexRow, flexRowCC, fs14BoldBlack2, fs16BoldBlack2, fs20BoldBlack2, fs24BoldBlack2, px, spaceBetweenVertical } from '../../styles'
import { CustomSpacer, SingleSelectPills } from '../../components'

type TDateFilter = "Last month" | "Last 6 months" | "Last Year"


const renderDot = color => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = () => {
  return (
    <>
      <View
        style={{
          ...flexRow,
          ...centerHorizontal,
          ...spaceBetweenVertical,
        }}>
        <View
          style={{
            ...flexRow,
            ...centerVertical,
            width: wp(30),
            marginRight: wp(4)
          }}>
          {renderDot('#006DFF')}
          <Text style={fs16BoldBlack2}>Expenses: 47%</Text>
        </View>
        <View
          style={{...flexRowCC, width: wp(30)}}>
          {renderDot('#8F80F3')}
          <Text style={fs16BoldBlack2}>Earnings: 53%</Text>
        </View>
      </View>
    </>
  );
};

export const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<TDateFilter>("Last month")

  const handleDateFilter = (value: string) => {
    setDateFilter(value as TDateFilter)
  }
  const pieData = [
  {
    value: 47,
    color: '#009FFF',
    focused: true,
  },
  {value: 53, color: '#93FCF8',},
];

const dataFilterArray: IPillsWithSubLabel[] = [{ label: "Last month" }, { label: "Last 6 months" }, { label: "Last Year" }]



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
          Dashboard
        </Text>
      </View>
      <View style={{padding: 20, alignItems: 'center'}}>
        <PieChart
          data={pieData}
          donut
          // showGradient
          sectionAutoFocus
          focusOnPress={true}
          radius={wp(25)}
          innerRadius={wp(15)}
          centerLabelComponent={() => {
            return (
              <View style={centerHV}>
                <Text style={fs20BoldBlack2}>
                  47%
                </Text>
                <Text style={fs20BoldBlack2}>Profit</Text>
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
          <Text style={fs20BoldBlack2}>Total Earnings: </Text>
          <Text style={fs20BoldBlack2}>Total Expenses: </Text>
          <Text style={fs20BoldBlack2}>Net: </Text>
    </View>
  </View>);
}