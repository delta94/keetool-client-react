import React from "react";
import {observer} from "mobx-react";
import AnalyticsComponent from "./AnalyticsComponent";
@observer
class AnalyticsContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.data =
            [
                {
                    col:12,
                    name:"Session by country",
                    query: {
                        metrics: 'ga:sessions',
                        dimensions: 'ga:country',
                        // 'max-results': 10,
                        sort: '-ga:sessions'
                    },
                    chart: {
                        type: 'GEO',
                        options: {
                            width: '100%'
                        }
                    }
                },
                {
                    name:"AVG time on page",
                    query: {
                        metrics: 'ga:timeOnPage',
                        dimensions: 'ga:pagePath',
                        sort: '-ga:timeOnPage'
                    },
                    chart: {
                        type: 'PIE',
                        options: {
                            width: '100%',
                            pieHole: 4 / 9
                        }
                    }
                },
                {
                    name:"Session by browser",
                    query: {
                        metrics: 'ga:sessions',
                        dimensions: 'ga:browser',
                        'max-results': 10,
                        sort: '-ga:sessions'
                    },
                    chart: {
                        type: 'PIE',
                        options: {
                            width: '100%',
                            pieHole: 4 / 9
                        }
                    }
                },
                {
                    name:"Session by system",
                    query: {
                        metrics: 'ga:sessions',
                        dimensions: 'ga:operatingSystem',
                        'max-results': 10,
                        sort: '-ga:sessions'
                    },
                    chart: {
                        type: 'PIE',
                        options: {
                            width: '100%',
                            pieHole: 4 / 9
                        }
                    }
                },
                // {
                //     query: {
                //         metrics: 'ga:sessions',
                //         dimensions: 'ga:date'
                //     },
                //     chart: {
                //         type: 'LINE',
                //         options: {
                //             width: '100%'
                //         }
                //     }
                // },

            ];


    }

    componentDidMount() {

    }




    render() {
        return (
            <div>

                <AnalyticsComponent
                    data={this.data}
                />
            </div>

        );
    }
}

AnalyticsContainer.propTypes = {};

export default AnalyticsContainer;
