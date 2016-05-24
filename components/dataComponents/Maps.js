/**
 * Created by valeriocassani on 09/12/15.
 */

    'use strict'
var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    MapView,
    Platform,
    AlertIOS,
    LinkingIOS,

    } = React;

var RNMaps = require('react-native-maps')
var _ = require('lodash')


/**
 * Module to build an item of type map into the app
 */


var Maps = React.createClass({

        //this places the marker in the map

        // If longitude or latitude are undefined returns and empty view
    render:function() {
        var annotations = [{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            title: this.props.title
        }];

// This is the position of the shown map
// Longitude and latitude delta are only for iOS implementation
        var region = {
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1

        };

// Rendering of the mapview for android devices
         if (Platform.OS === 'android') {
            return (
                <RNMaps
                    style={this.props.style}
                    initialRegion={region}
                >
                {_.map(annotations, (marker,index) =>  {
                    return (
                        <RNMaps.Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }}
                            title={marker.title}
                            description={marker.description}
                            key={index}
                        />
                    )
                }

                )}
            </RNMaps>
            )
        }



// Rendering of mapview for ios devices
        return (
            <MapView
                annotations={annotations}
                region={region}
                style={this.props.style}
            >


            </MapView>
    );

    }

// Annotations on map




});

module.exports = Maps;
