import React from 'react-native'
import {View, StyleSheet, Text} from 'react-native'
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons'
import Estylo from 'react-native-estylo';
import ContextActions from '../../actions/ContextActions'
import _ from 'lodash'
/**
 * Class which renders the location picker
 */
var LocationPicker = React.createClass({

    getInitialState: function() {
        return {
            pickedValue: this.props.startingValue,
        }
    },

    render: function() {
        var pickerData = _.map(this.props.pickerData, (item) => {
            return item.name
        })
        if (this.state.pickedValue === 'CityName') {
            return (
                <View>
                    <Text style={styles.title}>Location</Text>
                    <View style={{marginTop: 10, padding: 20, backgroundColor: 'white'}}>
                        <SegmentedControls
                          options={pickerData}
                          onSelection={(option) => {this.setState({pickedValue: option})}}
                          selectedOption={this.state.pickedValue}
                        />
                    <Estylo.TextInput
                        class = 'stacked'
                        label = 'City Name'
                        onChangeText = { ( value ) => ContextActions.setLocation(value)}
                        placeholder = 'City Name'
                        />
                    </View>


                </View>

            )


        }
            return (
                <View>
                    <Text style={styles.title}>Location</Text>
                    <View style={{marginTop: 10, padding: 20, backgroundColor: 'white'}}>
                        <SegmentedControls
                          options={pickerData}
                          onSelection={ (option) => {
                              this.setState({pickedValue: option})
                              ContextActions.setLocation(null);
                          }}
                          selectedOption={this.state.pickedValue}
                        />
                    </View>


                </View>

            )
    }

});

var styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center'

    },

});

module.exports = LocationPicker;
