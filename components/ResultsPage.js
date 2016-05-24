'use strict'

var React = require('react-native');
var _ = require('lodash');
var RouterActions = require('react-native-router-flux').Actions;
import {styles,STATUSBAR_COLOR} from './styles/StyleSheet'
import {MKSpinner} from 'react-native-material-kit'

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
    ToolbarAndroid,
    TouchableOpacity,
    RecyclerViewBackedScrollView
    } = React;

var DataStore = require('../stores/DataStore');
var ViewActions = require('../actions/ViewActions');
var ViewStore = require('../stores/ViewStore');
var DataActions = require('../actions/DataActions');
var ViewBuilder = require('../components/ViewBuilder');
var ContextSelectionPage = require('./ContextSelectionPage')
var ConnectionManager = require('../utilities/ConnectionManager')
var ContextStore = require('../stores/ContextStore')
var Icon = require('react-native-vector-icons/MaterialIcons');


//Global variables
var results = [];

/* Builder class of the results page which uses only the listview
 *
 *
 */
var ResultsBuilder = React.createClass({


    getInitialState() {
        var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        return {
            dataSource: ds,
            loaded: false,
            topic: DataStore.getState().currentTopic
        }
    },
    componentDidMount: function () {
        //listener on changes on the datastores
        DataStore.listen(this.onChange);
        //reinitialization of variable results, in order to avoid problems in remount
        results = [];
    },

    componentWillUnmount: function () {
        DataStore.unlisten(this.onChange);

    },
    /**
     * Evaluator if there is an update in the stores
     * for instance when new data arrives
     * @param  {[Object]} state The new state arrived in the stores
     * @return {[type]}       [description]
     */
    onChange(state) {
        var fullResults = _.find(state.results, {topic: this.state.topic}).results
        var newResults = fullResults.primaryResults;
        var lastItemCur = newResults.pageInfo.endCursor
        var newHasNextPage = newResults.pageInfo.hasNextPage

        var results = null
        // Control to avoid unuseful updates
        if (!_.isEmpty(newResults) ) {
            results = newResults
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(results.edges),
                lastItem: lastItemCur,
                loaded: true,
                topic: state.currentTopic,
                hasNextPage: newHasNextPage
            });
        } else {
            this.setState({
                errorMessage: state.errorMessage,
            })
        }
    },

    render: function () {
        if (!this.state.loaded) {
            if(!_.isUndefined(this.state.errorMessage)) {
                return this.renderErrorView()
            }
            return this.renderLoadingView();

        }

        if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <Icon.ToolbarAndroid
                        style = {styles.toolbar}
                        title = "Results"
                        titleColor="white"
                        navIconName = 'arrow-back'
                        onIconClicked={() => {
                            RouterActions.pop()
                        }}/>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem}
                        onEndReached = {() => {
                            if (this.state.hasNextPage){
                                var skeletons = ViewStore.getState().skeletons
                                var context = ContextStore.getState().lastContext
                                ConnectionManager.makeAfterGraphRequest(skeletons,
                                    this.state.topic,context,this.state.lastItem)
                            }

                        }}
                        onEndReachedThreshold = {200}
                    />
                </View>
            )
        }
        return (
                <ListView
                    style={styles.iosContainer}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem}
                    onEndReached = {() => {
                        if (this.state.hasNextPage){

                            var skeletons = ViewStore.getState().skeletons
                            var context = ContextStore.getState().lastContext
                            ConnectionManager.makeAfterGraphRequest(skeletons,
                                this.state.topic,context,this.state.lastItem)
                        }
                    }}
                    onEndReachedThreshold = {200}
                />
        )
    },
    /**
     * Function which renders a single item for the listview
     * @param  {[Object]} item [The single item of the dataset]
     * @return {[View]}      [The rendered item using the associated mashups schemas in the stores ]
     */
    renderItem: function (item) {

        return (
            <TouchableOpacity
                onPress={() => this._pressRow(item.node)}>
                <View>
                    <ViewBuilder
                        type = 'list'
                        item = {item.node}
                        style = {styles.listItem}

                        />
                    <View style={styles.separator}/>
                </View>
            </TouchableOpacity>
        )
    },
    renderLoadingView: function () {
        if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <Icon.ToolbarAndroid
                        style = {styles.toolbar}
                        title = "Results"
                        titleColor="white"
                        navIconName = 'arrow-back'
                        onIconClicked={() => {
                            RouterActions.pop()
                        }}/>
                    <MKSpinner
                        style={styles.spinner}/>

                </View>
            )
        }
        return (
            <View style={styles.iosContainer}>
                <MKSpinner style={styles.spinner}/>
            </View>
        )
    },

    renderErrorView: function() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    No results
                </Text>
            </View>

        )
    },

    _pressRow: function (item) {

        //when a row gets pressed there is a push to the details page of the selected item
        RouterActions.details({itemSelected: item});
    },
});

module.exports = ResultsBuilder;
