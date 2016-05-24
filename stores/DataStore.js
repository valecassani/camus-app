var alt = require('../alt');
var DataActions = require('../actions/DataActions');
var ViewStore = require('../stores/ViewStore')
var _ = require('lodash')

var skeletonsToDelete = {
	"context":[
			{
			"topics":[
				"Restaurant","Hotel","Theater","Museum","Cinema"
			],
			"contents": [
				{
					"type":"text",
					"contents":"InterestTopic"
				},
				{
					"type":"text",
					"contents":"Transport"
				}
			]

		}
	],


	"list":[
		{
			"topics": [
				"Restaurant","Hotel","Theater","Museum","Event"
				]
				,

			"contents":[


				{
					"type":"text",
					"contents":"title",
					"style":{
						"fontSize":16,
						"fontWeight":"bold",
						"color":"green"
					}
				},
				{
					"type":"text",
					"contents":"address"
				}
			]

		},
		{
			"topics": [
				"Cinema"
				]
				,

			"contents":[


				{
					"type":"text",
					"contents":"title"

				},
				{
					"type":"text",
					"contents":"address"
				}



			]

		}
		],

	"details":[{
			"topics": [
				"Cinema","Hotel","Theater","Museum","Event"
				]
				,

			"contents":[


				{
					"type":"text",
					"contents":"title"

				},
				{
					"type":"text",
					"contents":"address"
				},
				{
					"type":"map",
					"contents":[
						"latitude",
						"longitude"]
				},
				{
					"type":"phoneNumber",
					"contents":"telephone"
				},
				{
					"type":"website",
					"contents":"website"
				},
				{
					"type":"email",
					"contents":"email"
				},
				{
					"type":"support",
					"contents":"support"
				},
				{
					"type":"text",
					"contents":"meta"
				}
			]

		},
	{
		"topics": ["Restaurant"],


		"contents":[
			{
				"type":"text",
				"contents":"title"
			},
			{
				"type":"text",
				"contents":"address"
			},
			{
				"type":"map",
				"contents":[
					"longitude","latitude"
					]
			},
			{
					"type":"text",
					"contents":"email"
			},
			{
				"type":"support",
				"contents":"transport"

			},
			{
					"type":"text",
					"contents":"meta"
			}



		]
	}]	
}

//Store which handles the views and the user position in the app
class DataStore {
    //constructor of ViewStore
    constructor() {
        //initialization of stores
        //skeletons is the object with all the views to be rendered

        //errorMessage handles the errors
        //binder of actions to stores
        this.bindListeners({
            //listener to view updater
            handleUpdateResults: DataActions.updateResults,
            //listener to view fetch from server
            handleFetchResults: DataActions.fetchResults,
            //listener to error event
            handleResultsFailed: DataActions.resultsFailed,

            handleFetchFullCdt: DataActions.fetchFullCdt,

            handleUpdateFullCdt: DataActions.updateFullCdt,

            handleUpdateIdCdt : DataActions.updateIdCdt,
            handleUpdateTopic : DataActions.updateTopic,
            handleUpdateResultsPaginated : DataActions.updateResultsPaginated

        });

        this.state = {
            results : [],
            fullCdt : [],
            errorMessage : null,
            idCdt : null,
            currentTopic: null
        }
    }
/**
 * Function which updates the store with a paginated query
 * @param  {[type]} newResults [description]
 * @return {[type]}            [description]
 */
    handleUpdateResults(newResults) {
        //store the skeletons

        var oldResults = this.state.results
        _.find(oldResults,{topic: this.state.currentTopic}).results = newResults
    }

    handleFetchResults() {
        // reset the array while we're fetching new data
        this.setState({
            results : []
        })
    }

    handleResultsFailed(errMsg) {
        this.setState({
            errorMessage : errMsg
        })
    }

    handleFetchFullCdt() {
        this.setState({
            fullCdt: []
        })
    }

    handleUpdateFullCdt(newCdt) {
        console.log("CDT CHANGED");
        console.log(newCdt)

        this.setState({
            fullCdt : newCdt
        })
        this.updateDataStores()
    }

    handleUpdateIdCdt(newId) {
        console.log("IDCDT ARRIVED")
        this.setState({
            idCdt : newId
        })
    }

    updateDataStores() {
        console.log("Entering in update data stores")
        console.log(this.state.fullCdt)
        var interestTopics = _.find(this.state.fullCdt.context,{name:"InterestTopic"}).values
        _.each(interestTopics,item => {
            item = {
                topic: item,
                results: null
            }
            this.state.results.push(item)
        })
        console.log("DATA STORE UPDATED")
        console.log(this.state.results)
    }

    handleUpdateTopic(newTopic){
        this.setState({
            currentTopic : newTopic
        })
    }

    handleUpdateResultsPaginated(results) {
        var oldResults = this.state.results
        var oldDataSet = _.find(oldResults,{topic: this.state.currentTopic}).results.primaryResults.edges
        var newData = oldDataSet.concat(results.primaryResults.edges)
        var newCursor = results.primaryResults.pageInfo.endCursor
        var newHasNextPage = results.primaryResults.pageInfo.hasNextPage
        _.find(oldResults,{topic: this.state.currentTopic}).results.primaryResults.edges = newData
        _.find(oldResults,{topic: this.state.currentTopic}).results.primaryResults.pageInfo.endCursor = newCursor
        _.find(oldResults,{topic: this.state.currentTopic}).results.primaryResults.pageInfo.hasNextPage = newHasNextPage
    }


}

module.exports = alt.createStore(DataStore, 'DataStore');
