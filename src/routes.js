import React from 'react';
import {Route, IndexRoute} from 'react-router';
import LoginContainer from './containers/LoginContainer';
import AppContainer from './containers/AppContainer';
import DashboardContainer from './containers/DashboardContainer';
import RegisterListContainer from './containers/RegisterListContainer';
import CollectMoneyContainer from './containers/financialManager/CollectMoneyContainer';
import ManageStaffsContainer from './containers/manageStaff/ManageStaffsContainer';
import AddStaffContainer from './containers/manageStaff/AddStaffContainer';
import EditStaffContainer from './containers/manageStaff/EditStaffContainer';
import ManageRoleContainer from './containers/role/ManageRoleContainer';
import CreateRoleContainer from './containers/role/CreateRoleContainer';
import NotFoundPage from './components/NotFoundPage';
import BasesContainer from "./modules/bases/BasesContainer";
import CreateBaseContainer from "./modules/bases/CreateBaseContainer";

export default (
    <Route>
        <Route path="/" component={AppContainer}>
            <IndexRoute component={DashboardContainer}/>
            <Route path="register-list" component={RegisterListContainer}/>
            <Route path="collect-money" component={CollectMoneyContainer}/>
            <Route path="manage/quan-li-nhan-su" component={ManageStaffsContainer}/>
            <Route path="add-staff" component={AddStaffContainer}/>
            <Route path="staff/:staffId/edit" component={EditStaffContainer}/>
            <Route path="manage-role" component={ManageRoleContainer}/>
            <Route path="create-role" component={CreateRoleContainer}/>
            <Route path="base/list" component={BasesContainer}/>
            <Route path="base/create" component={CreateBaseContainer}/>
            <Route path="base/edit/:baseId" component={CreateBaseContainer}/>
        </Route>
        <Route path="login" component={LoginContainer}/>
        <Route path="*" component={NotFoundPage}/>
    </Route>
);
