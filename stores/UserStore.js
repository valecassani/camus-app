var alt = require('../alt');
var UserActions = require('../actions/UserActions');
var _ = require('lodash');
//Store which handles the views and the user position in the app
class UserStore {
    //constructor of ViewStore
    constructor() {
        //initialization of stores
        //skeletons is the object with all the views to be rendered

        //errorMessage handles the errors
        //binder of actions to stores
        this.bindListeners({
            //listener to view updater
            handleUpdateEmail: UserActions.updateEmail,
            //listener to view fetch from server
            handleUpdatePassword: UserActions.updatePassword,
            //listener to error event
            handleUpdateUserID: UserActions.updateUserID,

            handleUpdateToken: UserActions.updateToken

        });
        // TODO aggiungere costruzione dinamica dei valori basandosi sul cdt
        // Per adesso rimane una soluzione molto cablata
        this.state = {
            email: null,
            token: null,
            password: null,
            userID: null
        }
    }

    handleUpdateToken(value) {
        console.log(value)
        this.setState({
            token : value
        })
    }

    handleUpdatePassword(value) {
        this.setState({
            password : value
        })

    }

    handleUpdateEmail(value) {
        this.setState({
            email : value
        })
    }

    handleUpdateUserID(value) {
        console.log("USER ID")
        console.log(value)
        this.setState({
            userID: value
        })
    }
}

module.exports = alt.createStore(UserStore, 'UserStore');
