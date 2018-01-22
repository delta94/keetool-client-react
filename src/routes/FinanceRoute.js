import CollectMoneyContainer from "../modules/collectMoney/CollectMoneyContainer";
import HistoryCollectMoneyContainer from "../modules/historyCollectMoney/HistoryCollectMoneyContainer";
import CurrencyContainer from "../modules/currency/CurrencyContainer";
import BankTransfersContainer from "../modules/finance/BankTransfersContainer";

/**
 * Tab Quản lý tài chính
 */
export default [
    {
        path: "/finance/moneycollect",
        component: CollectMoneyContainer
    },
    {
        path: "/finance/paidlist",
        component: HistoryCollectMoneyContainer
    },
    {
        path: "/finance/currencies",
        component: CurrencyContainer
    },
    {
        path: "/finance/bank-transfers",
        component: BankTransfersContainer
    }
];
