/**
* Created by valeriocassani on 01/12/15.
*
* Class which manages the connection with the server
* TODO Export the implementation of the server links to this class, managing data refresh.
*
*
*/
'use strict'


var now = require("performance-now")
import ViewActions from '../actions/ViewActions';
var DataActions = require("../actions/DataActions");
var DataStore = require("../stores/DataStore")
var ViewStore = require("../stores/ViewStore")
var UserStore = require("../stores/UserStore")
var UserActions = require("../actions/UserActions")
var Actions = require('react-native-router-flux').Actions;
var React = require("react-native");
var {Alert} = React;
var _ = require('lodash');
var Promise = require('bluebird')

var myHeaders = new Headers();
myHeaders.append('pragma', 'no-cache');
myHeaders.append('cache-control', 'no-cache');

var mockContext = null

var myInit = {
    method: 'GET',
    headers: myHeaders,

};

const endpoint = require('../config').endpoint;
console.log("ENDPOINT")
console.log(endpoint)
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
    transport: new Transport(endpoint)
});


/**
*	Function which makes the initial GraphQL Query to the server
*	@param views The views of the details page
*	@param topic The current user interest topic
*	@param context The context selected by the user
*	@param previousCursor The last item rendered in the previous results
*/

exports.makeInitialDataRequest = function makeInitialDataRequest(views,topic,context) {
    var contextString = mapContext(context);
 // Parsing of the requested data from the views
    console.log("VIEWS FOR MAKE FIRST REQUEST")
    console.log(views)
    var dataResults = parseDataTypesGraph(views,topic);

    var supportServices = "Transport";
    var supportObject = ["category","service","url"];

    var supportResults = parseViewItems(supportObject);
    console.log(supportResults)
    console.log(contextString)
    var idCdt = DataStore.getState().idCdt;
    var mail = UserStore.getState().email;
    console.log("IDCDT")
    console.log(idCdt)
    var start = now()

    var query = `
        {
            executeQuery(
                userMail: "${mail}",
                idCdt:"${idCdt}",
                context:[${contextString}],
                support:["${supportServices}"]
            )
            {
                primaryResults (first: 9) {
                    edges {
                        node {
                            ${dataResults}
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
                supportResults {
                    data {
                            ${supportResults}
                    }
                }

            }
        }

        `
        console.log("LOGGING QUERY")
        console.log(query)
    // creation of GraphQL Query
    client.query(query).then(resultJSON => {
            var end = now()
            console.log("TIME PROFILER")
            console.log(start.toFixed(3))
            console.log((end-start).toFixed(3))
            // funzione provvisoria
            DataActions.updateResults(resultJSON.executeQuery);
        }).catch(error => {
            console.log(error);
            DataActions.resultsFailed(error.rawError)
        });
    }
    function makeGetRequest(URL) {
        setTimeout(fetch(URL,myInit)

        // Convert JSON response to javascript object
        .then((response) => {
            response.json()
        })
        .then((responseJSON) => {
            // We can access other actions within our action through `this.actions`
            DataActions.updateResults(responseJSON);
        })
        // catch error of connection or parsing
        .catch((errorMessage) => {
            DataActions.resultsFailed(errorMessage);
        }),1);

    }

/**
 * Function which makes the other (not 1st) GraphQL Query to the server
 *	@param views The views of the details page
 *	@param topic The current user interest topic
 *	@param context The context selected by the user
 *	@param cursor The last item rendered in the previous results
 */
exports.makeAfterGraphRequest = function makeRequest(views,topic,context,cursor){
    var contextString = mapContext(context);
 // Parsing of the requested data from the views
    var dataResults = parseDataTypesGraph(views,topic);

    var supportServices = "Transport";
    var supportObject = ["category","service","url"];

    var supportResults = parseViewItems(supportObject);
    console.log("PRE AFTER QUERY")
    console.log(supportResults)
    console.log(contextString)
    var idCdt = DataStore.getState().idCdt;
    var mail = UserStore.getState().email
    // creation of GraphQL Query
    client.query(`
        {
            executeQuery(
                userMail: "${mail}",
                idCdt:"${idCdt}",
                context:[${contextString}],
                support:["${supportServices}"]
            )
            {
                primaryResults (first: 9, after: "${cursor}" ) {
                    edges {
                        node {
                            ${dataResults}
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
                supportResults {
                    data {
                            ${supportResults}
                    }
                }

            }
        }

        `).then(resultJSON => {
            // funzione provvisoria
            DataActions.updateResultsPaginated(resultJSON.executeQuery);
        }).catch(error => {
            console.log(error);
            DataActions.resultsFailed(error.rawError)
        });

    }

/**
* Function to build the string array of object compatible with Lokka
* @param context: the context to be converted
* @return the parsed string
*/
    function mapContext(context) {
        var toReturn = null
        if (_.isArray(context)) {
            toReturn = context.map(inJson => {
                return '{'+parseJson(inJson)+'},';
            });
        } else {
            console.log(toReturn);
            toReturn = '{'+parseJson(context)+'}'
        }
        return toReturn;
    }

