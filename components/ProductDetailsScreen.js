import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text ,Button} from 'react-native';
import { Card } from 'react-native-elements';
import Database from '../Database';


const db = new Database();
  

export default class ProductDetailsScreen extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      product: {},
      id: '',
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      db.productById(navigation.getParam('prodId')).then((data) => {
        console.log(data);
        product = data;
        this.setState({
          product,
          isLoading: false,
          id: product.prodId
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    });
  }

  deleteProduct(id) {
    this.setState({
      isLoading: true
    });
    db.deleteProduct(id).then((result) => {
      console.log(result);
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }



  static navigationOptions = {
    title: 'Note Details',
  };
 render() {
  if(this.state.isLoading){
    return(
      <View style={styles.activity}>
        <ActivityIndicator size="large" color="green" />
      </View>
    )
  }
  return (
    <ScrollView>
      <Card style={styles.container}>
        <View style={styles.subContainer}>
        
         
          <View>
            <Text style={{fontSize: 16}}>Product Name: {this.state.product.prodName}</Text>
          </View>
          <View>
            <Text style={{fontSize: 16}}>Product Desc: {this.state.product.prodDesc}</Text>
          </View>
    
        </View>
        <View style={styles.detailButton}>
          <Button
            large
            title='Edit'
            color="green"
            onPress={() => {
              this.props.navigation.navigate('EditProduct', {
                prodId: `${this.state.id}`,
              });
            }} />
        </View>
        <View style={styles.detailButton}>
          <Button
            large
            color="red"
            title='Delete'
            onPress={() => this.deleteProduct(this.state.id)} />
        </View>
      </Card>
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
    paddingBottom: 20,
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
  },
  detailButton: {
    marginTop: 10
  }
})