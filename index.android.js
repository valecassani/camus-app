/**
* Android starting point for the CAMUS mobile app
*/
'use strict';

var React = require('react-native');


var {
    AppRegistry
} = React;

var App = require('./app');

/**
 * Class which contains all the application logic
 */
var CamusApp = React.createClass({
  render: function() {
   return (
     <App/>
   );
 }
});
// Registration of the component for the React Packager in order to execute the app

AppRegistry.registerComponent('camusapp', () => CamusApp);

module.exports = CamusApp;
