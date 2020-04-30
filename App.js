/* eslint-disable prettier/prettier */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  Text,
  PermissionsAndroid,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
//Used to calculate haversine distance between two locations
const haversine = require('haversine');

import PlacesAutocomplete from './components/PlacesAutocomplete';

const SCREEN_HEIGHT = Dimensions.get('window').height;

//DEFAULT LOCATION DATA
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 18.7934829;
const LONGITUDE = 98.9867401;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      error: null,
      watchId: '',
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      destination:{},
      locationAccessGranted:false,
      distanceSrcDest:'',
    };
  }

  componentDidMount = async() => {
    await this.requestLocationPermission();
    //Get the current location
    if(!this.state.locationAccessGranted) return;

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        this.setState({
          latitude,
          longitude,
          error: null,
        });
      },
      error => {
        this.setState({error: error.message});
      },
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000},
    );
    
    //watch position
    //listener for watching the position
    let watchId = Geolocation.watchPosition(
      position => {
        console.log("position",position);
        const {latitude, longitude} = position.coords;
        const {routeCoordinates, distanceTravelled} = this.state;
        const newCoordinate = {latitude, longitude};

        this.setState({
          latitude,
          longitude,
          error: null,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate,
        });

        //calculate distance remaining to destination
        const {lat, lng} = this.state.destination;
        let distanceSrcDest=this.calculateHaversineDifference(lat, lng);
        this.setState({distanceSrcDest});
      },
      error => {
        this.setState({error: error.message});
      },
      {
        enableHighAccuracy: true,
        timeout: 200000,
        maximumAge: 1000,
        distanceFilter:0,
      },
    );

    //set watch id
    if (watchId) {
      this.setState({watchId});
    }
  }

  componentWillUnmount() {
    if (this.state.watchId) {
      Geolocation.clearWatch(this.state.watchId);
      // Geolocation.stopObserving();
    }
  }


  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Maps App',
          message:
            'Map App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({locationAccessGranted:true});
        console.log('You can use the location');
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  calcDistance = newLatLng => {
    const {prevLatLng} = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  //Get the map region
  getMapRegion = () => {
    return {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  };

  onSelectDestination = (lat, lng) => {
    let destination = {lat,lng};
    //Now you can do whatever you want to do with the destination coordinates
    //For now, we will calculate distance between source and destination
    let distanceSrcDest=this.calculateHaversineDifference(lat, lng);
    this.setState({distanceSrcDest,destination});
  }

  calculateHaversineDifference = (lat,lng) =>{
    return haversine({latitude:this.state.latitude,longitude:this.state.longitude},{latitude:lat,longitude:lng});
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={this.getMapRegion()}>
              <Polyline
                coordinates={this.state.routeCoordinates}
                strokeWidth={3}
              />
              <Marker
                coordinate={this.getMapRegion()}
                image={require('./scooter.png')}
              />
            </MapView>
            <View style={styles.autocomplete}>
              <PlacesAutocomplete
                onSelectDestination={(lat,lng) => this.onSelectDestination(lat,lng)}
              />
            </View>
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                Distance Travelled: {this.state.distanceTravelled.toFixed(2)} km
              </Text>
            </View>
            {this.state.distanceSrcDest ?
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                Distance to Destination: {this.state.distanceSrcDest.toFixed(2)} km
              </Text>
            </View>:null}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    position:'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocomplete: {
    position:'absolute',
    top:15,
    width:330,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'white',
    borderBottomWidth: 0,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
    height: 50,
    width: 300,
    marginVertical: 10,
    padding: 10,
  },
  distanceText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default App;
