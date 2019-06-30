import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class ProductScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      products: [],
      notFound: ' click (+) button to add Note.'
    };
  }
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getProducts();
    });
  }
  addNote=()=>{
      this.props.navigation.navigate('AddProduct', {
        onNavigateBack: this.handleOnNavigateBack
      });
  }

  getProducts() {
    let products = [];
    db.listProduct().then((data) => {
      products = data;
      this.setState({
        products,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
    <ListItem
      title={item.prodName}
      leftAvatar={{
        source: item.prodImage && { uri: item.prodImage },
        title: item.prodName[0]
      }}
      onPress={() => {
        this.props.navigation.navigate('ProductDetails', {
          prodId: `${item.prodId}`,
        });
      }}
      chevron
      bottomDivider
    />
  )

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Notes',
      // headerRight: (
      //   <Button
      //     buttonStyle={{ padding: 8, backgroundColor: 'transparent' }}
      //     icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
      //     onPress={() => {
      //       navigation.navigate('AddProduct', {
      //         onNavigateBack: this.handleOnNavigateBack
      //       });
      //     }}
      //   />
      // ),
    };
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color='green' />
        </View>
      )
    }
    else if (this.state.products.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.message}>{this.state.notFound}</Text>
          <TouchableOpacity activeOpacity= {0.8} style={styles.btn} onPress={this.addNote}>
          <Text style={styles.btntxt}>+</Text>
        </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.products}
          renderItem={this.renderItem}
        />
        <TouchableOpacity activeOpacity= {0.8} style={styles.btn} onPress={this.addNote}>
          <Text style={styles.btntxt}>+</Text>
        </TouchableOpacity>

      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: 'red'
  }, btn: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent:'center',
    alignItems:'center'
  }, btntxt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  }
});