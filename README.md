# react-native-google-maps
## Sample Implementation of Google Maps Integration with React Native
### Points Covered
    1. Fetched Current Location
    2. Added Location Permissions
    3. Added Places Autocomplete
    4. Calculated distance between two locations
    5. Created Polyline along the path i.e as the the device moves, polyline will be created along that path
 
### Dependencies
    "@react-native-community/geolocation": "^2.0.2",
    "haversine": "^1.1.1",
    "react-native-geolocation-service": "^4.0.1",
    "react-native-google-places-autocomplete": "^1.4.1",
    "react-native-maps": "^0.27.1"

### API's Used
     1. Maps Api
     2. Places Api
     
## How to ?

    1. Clone the repository -> git clone https://github.com/Marhatta/react-native-google-maps.git
    2. Install the dependencies -> npm install
    3. Make sure to add your API_KEY in AndroidManifest.xml under android/src/AndriodManifest.xml and in App.config.js
    4. Enable the above mentioned API's from you google console.(You may need a billing account)
    5. You are all set.Run your App.
    
# Demo gif
![ReactNative-Maps](https://github.com/Marhatta/react-native-google-maps/blob/b43c59c0115710ef1bef94bc7f622b1bbaf0c24e/maps.gif)
