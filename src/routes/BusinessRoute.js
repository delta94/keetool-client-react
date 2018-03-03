import CompanyContainer from "../modules/companies/CompanyContainer";
import CreateCompanyContainer from "../modules/companies/CreateCompanyContainer";
import PaymentContainer from "../modules/payment/PaymentContainer";
import CreatePaymentContainer from "../modules/payment/CreatePaymentContainer";
import PrintOrderContainer from "../modules/printOrder/PrintOrderContainer";
import CreatePrintOrderContainer from "../modules/printOrder/CreatePrintOrderContainer";
import ExportOrderContainer from "../modules/Zgroup/exportGood/ExportOrderContainer";
import CreateExportOrderContainer from "../modules/Zgroup/exportGood/CreateExportOrderContainer";
import CreateOrderedGood from "../modules/Zgroup/orderedGood/CreateOrderedGood";
import HistoryDebtContainer from "../modules/historyDebt/HistoryDebtContainer";
/**
 * Tab Kinh Doanh
 */
export default [
    {
        path: "/business/companies",
        component: CompanyContainer,
    },
    {
        path: "/business/company/create",
        component: CreateCompanyContainer,
    },
    {
        path: "/business/company/edit/:companyId",
        component: CreateCompanyContainer,
        type: "edit"
    },
    {

        path: "/business/company/payment/edit/:paymentId",
        component: CreatePaymentContainer,
        type: "edit"
    },
    {
        path: "/business/company/payment/create",
        component: CreatePaymentContainer,
    },
    {
        path: "/business/company/payments",
        component: PaymentContainer,
    },
    {
        path: "/business/print-order",
        component: PrintOrderContainer,
    },
    {
        path: "/business/print-order/create",
        component: CreatePrintOrderContainer,
    },
    {
        path: "/business/print-order/edit/:printOrderId",
        component: CreatePrintOrderContainer,
    },
    {
        path: "/business/export-order",
        component: ExportOrderContainer,
    },
    {
        path: "/business/export-order/create",
        component: CreateExportOrderContainer,
    },
    {
        path: "/business/export-order/edit/:exportOrderId",
        component: CreateExportOrderContainer,
    },
    {
        path: "/business/ordered-good/create",
        component: CreateOrderedGood,
    },
    {
        path: "/business/history-debt",
        component: HistoryDebtContainer,
    },
];
