var alt = require('../alt');
var ContextActions = require('../actions/ContextActions');
var _ = require('lodash');
//Store which handles the views and the user position in the app
class ContextStore {
    //constructor of ViewStore
    constructor() {
        //initialization of stores
        //skeletons is the object with all the views to be rendered

        //errorMessage handles the errors
        //binder of actions to stores
        this.bindListeners({
            handleSetLocation: ContextActions.setLocation,
            handleSetTransport: ContextActions.setTransport,
            handleSetKeyword: ContextActions.setKeyword,

            handleSetTipology: ContextActions.setTipology,

            handleAddForbidden: ContextActions.addForbidden,

            handleRemoveForbidden: ContextActions.removeForbidden,
            handleUpdateLastContext: ContextActions.updateLastContext

        });
        // TODO aggiungere costruzione dinamica dei valori basandosi sul cdt
        // Per adesso rimane una soluzione molto cablata
        this.state = {
            location: null,
            transport: null,
            keyword: null,
            tipology: null,
            forbidden: [],
            lastContext: null
        }
    }

    handleSetLocation(value) {
        this.setState({
            location : value
        })
    }

    handleSetKeyword(value) {
        this.setState({
            keyword : value
        })

    }

    handleSetTipology(value) {
        this.setState({
            tipology : value
        })
    }

    handleSetTransport(value) {
        this.setState({
            transport: value
        })
    }

    handleAddForbidden(value) {
        _.forEach(value, val => {
            if (!(_.includes(this.state.forbidden, val))) {
                this.state.forbidden.push(val)
            }
        })
    }

    handleRemoveForbidden(value) {
        if (this.state.forbidden.length > 0) {
            this.setState({
                forbidden: this.state.forbidden.splice(forbidden.indexOf(value),1)
            })
        }
    }

    handleUpdateLastContext(value) {
        this.setState({
            lastContext : value
        })
    }
}

module.exports = alt.createStore(ContextStore, 'ContextStore');
