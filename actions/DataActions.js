var alt = require('../alt');
var QUERY = 'http://valeriocassani.altervista.org/output.json';

var dbID = '568f7a1215528e750da98053';
var ConnectionManager = require('../utilities/ConnectionManager');

var responseFromServer;

class DataActions {
    // Method to update results in stores
    updateResults(topic,results) {
        return function(dispatch) {
            dispatch(topic,results)
        };
    }

    fetchResults() {
        return function(dispatch) {
            // We dispatch an event here so we can have "loading" state.
            // dispatch();
            // Fetching the json of the views

            ConnectionManager.makeGetRequest(QUERY);
            fetch(QUERY)
            // Convert JSON response to javascript object
                .then((response) => {
                    if (_.isUndefined(response)) {
                        // Restore array in store to an empty one, in order to avoid data not refreshing if
                        // no results from server
                        initArray = [];
                        this.updateResults(initArray);
                    } else {
                        response.json();
                    }
                })
                .then((responseJSON) => {
                    // we can access other actions within our action through `this.actions`
                    this.updateResults(responseJSON);
                })
                // catch error of connection or parsing
                .catch((errorMessage) => {
                    this.resultsFailed(errorMessage);
                });
        };
    }

    fetchResultsFromContext(topic) {
        return function(dispatch) {
            dispatch();
            var mockContext = null;
            ConnectionManager.makePostRequest(topic);
        }
    }




    //method to show errors
    resultsFailed(errorMessage) {
        return errorMessage;;
    }

    //method to fetch full cdt
    fetchFullCdt(linkCdt) {
        return function(dispatch) {
            // dispatch an event in order to have "loading" state.
            dispatch();

            ConnectionManager.makeGetRequestCdt(linkCdt);

        };
    }

    updateFullCdt(cdt) {
        return function(dispatch) {
            dispatch(cdt);
        };
    }

    updateIdCdt(id) {
        console.log("UPDATE ID CDT")
        console.log(id)
        return function(dispatch) {
            dispatch(id)
        }
    }

    pressItemHome(selected) {
        switch (selected) {
            case 'restaurants':

                break;
            default:

        }
    }

    updateTopic(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    updateResultsPaginated(results) {
        return function(dispatch) {
            dispatch(results)
        }
    }

    updateViews(values) {
        return function(dispatch) {
            dispatch(values)
        }
    }
}

module.exports = alt.createActions(DataActions);
