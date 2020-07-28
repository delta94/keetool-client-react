import DashboardItContainer from "../modules/dashboard/it/DashboardItContainer";
import DashboardStaffContainer from "../modules/dashboardStaff/DashboardStaffContainer";
import DashboardTrongDongContainer from "../modules/dashboardTrongDong/DashboardTrongDongContainer";
import LogRegisterRoom from "../modules/logRegisterRoom/LogRegisterRoom";
import DashboardStudyPackContainer from "../modules/dashboardStudyPack/DashboardContainer";
import SettingContainer from "../modules/setting/SettingContainer";
import DashboardMarketingContainer from "../modules/dashboard/dashboardMarketing/DashboardMarketingContainer";
import DashboardLeadsComponent from "../modules/dashboard/dashboardMarketing/DashboardLeadsComponent";
import DashboardRegisterComponent from "../modules/dashboard/dashboardSale/DashboardRegisterComponent";
import DashboardKpiComponent from "../modules/dashboard/dashboardSale/DashboardKpiComponent";
import DashboardClassComponent from "../modules/dashboard/dashboardSale/DashboardClassComponent";
import DashboardSaleContainer from "../modules/dashboard/dashboardSale/DashboardSaleContainer";
import DashboardCourseComponent from "../modules/dashboard/dashboardSale/DashboardCourseComponent";
import DashboardAcademyContainer from "../modules/dashboard/dashboardAcademy/DashboardAcademyContainer";
import DashboardAcademyComponent from "../modules/dashboard/dashboardAcademy/DashboardAcademyComponent";
import DashboardExamComponent from "../modules/dashboard/dashboardAcademy/exams/DashboardExamComponent";
import DashboardClassLessonEventComponent
    from "../modules/dashboard/dashboardAcademy/classLessonEvents/DashboardClassLessonEventComponent";
import DashboardRealRevenueComponent from "../modules/dashboard/dashboardSale/DashboardRealRevenueComponent";
import DashboardContainer from "../modules/dashboard/DashboardContainer";
import DashboardCheckInOutContainer from "../modules/dashboard/dashboardCheckinCheckout/DashboardCheckInOutContainer";
import DashboardHistoryClassComponent
    from "../modules/dashboard/dashboardCheckinCheckout/DashboardHistoryClassComponent";
import DashboardHistoryWorkShiftComponent
    from "../modules/dashboard/dashboardCheckinCheckout/DashboardHistoryWorkShiftComponent";
import DashboardHistoryShiftComponent
    from "../modules/dashboard/dashboardCheckinCheckout/DashboardHistoryShiftComponent";


/**
 * Tab trang chủ
 */
export default [
    {
        path: "/dashboard/sale",
        component: DashboardSaleContainer,
        children: [
            {
                path: "/",
                component: DashboardRegisterComponent,
            },
            {
                path: "kpi",
                component: DashboardKpiComponent,
            },
            {
                path: "class",
                component: DashboardClassComponent,
            },
            {
                path: "course",
                component: DashboardCourseComponent,
            },
            {
                path: "real-revenue",
                component: DashboardRealRevenueComponent,
            }
        ]
    },
    {
        path: "/dashboard/checkin-checkout",
        component: DashboardCheckInOutContainer,
        children: [
            {
                path: "/",
                component: DashboardHistoryClassComponent,
            },
            {
                path: "work-shift",
                component: DashboardHistoryWorkShiftComponent,
            },
            {
                path: "shift",
                component: DashboardHistoryShiftComponent,
            },
        ]
    },
    {
        path: "/dashboard/it",
        component: DashboardItContainer
    },
    {
        path: "/dashboard/old",
        component: DashboardContainer
    },
    {
        path: "/dashboard/study-pack",
        component: DashboardStudyPackContainer
    },
    {
        path: "/dashboard/staff",
        component: DashboardStaffContainer
    },
    {
        path: "/dashboard/view-register",
        component: DashboardTrongDongContainer
    },
    {
        path: "/dashboard/log-register-room",
        component: LogRegisterRoom
    },
    {
        path: "/setting",
        component: SettingContainer
    },
    {
        path: "/dashboard/marketing",
        component: DashboardMarketingContainer,
        children: [
            {
                path: "/",
                component: DashboardLeadsComponent,
            },
        ]
    },
    {
        path: "/dashboard/academy",
        component: DashboardAcademyContainer,
        children: [
            {
                path: "/",
                component: DashboardAcademyComponent,
            },
            {
                path: "exams",
                component: DashboardExamComponent,
            },
            {
                path: "events",
                component: DashboardClassLessonEventComponent,
            },
        ]
    },

];
