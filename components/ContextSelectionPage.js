/**
 * Created by valeriocassani on 01/12/15.
 */

'use strict'

var React = require('react-native');
var _ = require('lodash');
var DataStore = require('../stores/DataStore');
var ViewStore = require('../stores/ViewStore');
var ViewActions = require('../actions/ViewActions')
var Communications = require('react-native-communications');
var ConnectionManager = require('../utilities/ConnectionManager');
var ContextActions = require('../actions/ContextActions')
var Icon = require('react-native-vector-icons/MaterialIcons');

// Call Intent for android
var AndroidCallIntent = require('react-native-callintent');
import Button from 'apsl-react-native-button'
var {
    ActivityIndicatorIOS,
    ListView,
    Platform,
    ProgressBarAndroid,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    AlertIOS,
    ToolbarAndroid,
    Image,
    BackAndroid
    } = React;

var ViewBuilder = require('./ViewBuilder');
var RouterActions = require('react-native-router-flux').Actions;
var DataActions = require('../actions/DataActions');
var ContextStore = require('../stores/ContextStore')
var ContextHelper = require('../utilities/ContextHelper')
import {styles} from './styles/StyleSheet'
import Estylo from 'react-native-estylo'
import {MKButton} from 'react-native-material-kit'


// Element which render a page without a listview
var ContextSelectionPage = React.createClass({

    getInitialState: function() {
        return {
            cdt: DataStore.getState().fullCdt.context,
            topic: ViewStore.getState().currentInterestTopic,
            currentPosition: 'unknown',
            contextData: ContextStore.getState()
        }
    },

    componentDidMount: function() {
        this.parseCdt();
        ContextHelper.getCurrentLocation()
        //reinitialization of variable results, in order to avoid problems in remount
        ContextStore.listen(this.onChange);
    },

    componentWillUnmount: function () {
        ContextStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState({
            contextData: state
        })
    },
    /**
     * Rendering of the contaner of the page
     * @return {<View>} The rendered view
     */
    render: function () {
        if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <Icon.ToolbarAndroid
                        style = {styles.toolbar}
                        title = {this.state.topic}
                        titleColor="white"
                        navIconName = 'arrow-back'
                        onIconClicked={() => {
                            RouterActions.pop()
                        }}/>
                        <View
                            style={{padding: 20}}>
                            <MKButton
                                style={styles.buttonMaterial}
                                shadowRadius={2}
                                shadowOffset={{width:0, height:3}}
                                shadowOpacity={0.9}
                                shadowColor="black"
                                onPress={this.onPressQuery}
                                >
                                <Text pointerEvents="none"
                                    style={styles.buttonText}>
                                    Search
                                </Text>
                            </MKButton>
                            <ViewBuilder
                                type = 'context'
                                style = {styles.container}
                                cdt = {this.state.cdt}
                                />
                        </View>
                </View>);
        }
        return (
            <View style={styles.iosContainer}>
                <View
                    style={{padding: 20}}>
                    <MKButton
                        style={styles.buttonMaterial}
                        shadowRadius={2}
                        shadowOffset={{width:0, height:3}}
                        shadowOpacity={0.9}
                        shadowColor="black"
                        onPress={this.onPressQuery}
                        >
                        <Text pointerEvents="none"
                            style={styles.buttonText}>
                            Search
                        </Text>
                    </MKButton>
                    <ViewBuilder
                        type = 'context'
                        style = {styles.container}
                        cdt = {this.state.cdt}
                        />
                </View>
            </View>);



    },

// Rendering loading view, currently unused because there is only a single server request


    onPressQuery: function() {
        var context = this.buildContext();
        ConnectionManager.makeInitialDataRequest(ViewStore.getState().skeletons,this.state.topic,context);
        RouterActions.results()
    },

    parseCdt: function() {
        var coordinates = ContextStore.getState().location;
        if (_.isUndefined(coordinates) || _.isNull(coordinates)) {
            return
        }
        console.log("COORDINATE")
        console.log(coordinates)
        this.setState({
            currentPosition: coordinates
        })
        var cdtItems = _.map(this.state.cdt,function(item) {
            return {
                name: item.name,
                parameters: item.parameters,
                values: item.values,
                parents: item.parents
            }
        })
        this.setState({cdt : cdtItems});
    },
/**
 * Method which fetch the current location of the device and stores it in the state of the component before making the query
 * @return {[type]} [description]
 */
    getCurrentLocation: function() {
        if (Platform.OS === 'android') {
            if (this.state.currentPosition === 'unknown') {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.setState({
                            currentPosition: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        });
                        },
                    (error) => alert(error.message),
                    {enableHighAccuracy: true, timeout: 20000}
                );
            }
        } else {
            // Running in iOS app
            var currentPosition = {
                // In this case there is a testing position (Turbigo(MI))
                latitude: 45.5337064, longitude:  8.7332023
            }
            this.setState({currentPosition: currentPosition});
        }
    },

/**
 * buildContext
 * Function which builds the context to be passed to the GraphQL server query
 *
 */

    buildContext: function() {
        var currentTopic = this.state.topic;
        // Parsing current cdt from state
        var output = [];
        _.forEach(this.state.cdt, (item) => {
            var value = null;
            var parameters = null;
            var skipItem = false;
            _.forEach(item.values, val => {
              console.log("FOREACH ERROR")
              console.log(this.state);
                if (_.includes(this.state.contextData.forbidden,val) && val === 'Transport') {
                    skipItem = true;
                }
            })
            if (skipItem) {
                return
            };
            // Tuning of parameters of CDT
            switch(item.name) {
                case 'InterestTopic':
                    value = this.state.topic;
                    break;
                case 'Location':
                    parameters = [
                        {
                            "name": "CityCoord",
                            "fields": [
                                {
                                    "name": "Latitude",
                                    "value": this.state.contextData.location.latitude
                                },
                                {
                                    "name": "Longitude",
                                    "value":this.state.contextData.location.longitude
                                }
                            ]
                        }
                    ]
                    console.log("CURRENT LOCATION")
                    console.log(parameters)
                    break;
                case 'Keyword':
                    if (this.state.contextData.keyword) {
                        parameters = [
                            {
                                "name": item.parameters[0].key,
                                "value": this.state.contextData.keyword
                            }
                        ]
                    }
                    break;
                case 'Transport':
                        parameters = [
                            {
                                "name": "Transport",
                                "value": this.state.contextData.transport
                            }
                        ];
                    break;
                case 'Tipology':
                    parameters = [
                        {
                            "name": "Typology",
                            "value": this.state.contextData.tipology
                        }
                    ]
                    break;
                case 'OS' :
                    value = (Platform.OS === 'android') ? 'Android' : 'iOS'
                    break;

                case 'Cuisine':
                    parameters = [
                        {
                            "name":"Cuisine",
                            "value": this.state.contextData.cuisine
                        }
                    ]
                    break;
                case 'Budget':
                    parameters = [
                        {
                            "name":"Budget",
                            "value": this.state.contextData.budget
                        }
                    ]
                    break;
                case 'Context':
                    parameters = [
                        {
                            "name":"Context",
                            "value": this.state.contextData.context
                        }
                    ]
                    break;
                }
            if (value === null && parameters === null)
                return;
            if (value === null) {
                output.push({
                    dimension: item.name,
                    parameters: parameters
                })
                return;
            }
            if (parameters === null) {
                output.push({
                    dimension: item.name,
                    value: value
                })
                return;
            }
            output.push({
                dimension: item.name,
                value: value,
                parameters: parameters
            })
        })
        ContextActions.updateLastContext(output)
        return output;
    }
});

module.exports = ContextSelectionPage;
