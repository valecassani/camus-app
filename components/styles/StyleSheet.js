
import React from 'react-native'
var {StyleSheet} = React
const status_color = "#00838F"
const primary_color = "#0097A7"

/**
 * Class which stores all the default styles of the application
 * @type {StyleSheet} The StyleSheet used in React implementation
 */
var styles = StyleSheet.create({
  transportIcon: {
      width: 36,
      height: 36,
      alignSelf: 'center',
      marginTop: 1
  },
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20
    },
    iosContainer: {
        backgroundColor: 'white',
        marginTop: 70
    },
    iosStatusBar:{
        color: 'black'
    },

    button: {
        backgroundColor: 'white',
        marginTop: 10,
        padding: 20

    },
    buttonMaterial: {
        height: 36,
        backgroundColor: primary_color,
        borderColor: primary_color,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'

    },
    appTitle: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',

    },
    contextTitle: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center'
    },

    containerTop: {
        flex: 1,
        marginTop: 80,
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    orangeButton: {
        height: 36,
        backgroundColor: '#0097A7',
        borderColor: '#0097A7',
        borderWidth: 1,
        borderRadius: 3,
        alignSelf: 'stretch',
    },
    toolbar: {
        backgroundColor: '#0097A7',
        height: 56,
        elevation: 10
    },
    listItem: {
        padding: 10,
        height: 56
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },
    statusBar: {
        backgroundColor: "#00838F"
    },
    paddedContainer: {
        padding: 20
    },
    maps: {
        width: 250,
        height: 300,
        alignSelf: 'center',
        marginTop: 20
    },
    containerLogin: {
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',
        padding: 30
    },
    spinner: {
        width: 50,
        height: 50,
        marginTop: 50,
        alignSelf: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight:'bold',
        alignSelf: 'center',
        color: 'black'
    },
    topicButton:{
        width:180,
        height: 180,
        padding: 30,
        borderColor: primary_color,
        backgroundColor: primary_color,
        borderWidth: 1,
        borderRadius: 3
    },
    topicText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'center'
    },
    externalLink: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
        borderColor: primary_color,
        borderWidth:1,
        borderRadius: 3
    },
    topicButtonAndroid:{
        width:150,
        height: 150,
        padding: 20,
        borderColor: primary_color,
        backgroundColor: primary_color,
        borderWidth: 1,
        borderRadius: 3
    },
    externalLinkText: {
        color: 'black',
        fontSize: 16
    },
    transportInfo: {
        color: 'black',
        fontSize: 16,
        alignSelf: 'center',
    },
    contextElement: {
        marginTop: 20
    },
    listItemTouchable: {
        height: 60
    },
    titleList: {
        fontSize: 16,
        fontWeight:'bold',
        color: 'black'
    }
})

export {
    status_color as STATUSBAR_COLOR,
    primary_color as PRIMARY_COLOR,
    styles
}