/**
 * Function which converts a Javascript object into a Lokka GraphQL compatible one
 * @param  {[Object]} incomingObject [The incoming object to be converted in string]
 * @return {String}        [The String equivalent to the object and ready for the GraphQL query]
 */
    function parseJson(incomingObject) {
        // initialization with an empty string
        var newString = '';
            for (var key in incomingObject) {
                if (incomingObject.hasOwnProperty(key) ) {
                    if (Number.isInteger(key)) {
                        return newString;
                    }
                    if (_.isArray(incomingObject[key])) {
                        newString += key +':[' + mapContext(incomingObject[key]) + ']';
                    }
                    else {
                        newString += key + ':' + '"' +incomingObject[key] +'"'  +',';
                    }
                }
            }
        return newString;
    }

/**
 * Convert the skeletons of the details items to String parseable to GraphQL
 * @param  {Object} skeletons [The skeletons of the view in the application]
 * @param  {String} topic     [The current interest topic selected by the user]
 * @return {String}           [The terms for the GraphQL primaryResults object]
 */
    function parseDataTypesGraph(skeletons,topic) {
        console.log(skeletons)
        var skeletonSelected = skeletons["details"];

        // Picks the skeleton which correpsond to the requested topic
        console.log(topic)
        console.log(skeletonSelected)
        var current =_.find(skeletonSelected, {'topics': [topic]}).contents;
        // Avoids data removing
        var currentToModify = _.clone(current)
        currentToModify.splice(current.indexOf('meta'))
        currentToModify.splice(current.indexOf('support'))
        var toReturn = parseViewItems(currentToModify);
        toReturn += "\nmeta {\n rank\n name}\n"
        return toReturn;
    }

    /**
     * Parser of the view items of the parseDataTypesGraph function
     * @param  {Object} current [The skeletons of the current interest topic]
     * @return {[type]}         [description]
     */
    function parseViewItems(current) {
        var toReturn = ''

        toReturn = current.reduce((output,item) => {
                // if the function is an array, a new call to the process is
                if (_.isArray(item.contents)) {
                    return output+=parseViewItems(item.contents)+'\n';
                }

                var elem = null;
                if (_.has(item, 'contents')) {
                    elem = item.contents;
                } else {
                    elem = item;
                }
                var stringToReturn
                return output+=elem+'\n';
            },'')
        return toReturn.substr(0, toReturn.length-1);
    }
// Exports of the functions in the file
exports.parseDataTypesGraph = parseDataTypesGraph;

/**
 * Function which manages the Login with server
 * @param  {String} mail     [The email address of the user]
 * @param  {String} password [The password of the user]
 */
exports.login = function login(mail,password) {

    client.query(`
        {
            login (mail: "${mail}", password: "${password}") {
                token
            }
        }
    `)
        .then((results) => {

            UserActions.updateUserID(results.login.id)
            UserActions.updateToken(results.login.token)
            this.getCDT()
        })
        .catch(error => {
            console.log(error)
            Alert.alert(
                  'Login Error',
                  error.message,
                  [
                    {text: 'Press to close', onPress: () => console.log('OK Pressed')},
                  ]
                )
            Actions.refresh()

        })

}

/**
 * Function which fetches the CDT and the views of the mashups
 */
exports.getCDT = function getCDT() {
    var mail = UserStore.getState().email
    var token = UserStore.getState().token
    client.query(`{
        getPersonalData(mail: "${mail}", token: "${token}") {
            cdt {
      idCdt
      context {
        name
        values
        parameters {
          name
          type
          fields {
            name
          }
        }
        parents
      }
      defaultValues {
        dimension
        value
      }
    }
    mashup {
      list {
        topics
        contents {
          type
          style
          contents
        }
      }
      details {
        topics
        contents {
          type
          style
          contents
        }
      }
    }
  }
}`)
        .then(results => {
            console.log("RESULTS")
            console.log(results);
            DataActions.updateIdCdt(results.getPersonalData.cdt.idCdt);
            DataActions.updateFullCdt(results.getPersonalData.cdt)
            DataActions.updateViews(results.getPersonalData.mashup)
            Actions.loggedIn()

        })
        .catch(error => {
            console.log(error)
            Alert.alert(
                  'Problem with connection',
                  error.message,
                  [
                    {text: 'Press to close', onPress: () => console.log('OK Pressed')},
                  ]
                )
            // Launch a refresh of the LoginPage removing the spinner
            Actions.refresh()


        })
}

/**
 * Function which manages the queries to the support services
 * @param  {String} URL [The URL of the operation to be called]
 */
exports.querySupport = function querySupport(URL) {
    console.log(URL)
    var resultsToReturn
    return new Promise (function(resolve,reject) {
        fetch(URL)
        .then((response) => response.json())
        .then((resultsJSON) => {
            console.log("RESULTS FROM SUPPORT")
            console.log(resultsJSON)
            resolve = resultsJSON
        })
        .catch(err => console.log(err))
    }
    )

}
