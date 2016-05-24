'use strict'

var React = require('react-native');
var _ = require('lodash');
import {styles,PRIMARY_COLOR} from './styles/StyleSheet'


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
var key = "AIzaSyBlW7hyT58AaLoEaJOZP7xk_O26_ii6XfE"

var BASIC_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?language=en&';

var mode ="driving"; //default mode (Null/WithCar)
var icon = "car"; // default icon (Null/WithCar)

// Element which render a page without a listview
var DetailsBuilder = React.createClass({

    render: function () {
        var item = this.props.itemSelected;
        var objects = this.props.skeleton;
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
    }

// Stylesheet of the details page
});


module.exports = DetailsBuilder;
