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
    Linking,
    TouchableHighlight,
    TouchableNativeFeedback,
    StatusBar,
    Image
} = React;

var RouterActions = require('react-native-router-flux').Actions;
// Custom component for build buttons (per adesso)
var Button = require('react-native-button');
import {PRIMARY_COLOR,styles} from './styles/StyleSheet'
// Lodash library
var _ = require('lodash');

// Necessary components to the homepage
var ViewStore = require('../stores/ViewStore');
import UserActions from '../actions/UserActions'
import UserStore from '../stores/UserStore'
import ConnectionManager from '../utilities/ConnectionManager'
var t = require('tcomb-form-native');
import {MKButton,MKColor,MKSpinner} from 'react-native-material-kit'


var Form = t.form.Form;

var LoginData = t.struct({
    email: t.String,
    password: t.String,
})



// Results page which is pushed when the topic is selected
//
// (per adesso, poi la pagina da chiamare è la pagina per arricchire il contesto)
var LoginPage = React.createClass({
    getInitialState: function() {
        var email = UserStore.getState().email
        var password = UserStore.getState().password
        if (_.isNull(email) || _.isNull(password)) {
            return {
                email: '',
                password: '',
                errorMessage: '',
                loading: false
            }
        }
        return {
            errorMessage: '',
            email: email,
            password: password,
            loading: false
        }
    },
    componentDidMount: function() {
        this.setState({
            loading: false,
            errorMessage: ''
        })
    },

    componentWillUnmount: function() {
        this.setState({
            loading: false,
            errorMessage: ''
        })
    },

    componentWillReceiveProps: function() {
        this.setState({
            loading:false,
            errorMessage: ''
        })
    },

    onPress: function () {
        // call getValue() to get the values of the form

        var value = this.refs.form.getValue();
        if (value) {
            // if validation fails, value will be null
            UserActions.updateEmail(value.email)
            UserActions.updatePassword(value.password)
            this.setState({
                loading:true
            })
            ConnectionManager.login(value.email,value.password)

                // TODO promise when login finish
        } else {

            this.setState({
                errorMessage: 'Check the inserted values',
                loading: false
            })
        }


    },

    renderSpinner: function() {
        if (this.state.loading === true) {
            return <MKSpinner style={styles.spinner}/>
        }
        return <View/>
    },

    render: function() {

        var options = {
            fields: {
                email: {
                    keyboardType:'email-address',
                    autoCapitalize:'none',
                    autoCorrect: false,
                    defaultValue: this.state.email
                },
                password: {
                    secureTextEntry:true,
                    password:true,
                    defaultValue: this.state.password
                }
            }
        }
        if (Platform.OS === 'android') {
            return(

                <View
                    style={styles.containerLogin}>
                    <StatusBar
                        translucent={true}/>
                    <Text style={styles.appTitle}>CAMUS</Text>
                    <Form
                        ref="form"
                        type={LoginData}
                        options={options}
                        >

                    </Form>
                    <MKButton
                        style={styles.buttonMaterial}
                      shadowRadius={2}
                      shadowOffset={{width:0, height:3}}
                      shadowOpacity={0.9}
                      shadowColor="black"
                      onPress={this.onPress}
                      >
                      <Text pointerEvents="none"
                            style={styles.buttonText}>
                            Login
                      </Text>
                    </MKButton>
                    {this.renderSpinner()}

                    <Text style={{
                            alignSelf : 'center',
                            color: 'red'
                        }}>
                        {this.state.errorMessage}
                    </Text>
                </View>
            )


        }
        return(
            <View
                style={styles.containerLogin}
                >
                    <Text style={styles.appTitle}>CAMUS</Text>
                    <Form
                        ref="form"
                        type={LoginData}
                        options={options}
                        >

                    </Form>
                    <MKButton
                        style={styles.buttonMaterial}
                      shadowRadius={2}
                      shadowOffset={{width:0, height:3}}
                      shadowOpacity={0.9}
                      shadowColor="black"
                      onPress={this.onPress}
                      >
                      <Text pointerEvents="none"
                            style={styles.buttonText}>
                            Login
                      </Text>
                    </MKButton>
                    {this.renderSpinner()}
                    <Text style={{
                            alignSelf : 'center',
                            color: 'red'
                        }}>
                        {this.state.errorMessage}
                    </Text>




            </View>
        )
    },
    checkFields: function() {
        if (_.isNull(this.state.email) || _.isNull(this.state.password)) {
            this.setState({
                email: '',
                password: ''
            })
        }
    }

});

module.exports = LoginPage;
