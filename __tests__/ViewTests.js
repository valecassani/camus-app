/**
 * Created by valeriocassani on 26/11/15.
 */
jest.dontMock('../stores/ViewStore.js')
jest.dontMock('../actions/ViewActions.js')

//class for the testing of the actions and stores related to the view managing

describe('Actions: storeActions', function () {
    describe('# Test of interest topics', function () {
        // First very simple example test
        it('Test of selection of interest topics', function() {
            var ViewActions = require('../actions/ViewActions')
            var ViewStore = require('../stores/ViewStore')
            ViewActions.selectInterestTopic('restaurant');
            var newTopic = ViewStore.getState().currentInterestTopic;
            expect(newTopic).toEqual('restaurant');
        })
    });


});
