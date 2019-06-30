import React, { Component } from 'react';
import {Button, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';

import Database from '../Database';

const db = new Database();

export default class ProductAddScreen extends Component {
  constructor() {
    super();
    this.state = {
      prodName: '',
      prodDesc: '',
      prodImage: '',
      isLoading: false,
    };
  }
  static navigationOptions = {
    title: 'Add Note',
  };
ve
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveProduct() {
    this.setState({
      isLoading: true,
    });
    let data = {
      prodName: this.state.prodName,
      prodDesc: this.state.prodDesc,
      prodImage: this.state.prodName.substring(0, 1),
    }
    db.addProduct(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      this.props.navigation.state.params.onNavigateBack;
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    })
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="green"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>

        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Note Title'}
              value={this.state.prodName}
              onChangeText={(text) => this.updateTextInput(text, 'prodName')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Note Description'}
              value={this.state.prodDesc}
              onChangeText={(text) => this.updateTextInput(text, 'prodDesc')}
          />
        </View>
       
        <View >
          <Button
            color="green"
            title='Save Note'
            textStyle={{backgroundColor:'green'}}
            onPress={() => this.saveProduct()} />
        </View>
      </ScrollView>
    );
  }

 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})