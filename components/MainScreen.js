'use strict';

// Initialization of the react variables
var React = require('react-native');
var {
    ListView,
    Platform,
    ProgressBarAndroid,
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    StatusBar,
    TouchableHighlight,
    Image


    } = React;

import {MKButton, MKSpinner} from 'react-native-material-kit'

import {styles, STATUSBAR_COLOR} from './styles/StyleSheet'
var RouterActions = require('react-native-router-flux').Actions;

import Spinner from 'react-native-loading-spinner-overlay';
var NavBar =require('../components/NavBar')

// Custom component for build buttons (per adesso)
var _ = require('lodash');
import Button from 'apsl-react-native-button'
// Necessary components to the homepage
var ViewStore = require('../stores/ViewStore');
var ViewActions = require('../actions/ViewActions');
var DataStore = require('../stores/DataStore');
var DataActions = require('../actions/DataActions');
var Icon = require('react-native-vector-icons/MaterialIcons');

// Results page which is pushed when the topic is selected
//
// (per adesso, poi la pagina da chiamare è la pagina per arricchire il contesto)
var MainScreen = React.createClass({

    getInitialState() {
        ViewActions.setCurrentTitle('Home')
        return DataStore.getState();
    },

    componentDidMount: function () {
        DataStore.listen(this.onChange);
    },

    componentWillUnmount: function () {
        DataStore.unlisten(this.onChange);
    },

    onChange(state) {
        console.log("State changed in Mainscreen")
        console.log(state)
        this.setState(state);
    },


//main render function of the main page
    render: function () {
        if (this.state.errorMessage) {
            return this.renderErrorView();
        }
        console.log(this.state.fullCdt)
        if (this.state.fullCdt.length === 0) {
            console.log("RENDERIING LOADING")
           return (
                this.renderLoadingView()

            )
        }
        console.log("RENDERING VIEW")
        return this.renderView();
    },

    /**
     * Function which renders the error in page loading
     * @return {Object} The error view
     */
    renderErrorView: function () {
        return (
            <View styles={styles.container}>
                <Text>Error in loading files</Text>
            </View>
        )

    },

    /**
     * Function which renders the main page, with the buttons coming from the CDT
     * @return {Object} The generated views
     */
    renderView: function () {
        console.log("RENDERING VIEW")
        var cdt = this.state.fullCdt.context;
        console.log(cdt)
        var buttons= _.find(cdt,{name:"InterestTopic"}).values.map(
            (item) => {
                return {
                    title: item
                }
            }
        );
        console.log(buttons)
        var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        var dataSource = ds.cloneWithRows(buttons)
        console.log(dataSource)
        if (Platform.OS === 'android') {
            return (
                <View>
                    <StatusBar
                        backgroundColor={STATUSBAR_COLOR}
                    />
                    <View style={styles.container}>
                        <ToolbarAndroid
                            title={"Home"}
                            titleColor="white"
                            actions={toolbarActions}
                            style={styles.toolbar}/>
                            <ListView
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-around'
                                }}
                                style={styles.container}
                                dataSource={dataSource}
                                renderRow={this.renderButtons}
                                />


                    </View>

                </View>
            )
        }
        return (
            <ListView
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around'
                }}
                style={styles.iosContainer}
                dataSource={dataSource}
                renderRow={this.renderButtons}
                />
        )

    },

    // View in case of loading state
    renderLoadingView: function () {
        return (
            <View >
                <MKSpinner style={styles.spinner}/>
            </View>
        );
    },
    renderButtons: function (item) {
        console.log(item)
        var iconName
        switch (item.title) {
            case 'Restaurant' :
                iconName = 'local-dining'
                break;
            case 'Event' :
                iconName = 'local-activity'
                break;
            case 'Museum' :
                iconName = 'account-balance'
                break;
            case 'Hotel' :
                iconName = 'local-hotel'
                break;
            case 'Cinema':
                iconName = 'movie-creation'
                break;
            case 'Theater':
                iconName = 'looks'
                break;
            default:
                break;
        }
        return (
            <TouchableHighlight
                onPress={() => this.onPressTopic(item.title)}
                style={{marginTop: 10}}>
                <View
                    style={(Platform.OS === 'android')? styles.topicButtonAndroid :styles.topicButton}
                    >
                    <Text style={styles.topicText}>
                        {item.title}
                    </Text>
                    <Icon style={{alignSelf : 'center'}} name={iconName} size={100} color="white" />
                </View>

            </TouchableHighlight>


            );
        },
/**
 * Function which handles the condition when an interest topic button is pressed
 * launching the Context Selection Page
 * @param  {[Object]} item [The single item of the interest topic]
 *
 */
    onPressTopic: function(item) {
        ViewActions.selectInterestTopic(item);
        DataActions.updateTopic(item);
        ViewActions.setCurrentTitle('Context Selection')
        RouterActions.context();
    }


});

var toolbarActions = [
  {title: 'Create'},
  {title: 'Filter'},
  {title: 'Settings'}
];

module.exports = MainScreen;
