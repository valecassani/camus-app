var alt = require('../alt');
import _ from 'lodash'

class ContextActions {
    // Method to update results in stores
    setLocation(value) {
        return function(dispatch) {
            if (!_.isUndefined(value)) {
                console.log("READY TO DISPATCH")
                console.log(value)
                dispatch(value)
            }
        };
    }

    setKeyword(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    setTransport(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    setTipology(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    addForbidden(value) {
        return function(dispatch) {
            dispatch(value);
        }
    }

    removeForbidden(value) {
        return function(dispatch) {
            dispatch(value);
        }
    }

    updateLastContext(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    setCuisine(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

    setBudget(value) {
        return function(dispatch){
            dispatch(value)
        }
    }

    setContext(value) {
        return function(dispatch) {
            dispatch(value)
        }
    }

}

module.exports = alt.createActions(ContextActions);
