/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Dimensions, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const SCREEN_HEIGHT = Dimensions.get('window').height;

//DEFAULT LOCATION DATA
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 18.7934829;
const LONGITUDE = 98.9867401;

class App extends Component {

  constructor(props){
      super(props);
      this.state = {
        latitude:LATITUDE,
        longitude:LONGITUDE,
        error:null,
      }
  }

  componentDidMount() {
    //Get the current location
    Geolocation.getCurrentPosition(position => {
      console.log('=============position===========',position);
      this.setState({
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        error:null,
      });
    },
      error => {
        this.setState({error:error.message});
      },
      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
      );  
  }


  //Get the map region
  getMapRegion = () => {
    return {
      latitude:this.state.latitude,
      longitude:this.state.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  }

  render(){
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={this.getMapRegion()}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: SCREEN_HEIGHT,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

export default App;
