/**
 * Created by valeriocassani on 26/11/15.
 */
var viewData = {
    "list":[
        {
            "topics": [
                "restaurants"
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

        },
        {
            "topics": [
                "movies"
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
        "topics": ["movies"],


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
                "type":"text",
                "contents":"longitude"

            }

        ]
    },
        {
            "topics": ["restaurants"],


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
                }

            ]
        }]



} ;

module.exports.viewData = viewData;

var resultsFromServer = {
    "results":[
        {
            "title" : "National Restaurant Association",
            "address" : "2301 S. Lake Shore Drive",
            "latitude" : "41.854092",
            "longitude" : "-87.6127372"
        },
        {
            "title" : "Henhouse Prowlers",
            "address" : "3855 N. Lincoln Avenue",
            "latitude" : "41.95200420392062",
            "longitude" : "-87.67706629881133"
        },
        {
            "title" : "Bar Beverage Alchohol for Restaurants",
            "address" : "2301 S. Lake Shore Drive",
            "latitude" : "41.854092",
            "longitude" : "-87.6127372"
        },
        {
            "title" : "The Holiday Fashion Show, 4th Chicago LOLC event",
            "address" : "330NHALSTED",
            "latitude" : "41.8878798",
            "longitude" : "-87.6476293"
        },
        {
            "title" : "Henhouse Prowlers - & Friends",
            "address" : "3855 N. Lincoln Avenue",
            "latitude" : "41.95200420392062",
            "longitude" : "-87.67706629881133"
        },
        {
            "title" : "Henhouse Prowlers",
            "address" : "3855 N. Lincoln Avenue",
            "latitude" : "41.95200420392062",
            "longitude" : "-87.67706629881133"
        },
        {
            "title" : "Louder Than A Mom",
            "address" : "3855 N. Lincoln Avenue",
            "latitude" : "41.95200420392062",
            "longitude" : "-87.67706629881133"
        },
        {
            "title" : "Luncheon Program: Meeting Realty Executives from China (Chicago)",
            "address" : "N Michigan Ave & E Lake St.",
            "latitude" : "41.8849",
            "longitude" : "-87.6239"
        },
        {
            "title" : "Professional Women’s Club of Chicago Hosts Luncheon “Energy, Health and You with Karyn Calabrese”",
            "address" : "65 West Jackson Boulevard",
            "latitude" : "41.8780314",
            "longitude" : "-87.6299027"
        },
        {
            "title" : "Le Meridien Chicago - Oakbrook Center offer the ultimate Holiday Shopping Happy Hour",
            "address" : "2100 Spring Road",
            "latitude" : "41.8361",
            "longitude" : "-87.9649"
        }

    ]
};

var fullCdt = {

}
module.exports.resultsFromServer = resultsFromServer;


