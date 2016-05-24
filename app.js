/**
 * File which holds the router logic of the application
 */

var REQUEST_VIEW = 'http://valeriocassani.altervista.org/view_format.json';
var QUERY_CDT = 'http://valeriocassani.altervista.org/cdt.json';

var {Router, Route, Container, Actions, Animations, Schema} = require('react-native-router-flux');
var {NavBar, NavBarModal} = require('./components/NavBar');
var ContextSelectionPage = require('./components/ContextSelectionPage');

import {PRIMARY_COLOR} from './components/styles/StyleSheet'
// A bit of initialization
var React = require('react-native');
var {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    Platform,
    BackAndroid,
    StatusBar,
    Navigator
    } = React;

BackAndroid.addEventListener('hardwareBackPress', function() {
     if (1===1) {
       RouterActions.pop();
       return true;
     }
     return false;
});

// First component to be called, the homepage of the app
var MainScreen = require('./components/MainScreen');

var ResultsPage = require('./components/ResultsPage');
var DetailsPage = require('./components/DetailsPage');
var LoginPage = require('./components/LoginPage')

// Actions related to data
var DataActions = require('./actions/DataActions');

// Actions related to views
var ViewActions = require('./actions/ViewActions');
var ConnectionManager = require('./utilities/ConnectionManager')

var RouterActions = require('react-native-router-flux').Actions;

var App = React.createClass({


    /**
     * Rendering of the main method of the app, containing the main router
     * @return {[type]} [description]
     */
    render: function() {
        var hideBar = (Platform.OS === 'android') ? true : false
        return (
            <View style={{flex:1}}>
                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
                <Router hideNavBar = {true}
                    >
                    <Schema name="default" sceneConfig={(Platform.OS === 'android')?
                        Navigator.SceneConfigs.FloatFromBottomAndroid: Animations.FlatFloatFromRight} />
                    <Route name="launch" component={MainScreen}   title="Home"/>
                    <Route name="loggedIn">
                        <Router hideNavBar={hideBar}
                            navigationBarStyle={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                 // changing navbar color
                              }}
                            titleStyle={{
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold' // changing navbar title color
                            }}
                            leftButtonStyle={{
                                backgroundColor: 'white'
                            }}
                            leftButtonTextStyle={{
                                textColor: 'white',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>
                            <Route name="home" component={MainScreen} initial={true} title="Home"/>
                            <Route name="results" component={ResultsPage} title="Results"/>
                            <Route name="details" component={DetailsPage} title="Details"/>
                            <Route name="context" component={ContextSelectionPage} title="Context Selection"/>
                        </Router>
                    </Route>
                    <Route name="login" component={LoginPage} initial={true} title="Login"/>
                </Router>
            </View>
        );
    }
});

module.exports = App;
