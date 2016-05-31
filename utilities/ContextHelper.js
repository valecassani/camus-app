import React,{Platform} from 'react-native'
import _ from 'lodash'
import ContextActions from '../actions/ContextActions'

exports.getCurrentLocation = function getCurrentLocation() {
    var coordinates;
    if (Platform.OS === 'android') {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                var coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                ContextActions.setLocation(coords)
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000}
        );
    } else {
        // Running in iOS app
        // In this case there is a testing position (Turbigo (MI))
        ContextActions.setLocation({
            latitude: 45.4838452, longitude:  9.2363553
        })
    }
}
