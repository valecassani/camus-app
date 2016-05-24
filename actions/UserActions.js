var alt = require('../alt');

class UserActions {
    // Method to update results in stores
    updateEmail(value) {
        return function(dispatch) {
            dispatch(value)
        };
    }

    updatePassword(value) {
        return function(dispatch) {
            dispatch(value)
        };
    }
    updateToken(value) {
        return function(dispatch) {
            dispatch(value)
        };
    }
    updateUserID(value) {
        return function(dispatch) {
            dispatch(value)
        };
    }
}

module.exports = alt.createActions(UserActions);
