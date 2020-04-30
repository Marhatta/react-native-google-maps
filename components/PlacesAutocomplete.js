/* eslint-disable prettier/prettier */

import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {GOOGLE_API_KEY} from '../App.config';

const PlacesAutocomplete = (props) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search Destination"
      minLength={2}
      autoFocus={false}
      returnKeyType={'search'}
      listViewDisplayed='true'
      fetchDetails={true}
      currentLocation={false}
      nearbyPlacesAPI="GooglePlacesSearch"
      components="country:ca"
      renderDescription={row => row.description}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: GOOGLE_API_KEY,
        language: 'en', // language of the results
        types:'address'
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        //All the details of the selected address will be here
        console.log(details);
      }}
      getDefaultValue={() => ''}
      styles={{
        textInputContainer: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderBottomWidth:0,
          shadowColor: 'black',
          shadowOffset: {width: 1, height: 3},
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 12,
        },
        textInput: {
          marginLeft: 0,
          marginRight: 0,
          height: 38,
          color: '#5d5d5d',
          fontSize: 16
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        },
        container:{
            backgroundColor:'white'
        }
      }}
    />
  );
};

export default PlacesAutocomplete;
