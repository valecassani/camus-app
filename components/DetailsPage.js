'use strict'

var React = require('react-native');
var _ = require('lodash');
import {styles,PRIMARY_COLOR} from './styles/StyleSheet'

const API_KEY_GOOGLE_MAPS = require('../config').maps_api;



var {
    ActivityIndicatorIOS,
    ListView,
    Platform,
    ProgressBarAndroid,
    StyleSheet,
    Text,
    Image,
    Linking,
    LinkingIOS,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    ToolbarAndroid,
    BackAndroid,
    ScrollView
    } = React;

var ViewBuilder = require('./ViewBuilder');
var ContextStore = require('../stores/ContextStore')
var ContextHelper = require('../utilities/ContextHelper')
var RouterActions = require('react-native-router-flux').Actions
var Icon = require('react-native-vector-icons/MaterialIcons');
var Button = require('react-native-button');
import {MKButton,MKColor,MKSpinner} from 'react-native-material-kit'


//Distance and Duration default values
var MOCKED_DATA = [
  {distance: '...', duration: "..."}];

//Google Distance Matrix API Key- Please replace with your own API Key (console.developers.google.com)

var BASIC_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?language=en&';

var mode ="driving"; //default mode (Null/WithCar)
var icon = "car"; // default icon (Null/WithCar)

var geocodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key='+API_KEY_GOOGLE_MAPS

// Element which render a page without a listview
var DetailsBuilder = React.createClass({
    getInitialState: function() {
        var item = this.props.itemSelected
        return {
            latitude: item.latitude,
            longitude: item.longitude
        }
    },

    render: function () {
        var item = this.props.itemSelected;
        var objects = this.props.skeleton;

        // check if the latitude and longitude are null, if is true fetch these from Google Geocoding API
        if (_.isNull(this.state.latitude) || _.isNull(this.state.longitude)) {
            this.fetchCoordinates(item.address);

            //Show empty view in the screen for the moment
            if (Platform.OS === 'android') {
                return (
                    <View style = {styles.container}>

                    </View>
                )

            }
            return (
                <View style = {styles.iosContainer}>
                </View>
            )
        } else {

            if (Platform.OS === 'android') {
                return (
                    <View style={styles.container}>
                        <Icon.ToolbarAndroid
                            style = {styles.toolbar}
                            title = {item.title.slice(0,35)}
                            titleColor="white"
                            navIconName = 'arrow-back'
                            onIconClicked={() => {
                                RouterActions.pop()
                            }}/>
                        <ScrollView>

                            <ViewBuilder
                                type = "details"
                                item = {item}
                                style = {styles.paddedContainer}
                            />
                        </ScrollView>
                    </View>);
            }
            return (

                <ScrollView style={styles.iosContainer}>

                    <ViewBuilder
                        type = "details"
                        item = {item}
                        style = {styles.paddedContainer}
                    />

            </ScrollView>

          );
        }

    },


// Rendering loading view, currently unused because there is only a single server request

    renderLoadingView: function () {
        return (
            <View style="styles.container">
                <Text style={styles.title}>
                    Loading...
                </Text>
            </View>
        )
    },

    fetchCoordinates: function(address) {
        var convertedAddress = address.replace(" ", "+")
        var requestURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+convertedAddress+'+CA&key='+API_KEY_GOOGLE_MAPS

        fetch(requestURL)
          .then((response) => response.json())
          .then((responseData) => {
            console.log("GEOCODING RESULTS")
            var firstResult = _.head(responseData.results)
            console.log(firstResult)
            var newLatitude = firstResult.geometry.location.lat
            var newLongitude = firstResult.geometry.location.lng

            // Setting the coordinates of the item for the support component
            this.props.itemSelected.latitude = newLatitude
            this.props.itemSelected.longitude = newLongitude

            console.log(newLatitude + ", " + newLongitude)
            // Put coordinates to state of the component
            this.setState({
                latitude : newLatitude,
                longitude : newLongitude
            })
        })
          .done();
      }


});


module.exports = DetailsBuilder;
