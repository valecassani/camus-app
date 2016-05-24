'use strict'

import React,{
    View,
    Text,
    Linking,
    LinkingIOS,
    TouchableHighlight,
    Platform
} from 'react-native'
import {styles,PRIMARY_COLOR} from '../styles/StyleSheet'
var Mailer = require('NativeModules').RNMail;
// Fix an error in loading app package in IOS
var SendIntentAndroid = (Platform.OS === 'android') ? require('react-native-send-intent') : null;

var Icon = require('react-native-vector-icons/FontAwesome')


var ExternalLink = React.createClass({
    render: function() {
        switch (this.props.type) {
            case 'phoneNumber':
                return this.renderPhone();
            case 'website':
                return this.renderWebsite();
            case 'email':
                return this.renderEmail();

        }
        return (
            <View/>
        )

    },

    renderPhone: function() {
        return (
            <View
                style={styles.externalLink}>
                <Text style={styles.externalLinkText}>
                    {this.props.content}
                </Text>
                <TouchableHighlight
                    onPress={() => {
                        this.call(this.props.content)
                    }}
                    style={{alignSelf: 'flex-end'}}>
                    <Icon name="phone" size={30} color={PRIMARY_COLOR} />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        this.message(this.props.content)
                    }}
                    style={{}}>
                    <Icon name="comments" size={30} color={PRIMARY_COLOR}/>
                </TouchableHighlight>

            </View>
        )
    },

    renderWebsite: function() {
        return (
            <View

                style={styles.externalLink}>
                <Text style={styles.externalLinkText}>
                    {this.props.content}
                </Text>
                <TouchableHighlight
                    onPress={
                        () => {
                                Linking.openURL(this.props.content)
                                .catch(err => console.error('An error occurred', err))
                        }
                    }
                    style={{alignSelf: 'flex-end'}}>
                    <Icon style={{flex:1, padding:20}} name="safari" size={30} color={PRIMARY_COLOR} />
                </TouchableHighlight>
            </View>
        )

    },

    renderEmail: function() {
        return (
            <View

                style={styles.externalLink}>
                <Text style={styles.externalLinkText}>
                    {this.props.content}
                </Text>
                <TouchableHighlight
                    onPress={
                        () => {
                            this.sendMail(this.props.content)
                        }
                    }>
                    <Icon style={{flex:1, padding:20}} name="safari" size={30} color={PRIMARY_COLOR} />
                </TouchableHighlight>
            </View>
        )

    },
    call: function(number) {
        (Platform.OS === 'android') ? SendIntentAndroid.sendPhoneCall(number) : alert("Call")

    },
    message: function(number) {
        (Platform.OS === 'android') ? SendIntentAndroid.sendSms(number, '') : alert("Message")

    },
    sendMail: function(mailTo) {
        Mailer.mail({
      subject: 'Prenotazione',
      recipients: [mailTo],
      body: '',
      attachment: {
        path: '',  // The absolute path of the file from which to read data.
        type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
        name: '',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
        if(error) {
          alert('Error', 'Could not send mail. Please send a mail to support@example.com');
        }
    });
    }
})

module.exports = ExternalLink
