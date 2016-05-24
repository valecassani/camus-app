var alt = require('../alt');
var ConnectionManager = require('../utilities/ConnectionManager');

/**
 * Class which renders
 */
class ViewActions {
    setViews(views) {
        return function(dispatch){
            dispatch(views);
        };
    }    

    //method to show errors
    viewsFailed(errorMessage) {
        return errorMessage;;
    }

    // Action to select interest topic
    selectInterestTopic(selectedTopic) {
        return selectedTopic;;

    }

    setCurrentTitle(title) {
        return function(dispatch) {
            dispatch(title)
        }

    }

}

module.exports = alt.createActions(ViewActions);
