var alt = require('../alt');
var ViewActions = require('../actions/ViewActions')
var DataActions = require('../actions/DataActions')

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
class ViewStore {
        //constructor of ViewStore
        constructor() {
            //initialization of stores
            //skeletons is the object with all the views to be rendered
            this.state = {
                skeletons : skeletonsToDelete,
                errorMessage : null,
                //errorMessage handles the errors
            currentInterestTopic : null,
            currentTitle: 'Home'

        };

        //binder of actions to stores
        this.bindListeners({
            //listener to view updater
            handleUpdateViews: DataActions.updateViews,
            //listener to error event
            handleViewsFailed: ViewActions.viewsFailed,
            handleSelectInterestTopic: ViewActions.selectInterestTopic,
            handleSetCurrentTitle: ViewActions.setCurrentTitle
        });
    }

    handleUpdateViews(newSkeletons) {
        //store the skeletons
        this.setState({skeletons : newSkeletons});

    }

    handleFetchViews() {
        // reset the array while we're fetching new locations so React can
        // be smart and render a spinner for us since the data is empty.

    }

    handleViewsFailed(errMsg) {
        this.setState({
            errorMessage : errMsg
        });
    }

    handleSelectInterestTopic(selectedTopic){
        this.setState({
            currentInterestTopic: selectedTopic
        });
    }

    handleSetCurrentTitle(newTitle) {
        this.setState({
            currentTitle : newTitle
        })
    }
}

module.exports = alt.createStore(ViewStore, 'ViewStore');
