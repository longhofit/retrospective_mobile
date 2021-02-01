import React, { useState } from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  Text,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {
  textStyle,
} from '@src/components';
import {
  isEmpty,
  pxPhone,
  pxToPercentage,
} from '@src/core/utils/utils';
import { ScrollView } from 'react-native-gesture-handler';
import { User } from '@src/core/models/user/user.model';
interface ComponentProps {
  onPlusAccountPress: () => void;
  onProAccountPress: () => void;
  user: User;
}

export type PaymentProps = ThemedComponentProps & ComponentProps;

const SignUpComponent: React.FunctionComponent<PaymentProps> = (props) => {
  const onBackPress = (): void => {
    //props.onBackPress();
  };

  const { themedStyle } = props;

  return (
    <ScrollView>
        <View style={themedStyle.container}>
            <View style={themedStyle.viewHeader}>
                <Text style={themedStyle.txtHeader}>
                    You reached your limit of active board per month, subscribe to add more.
                </Text>
                <Text style={themedStyle.txtHeader}>
                    Try Retrospective with an 30 days free trial
                </Text>
                <Text style={themedStyle.darkText}>
                    No credit card required for your trial
                </Text>
            </View>
            <View style={themedStyle.viewPayment}>
                <View style={themedStyle.viewPaymentItem}>
                    <View style={themedStyle.headerItem}>
                        <Text style={themedStyle.txtTypeAccount}>PLUS</Text>
                        <Text style={themedStyle.txtPriceType}>US$3.99</Text>
                        <Text style={themedStyle.txtDuration}>per month</Text>
                        <Text style={themedStyle.txtDescription}>3 public boards per month, 1 team board per month, max 5 member/team</Text>
                    </View>
                    <View style={themedStyle.ButtonItem}>
                    </View>
                </View>
                <View style={themedStyle.viewPaymentItem}>
                    <View style={themedStyle.headerItem}>
                        <Text style={themedStyle.txtTypeAccount}>BASIC</Text>
                        <Text style={themedStyle.txtPriceType}>US$0</Text>
                        <Text style={themedStyle.txtDuration}>per month</Text>
                        <Text style={themedStyle.txtDescription}>10 public boards per month, 5 team board per month, max 15 member/team</Text>
                    </View>
                    <View style={themedStyle.ButtonItem}>
                        <TouchableOpacity style={themedStyle.StyleButton} >
                            <Text style={themedStyle.txtButton}>Start free trial</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
                <View style={themedStyle.viewPaymentItem}>
                    <View style={themedStyle.headerItem}>
                        <Text style={themedStyle.txtTypeAccount}>PRO</Text>
                        <Text style={themedStyle.txtPriceType}>US$10</Text>
                        <Text style={themedStyle.txtDuration}>per month</Text>
                        <Text style={themedStyle.txtDescription}>Unlimited public boards, Unlimited team board, max 30 member/team</Text>
                    </View>
                    <View style={themedStyle.ButtonItem}>
                        <TouchableOpacity style={themedStyle.StyleButton} >
                            <Text style={themedStyle.txtButton}>Subscribe now</Text>
                        </TouchableOpacity>  
                    </View>
                </View>
            </View>
        </View>  
    </ScrollView>
  );
};

export const Payment = withStyles(SignUpComponent, (theme: ThemeType) => ({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  viewHeader: {
    marginTop: pxPhone(25),
    width: '90%',
    alignItems: 'center',
  },
  txtHeader: {
    fontSize: pxToPercentage(24),
    ...textStyle.proTextBold,
  },
  darkText:{
    color: 'gray'
  },
  viewPayment:{
    marginTop: pxPhone(25),
    width: '70%',
    alignItems: 'center',
  },
  viewPaymentItem:{
    backgroundColor:'#123457',
    height: pxPhone(450),
    marginTop: pxPhone(5)
  },
  headerItem:{
    marginHorizontal: pxPhone(15),
    height: '50%',
  },
  txtTypeAccount:{
    fontSize: pxToPercentage(24),
    ...textStyle.proTextBold,
    color:'white',
    marginTop: pxPhone(12),
  },
  txtPriceType:{
    fontSize: pxToPercentage(26),
    ...textStyle.proTextBold,
    color:'white',
    marginTop: pxPhone(18),
  },
  txtDuration:{
    color:'gray',
  },
  txtDescription:{
    fontSize: pxToPercentage(18),
    ...textStyle.proTextBold,
    color:'white',
    marginTop: pxPhone(18),
  },
  ButtonItem:{
    height: '50%',
    alignItems:'center',
  },
  StyleButton:{
    width: '75%', 
    height: pxPhone(50), 
    borderRadius: pxPhone(25), 
    //backgroundColor:'#5cdb94', 
    backgroundColor:'#39dd82',
    justifyContent: 'center', 
    alignItems:'center',
    marginTop: pxPhone(120),
  },
  txtButton:{
    color:'#123457',
    fontSize: pxToPercentage(18),
    ...textStyle.proTextBold,
    margin: pxPhone(10)
  }
}));
