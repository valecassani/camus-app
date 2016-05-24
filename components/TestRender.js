'use strict'

var React = require('react-native');
var _ = require('lodash');
var utils = require('../utilities/utils');
var Actions = require('react-native-router-flux').Actions;

var ConnectionManager = require('../utilities/ConnectionManager');

var ITERATION_NUMBER = 200;

var {
    ActivityIndicatorIOS,
    ListView,
    Platform,
    ProgressBarAndroid,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback
    } = React;

var DataStore = require('../stores/DataStore');
var ViewActions = require('../actions/ViewActions');
var ViewStore = require('../stores/ViewStore');
var DataActions = require('../actions/DataActions');
var ViewBuilder = require('../components/ViewBuilder');

var mockData = {"title":"ANTI-AGING HAND SANITIZER","address":"Cambridge","latitude":"51.91526","longitude":"-8.18052"}


//Global variables

/* Builder of the results page which uses only the listview
 *
 *
 */
var TestRender = React.createClass({




    getInitialState() {

        var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        var results = this.resultsBuilder();
        console.log("Starting rendering ResultsPage");
        ConnectionManager.makeGraphRequest(ViewStore.getState().skeletons,"Cinema");
        return {
            dataSource: ds.cloneWithRows(results),
            loaded: true
        }
    },

// Builder of the mock rendering data
    resultsBuilder: function() {
        var results = [];
        for (var i = 0; i < ITERATION_NUMBER; i++) {
            results[i] = mockData;
        }
        return results;
    },


    render: function () {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (
            <View style={styles.container}>

            </View>)
    },

    renderItem: function (item) {
        return (
            <TouchableHighlight onPress={() => this._pressRow(item)}>
                <View>
                    <ViewBuilder
                        type = "list"
                        item = {item}
                        style = {{height: 56}}/>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        )
    },
    renderLoadingView: function () {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Loading...
                </Text>
            </View>
        )
    },

    _pressRow: function (item) {

        //when a row gets pressed there is a push to the details page of the selected item



    },
});

var ViewEnder = React.createClass({
    componentDidMount: function() {
        console.log("Rendering done")

    },
    render: function() {
        return <View/>
    }
})

var styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 80,
    },

    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center'

    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },

    containerTop: {
        flex: 1,
        marginTop: 80,
        backgroundColor: 'white'
    }
});

module.exports = TestRender;
