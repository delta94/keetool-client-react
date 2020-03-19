import LeadContainer from "../modules/lead/LeadContainer";
import TicketContainer from "../modules/tickets/TicketContainer";

/**
 * Tab Chăm sóc khách hàng
 */

export default [
    {
        path: "/customer-services/my-leads",
        type: "my-leads",
        component: LeadContainer
    },
    {
        path: "/customer-services/leads",
        component: LeadContainer
    },
    {
        path: "/customer-services/distribution-leads",
        component: LeadContainer,
        type: "distribution"
    },
    {
        path: "/customer-services/tickets",
        component: TicketContainer,
        type: "distribution"
    },
];
