/**
 * Created by valeriocassani on 26/11/15.
 */
'use strict'


import _ from 'lodash';
_.mixin(require("lodash-deep"));

import ViewStore from '../stores/ViewStore';
import DataStore from '../stores/DataStore';
import Communications from 'react-native-communications';
import Button from 'react-native-button';
import Maps from './dataComponents/Maps';

// Call Intent for android
import AndroidCallIntent from 'react-native-callintent';
import ContextActions from '../actions/ContextActions';
// Graphical elements required from the function buildView

import LocationPicker from './contextComponents/LocationPicker';
import SupportTimeTransport from './dataComponents/Support'

import React from 'react-native'
import {
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    TextInput,
    Platform,
    PickerIOS,
    AlertIOS,
    LinkingIOS,
    Linking,
    Switch,
    ScrollView,
    TouchableOpacity

} from 'react-native';
import {styles,PRIMARY_COLOR} from './styles/StyleSheet'

import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import Estylo from 'react-native-estylo';
import ExternalLink from './dataComponents/ExternalLink'
// Web Intent for android devices


/**
 * Class which builds ordered graphical elements where:
 * @param skeleton is the object which contains the elements to be rendered
 * @param item is the single data object to be rendered
 */

var ViewBuilder = React.createClass({

    getInitialState: function() {
        var curTopic = ViewStore.getState().currentInterestTopic

        if (this.props.type === 'details') {
            if (!(_.isNull(DataStore.getState().results))){
                var resultss = _.find(DataStore.getState().results,{topic: curTopic }).results
                return {
                    viewState: ViewStore.getState(),
                    location : "Keyword",
                    transport: "WithCar",
                    currentInterestTopic: curTopic,
                    support : resultss.supportResults
                }
            }
        }
        return {
            viewState: ViewStore.getState(),
            location : "Keyword",
            transport: "WithCar",
            currentInterestTopic: curTopic,
            support : null

        }
    },

    componentDidMount: function () {
        ViewStore.listen(this.onChangeView);
        DataStore.listen(this.onChangeData)
    },

    componentWillUnmount: function () {
        ViewStore.unlisten(this.onChangeView);
        DataStore.unlisten(this.onChangeData)
    },

    onChangeView(state) {
        this.setState({
            viewState: state,
            currentInterestTopic: state.currentInterestTopic
            });
    },

    onChangeData(state) {
        var currentTopic = this.state.currentInterestTopic
        if (!(_.isNull(state.results))){
            var resultss = _.find(state.results,{topic: currentTopic }).results
            if (!(_.isNull(resultss)) ) {
                this.setState({
                    support : resultss.supportResults
                })
                console.log("STATE UPDATED WITH SUPPORTS")
                console.log(this.state.support)
                console.log(this.state)
            }
        }

    },

    render: function() {
        var rowsToReturn = null;


        // Two rendering functions, one for the context building and one for the results building
        if (this.props.type === 'context') {
            rowsToReturn = this.buildContextView(current);
            var _scrollView: ScrollView;

            return <View style={(Platform.OS === 'android') ? styles.container : styles.containerIos }>
                        {rowsToReturn}
                    </View>;
        } else {

            var skeleton = this.state.viewState.skeletons[this.props.type];

            // Picks the skeleton which correpsond to the requested topic
            var current = _.find(skeleton, {'topics': [this.state.currentInterestTopic]}).contents;
            rowsToReturn = this.buildResultsView(current,this.props.item);
        }
        // Enclosing of the returned array of views in an external view

        return (
            <View style={styles.container}>
                    {rowsToReturn}
            </View>);

    },
/**
 * Function which builds the views for the results
 * @param  {[Object]} skeleton [The ordered schema of the views]
 * @param  {[Object]} item     [The item to be rendered]
 * @return {[View]}          [The array of rendered views]
 */
    buildResultsView: function(skeleton, item){
        //map function generates the rows


        var rows =  _.map(skeleton, (viewElement, index) => {
            // TODO adding the recursive call function HERE

            // Switch which manages the type of the rendered component
            switch (viewElement.type) {
                // Rendering a text item
                // Maybe functions too long, better use a reorganization of functions
                case 'text':
                    var text;
                    // Check if it is defined the style for the element
                    if (_.includes(viewElement.contents,'meta')) {
                        return <View key={index}/>
                    }
                    var currentContent = _.head(viewElement.contents)
                    if (_.isUndefined(item)) {
                        return <Text key={index}>{text}</Text>;
                    }

                    if (_.isNull(item[currentContent])) {
                        return <View key={index}/>
                    }

                    if (this.props.type === 'list' && item[currentContent].length > 40) {
                        text = item[currentContent].slice(0,40) + '...'
                    } else {
                        text = item[currentContent]
                    }

                    // if no external style attributes, return the default content style
                    if (_.isNull(viewElement.style)) {
                        if (this.props.type === 'list') {
                            return <Text key={index} style={_.get(styles,currentContent+"List")}>{text}</Text>;
                        }
                        return <Text key={index} style={_.get(styles,currentContent)}>{text}</Text>;


                    }


                    return <Text key = {index} style={viewElement.style}>{text}</Text>;

                //rendering a map directly in the app
                case 'map':

                    // If longitude or latitude are undefined returns and empty view
                    if (_.isUndefined(item['latitude']) || _.isUndefined(item['longitude'])){
                        return <View key={index}/>;
                    }
                    // Rendering of the Maps module
                    return <Maps
                                key = {index}
                                latitude = {parseFloat(item['latitude'])}
                                longitude = {parseFloat(item['longitude'])}
                                style = {styles.maps}
                                title = {item['title']}/>
                // Call intent for android works, for iOS it's not possible to test using emulator.
                case 'phoneNumber':

                    if (_.isUndefined(item['telephone']) || _.isNull(item['telephone'])) {
                        return <View key={index}/>
                    }
                    return (
                        <ExternalLink
                            type = {viewElement.type}
                            content = {item["telephone"]}
                            key = {index}/>

                            );
                case 'website':
                    if (_.isUndefined(item['website']) || _.isNull(item['website'])) {
                        return <View key = {index}/>;
                    }
                    return (
                        <ExternalLink
                            key = {index}
                            type = {viewElement.type}
                            content={item['website']}/>

                    )
                    break;
                case 'email':
                    if (_.isUndefined(item['email']) || _.isNull(item['email'])) {
                        return <View key = {index}/>;
                    }
                    return (
                        <ExternalLink
                            key = {index}
                            type = {viewElement.type}
                            content={item['email']}/>

                    )
                    break;

                case 'support':
                    console.log(this.state)
                    if (_.isUndefined(this.state.support)) {
                        return <View key = {index}/>
                    }
                    console.log("SUPPORT MODULE")
                    console.log(this.state.support)
                    return (
                        <View
                            key = {index}
                        />)

                    break;


                default:
                    return <View key={index}/>;


            }

        });

        if (this.props.type === 'details') {
            return (
                <View style = {this.props.style}>
                    {rows}
                    <SupportTimeTransport
                        item = {this.props.item}/>
                </View>);
        }
        return (
            <View style = {this.props.style}>
                {rows}
            </View>);
    },

/**
 * Function which build the context selection page
 * @param  {[Object]} skeleton The views coming from the mashups
 * @return {[View]}   The rendered context views for the ContextSelectionPage
 */
    buildContextView:function(skeleton) {
        var cdt = this.props.cdt;

        var rows =  _.map(cdt, (cdtElement, index) => {
            // Switch which manages the type of the rendered component
            switch (cdtElement.name) {

                case 'Keyword':
                    return (
                        <View key = {index}>
                            <Estylo.TextInput
                                class = 'stacked'
                                label = 'Search'
                                onChangeText = { ( value ) => {
                                    ContextActions.setKeyword(value)}}
                                placeholder = 'Search'
                                />
                        </View>
                    );

                case 'Transport':
                var pickerData = ["WithCar", "PublicTransport"]
                    return (
                        <View key = {index}>
                            <Text style={styles.contextTitle}>{cdtElement.name}</Text>
                                <SegmentedControls
                                  options={pickerData}
                                  tint= {PRIMARY_COLOR}
                                  selectedTint= {'white'}
                                  selectedBackgroudColor={PRIMARY_COLOR}
                                  backTint= {'white'}
                                  onSelection={ (option) => {
                                      this.setState({transport: option});
                                      ContextActions.setTransport(this.state.transport);
                                  } }
                                  selectedOption={this.state.transport}
                                />
                        </View>
                    )
                case 'Typology':
                    //TODO Add pluck function in case of public transport
                    if (this.state.transport === 'PublicTransport') {
                        var pickerItems = cdtElement.values;

                        return(
                            <View key = {index} style = {styles.contextElement}>
                                <Text style={styles.contextTitle}>{cdtElement.name}</Text>
                                    <SegmentedControls
                                        direction={'column'}
                                        options={pickerItems}
                                        tint= {PRIMARY_COLOR}
                                        selectedTint= {'white'}
                                        selectedBackgroudColor={PRIMARY_COLOR}
                                        backTint= {'white'}

                                        onSelection={(option)=> {

                                            ContextActions.setTipology(option)
                                            ContextActions.addForbidden(cdtElement.parents)
                                            this.setState({
                                                tipology: option
                                            })
                                            }
                                        }
                                        selectedOption={this.state.tipology}
                                    />
                            </View>
                        )
                    }
                    break;
                case 'Cuisine':
                    var pickerData = cdtElement.values;
                    return (
                        <View key = {index}>
                            <Text style={styles.contextTitle}>{cdtElement.name}</Text>
                                <SegmentedControls
                                  options={pickerData}
                                  tint= {PRIMARY_COLOR}
                                  selectedTint= {'white'}
                                  selectedBackgroudColor={PRIMARY_COLOR}
                                  backTint= {'white'}
                                  onSelection={ (option) => {
                                      this.setState({cuisine: option});
                                      ContextActions.setCuisine(this.state.cuisine);
                                  } }
                                  selectedOption={this.state.cuisine}
                                />
                        </View>
                    )
                case 'Budget':
                    var pickerData = cdtElement.values
                    return (
                        <View key = {index}>
                            <Text style={styles.contextTitle}>{cdtElement.name}</Text>
                                <SegmentedControls
                                  options={pickerData}
                                  tint= {PRIMARY_COLOR}
                                  selectedTint= {'white'}
                                  selectedBackgroudColor={PRIMARY_COLOR}
                                  backTint= {'white'}
                                  onSelection={ (option) => {
                                      this.setState({budget: option});
                                      ContextActions.setBudget(this.state.cuisine);
                                  } }
                                  selectedOption={this.state.budget}
                                />
                        </View>
                    )
                case 'Context':
                var pickerData = cdtElement.values
                return (
                    <View key = {index}>
                        <Text style={styles.contextTitle}>{cdtElement.name}</Text>
                            <SegmentedControls
                              options={pickerData}
                              tint= {PRIMARY_COLOR}
                              selectedTint= {'white'}
                              selectedBackgroudColor={PRIMARY_COLOR}
                              backTint= {'white'}
                              onSelection={ (option) => {
                                  this.setState({context: option});
                                  ContextActions.setContext(this.state.context);
                              } }
                              selectedOption={this.state.context}
                            />
                    </View>
                )


                default:
                    return <View key={index}/>;
                    break;
            }
        });

        return (
            <View style = {this.props.style}>
                {rows}
            </View>);

    }

});

module.exports = ViewBuilder;
