import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ProductScreen from './components/ProductScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import ProductAddScreen from './components/ProductAddScreen';
import ProductEditScreen from './components/ProductEditScreen';

const RootStack = createStackNavigator(
  {
    Product: ProductScreen,
    ProductDetails: ProductDetailsScreen,
    AddProduct: ProductAddScreen,
    EditProduct: ProductEditScreen,
  },
  {
    initialRouteName: 'Product',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'green',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);


const RootContainer = createAppContainer(RootStack);

export default class App extends React.Component {

  render() {

    return (
      <View style={{flex:1}}>
        <StatusBar backgroundColor="#005500" barStyle="light-content" />
        <RootContainer />
         </View>)
  }
}
