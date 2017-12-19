import React from 'react';
import AppContainer from "../../containers/AppContainer";
import NotFoundPage from "../../components/NotFoundPage";
import {Route} from "react-router";
// import Routes from "./routes/ManufactureRoute";
// import DashboardContainer from "./modules/dashboard/DashboardContainer";


export default (InputRoutes) => (
    <Route path="/" component={AppContainer}>
        {/*<IndexRoute component={DashboardContainer}/>*/}
        {/*<Route path="/manage/dashboard" component={DashboardContainer}/>*/}
        {
            InputRoutes && InputRoutes.map((route) => <Route {...route}>
                {
                    route.children && route.children.map((routeChild) => <Route {...routeChild}/>)
                }
            </Route>)
        }
        {/*<Route path="login" component={LoginContainer}/>*/}
        <Route path="*" component={NotFoundPage}/>
    </Route>
);
