import RequestMoneyContainer from "../modules/Zgroup/request/requestMoney/RequestMoneyContainer";
import RequestVacationContainer from "../modules/Zgroup/request/requestVacation/RequestVacationContainer";
import CreateRequestVacationContainer from "../modules/Zgroup/request/requestVacation/CreateRequestVacationContainer";
import CreateRequestMoneyContainer from "../modules/Zgroup/request/requestMoney/CreateRequestMoneyContainer";
import WeekendReportContainer from "../modules/Zgroup/weekendReport/WeekendReportContainer";
import AddReportContainer from "../modules/Zgroup/weekendReport/AddReportContainer";
import ContractContainer from "../modules/Zgroup/contract/ContractContainer";
import CreateContractContainer from "../modules/Zgroup/contract/CreateContractContainer";

/**
 * Tab Hanh Chinh
 */
export default [
    {
        path: "/administration/request/money/create",
        component: CreateRequestMoneyContainer,
    },
    {
        path: "/administration/request/money/edit/:requestId",
        component: CreateRequestMoneyContainer,
    },
    {
        path: "/administration/request/vacation/create",
        component: CreateRequestVacationContainer,
    },
    {
        path: "/administration/request/vacation/edit/:requestId",
        component: CreateRequestVacationContainer,
    },
    {
        path: "/administration/request/money",
        component: RequestMoneyContainer,
    },
    {
        path: "/administration/request/vacation",
        component: RequestVacationContainer,
    },
    {
        path: "/administration/weekend-report",
        component: WeekendReportContainer,
    },
    {
        path: "/administration/weekend-report/create",
        component: AddReportContainer,
    },
    {
        path: "/administration/weekend-report/edit/:reportId",
        component: AddReportContainer,
    },
    {
        path: "/administration/contract",
        component: ContractContainer,
    },
    {
        path: "/administration/contract/create",
        component: CreateContractContainer,
    },
    {
        path: "/administration/contract/edit/:contract_id",
        component: CreateContractContainer,
    },
];
