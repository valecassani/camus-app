/**
 * Created by valeriocassani on 01/12/15.
 */

'use strict';

// Navigation bar is
var NavigationBar = require('react-native-navbar');
var React = require('react-native');
var {StyleSheet,View,ToolbarAndroid,Platform} = React;
var RouterActions = require('react-native-router-flux').Actions
var ViewStore = require('../stores/ViewStore')

var NavBarBase = React.createClass({
    getInitialState() {
        return {
            title: ViewStore.getState().currentTitle
        }
    },

    componentDidMount() {
        ViewStore.listen(this.onChange);
    },

    componentWillUnmount() {
        ViewStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState({
            title: state.currentTitle
        })
    },


    render() {
        console.log("Rendering navbar")
        // Using two rendering methods for the navigation bar
        // Rendering method for android os
        if (Platform.OS === 'android') {
            if (this.state.title === 'Home')
                return this.renderToolbarNoBackArrow(this.state.title);
            return this.renderToolbarBackArrow(this.state.title);

        } else {
            var titleConfig = {
                title: ViewStore.getState().currentTitle
            }
            if (ViewStore.getState().currentTitle === 'Home') {

                return (
                    <View style={{ height: 60}}>
                        <NavigationBar
                            title={titleConfig}
                            tintColor="#FFF"
                        />
                    </View>)
                    ;
            }
            var leftButtonConfig = {
                title: 'Back',
                handler: function onBack() {
                    RouterActions.pop();
                }
            };

            var rightButtonConfig = {
                title: 'Home',
                handler: function goHome() {
                    RouterActions.home();
                }
            };
            return (
                <View style={{ height: 60}}>
                    <NavigationBar
                        title={titleConfig}
                        leftButton={leftButtonConfig}
                        rightButton={rightButtonConfig}
                        tintColor="#FFF"
                    />
                </View>)

            return <View/>;


        }


    },

    // Render method of the toolbar in the main page
    renderToolbarNoBackArrow(toolbarTitle){
        console.log("Rendering ToolbarAndroid")
        return (
            <ToolbarAndroid
                title={toolbarTitle}
                style={styles.toolbar}>

            </ToolbarAndroid>
        )

    },

    // Render method of the toolbar in the other page

    renderToolbarBackArrow(toolbarTitle){
        return (
            <ToolbarAndroid
                title={toolbarTitle}
                style={styles.toolbar}

            />
        );
    }

})
class NavBar extends React.Component {
    render() {
        return <NavBarBase customNext={<View/>} {...this.props}/>
    }
}


class NavBarModal extends React.Component {
    render() {
        return <NavBarBase customPrev={<View/>} nextTitle="Close" {...this.props}/>
    }
}

var styles = StyleSheet.create({
    navBar: {
        backgroundColor: '#FFFFFF'
    },
    toolbar: {
        backgroundColor: '#66FFFF',
        height: 56,
        elevation: 10
    }
});


module.exports = {NavBar, NavBarModal};
