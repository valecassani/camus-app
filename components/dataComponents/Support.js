'use strict'

import React,{
    View,
    Text,
    Linking,
    LinkingIOS,
    TouchableHighlight,
    Platform,
    ListView,
    Image
} from 'react-native'
import {styles,PRIMARY_COLOR} from '../styles/StyleSheet'
var ConnectionManager = require('../../utilities/ConnectionManager')
var ContextHelper = require('../../utilities/ContextHelper')
import ContextStore from '../../stores/ContextStore'

import {MKButton,MKColor,MKSpinner} from 'react-native-material-kit'

var key = "AIzaSyBlW7hyT58AaLoEaJOZP7xk_O26_ii6XfE"

var BASIC_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?language=en&';

var mode ="driving"; //default mode (Null/WithCar)
var icon = "car"; // default icon (Null/WithCar)

var MOCKED_DATA = [
  {distance: '...', duration: "..."}];

var SupportTransport = React.createClass({
    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            loaded: true
        };
    },

    render: function() {
        if (!_.isEmpty(this.props.link.data)) {
            console.log("STARTING RENDERING LIST")
            return (
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
                        Go to Maps App
                    </Text>
                </MKButton>
            )
        }
        return <View></View>
    },

    onPress: function(){
        var url = null
        if (Platform.OS === 'android') {
            url = 'waze://?ll='+this.props.coordinates.latitude+','+this.props.coordinates.longitude+'&navigate=yes'
        } else {
            url = 'http://maps.apple.com/?ll='+this.props.coordinates.latitude+','+this.props.coordinates.longitude+'&dirflg=d&t=r'

        }
        url = 'comgooglemaps://?center='+this.props.coordinates.latitude+','+this.props.coordinates.longitude+'&zoom=14&views=traffic'
        console.log(url)
        Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
                if (Platform.OS === 'android') {
                    url = 'market://details?id=com.waze'
                } else {
                 }
                Linking.openURL(url)
              } else {
                return Linking.openURL(url);
              }
            }).catch(err => console.error('An error occurred', err));


    },

    renderItem: function(item) {
        console.log("ITEM TO BE RENDERED CONTEXT")
        console.log(item)
        return (
            <Text>
                {item.name}
            </Text>
        )
    },

    buildLink: function(url) {


        return url


    }


})

var SupportTimeTransport = React.createClass({

    getInitialState: function() {

      var item = this.props.item;
      var objects = this.props.skeleton;
      var dataTransport = ContextStore.getState().transport;
      var dataTipology = ContextStore.getState().tipology;


      if (dataTransport==="PublicTransport") {
        switch (dataTipology) {

          case null:
          mode ="transit";
          icon = "bus";
            break;

          case "Bus":
          mode ="transit&transit_mode=bus";
          icon = "bus";
            break;

          case "Train":
          mode ="transit&transit_mode=train";
          icon = "railway";
              break;

          default: //default  (Taxi, CarSharing, WithDriver)
          mode ="driving";
          icon = "car";
        }
      }

      var URL = BASIC_URL+'origins='+ContextStore.getState().location.latitude+','+ContextStore.getState().location.longitude+'&destinations='+item.latitude+','+item.longitude+'&mode='+mode+'&key='+key

  //Official GitHub Material-Design-Icons repository
      var iconPath = 'https://raw.githubusercontent.com/google/material-design-icons/master/maps/drawable-xhdpi/ic_directions_'+icon+'_black_18dp.png'

      return {
        data: MOCKED_DATA[0],
        RequestURL: URL,
        iconURL: iconPath
      };
    },


    componentDidMount: function() {
      this.fetchData();
    },

    fetchData: function() {
      fetch(this.state.RequestURL)
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.status === "OK"){
          this.setState({
            data: { distance: responseData.rows[0].elements[0].distance.text, duration: responseData.rows[0].elements[0].duration.text },
          });
        }else{
    // ELSE
    }
        })
        .done();
    },

    onPress: function(){
        var item = this.props.item; //ADDED
        var url = null
        if (Platform.OS === 'android') {
          //url = 'waze://?ll='+ContextHelper.getCurrentLocation().latitude+','+ContextHelper.getCurrentLocation().longitude+'&navigate=yes'
          url = 'google.navigation://?q='+item.latitude+','+item.longitude+'&mode='+mode+'&key='+key

        } else {
            url = 'http://maps.apple.com/?daddr='+item.latitude+','+item.longitude+'&dirflg=d&t=r'

        }
        console.log(url)
        Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
                if (Platform.OS === 'android') {
                    url = 'market://details?id=com.waze'
                } else {
                 }
                Linking.openURL(url)
              } else {
                return Linking.openURL(url);
              }
            }).catch(err => console.error('An error occurred', err));


    },
    render: function() {
        var item = this.props.item;
        return (
            <View>
                <Image style={styles.transportIcon} source={{uri: this.state.iconURL}} />
                <Text style={styles.transportInfo}>
                  {this.state.data.distance+"\n"+this.state.data.duration}
                </Text>

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
                        Start navigation
                  </Text>
                </MKButton>
            </View>

        )
    }
})

module.exports = SupportTransport
module.exports = SupportTimeTransport
