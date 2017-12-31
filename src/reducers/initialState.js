export default {
    createProduct: {
        categories: [],
        manufactures: [],
        isUploadingAvatar: false,
        childImagesModal: false,
        child_index: 0,
        percent: 0,
        productWorking: {
            name: '',
            code: '',
            description: '',
            price: 0,
            avatar_url: '',
            sale_status: 0,
            highlight_status: 0,
            display_status: 0,
            goods_count: 0,
            manufacture_id: '',
            good_category_id: '',
            images_url: [],
            property_list: [
                {
                    name: 'coool',
                    property_item_id: 3,
                    value: []
                }
            ],
            children: []
        },
        goods_count_check: true,
        isUploadingImage: false,
        isLoading: false,
        avatar_url: '',
        properties_list: [],
        images: []
    },

    globalLoading: {
        isLoading: false
    },

    inventoryGood: {
        isLoading: false,
        isLoadingMore: false,
        isLoadingHistoryModal: false,
        isLoadingHistoryList: false,
        inventories: [],
        categories: [],
        manufactures: [],
        warehousesList: [],
        totalPages: 1,
        currentPage: 1,
        limit: 20,
        totalCount: 1,
        inventoryChecking: {
            histories: [],
            warehouses: [],
            inventoryInfo: {},
            totalPages: 0,
            currentPage: 0
        },
        historyModal: false,
        count: 0,
        totalImportMoney: 0,
        totalMoney: 0
    },

    productList: {
        products: [],
        productsTotal: 0,
        productsQuantity: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 20,
        totalCount: 1,
        isLoading: false,
        showWareHouse: true,
        modalInProduct: {
            priceModal: false,
            wareHouseModal: false,
            avatarModal: false,
            sameProductModal: false,
            isModalUpdating: false,
            modalUpdated: false
        },
        productEditing: {
            index: -1,
            productAvatar: {},
            productPrice: {},
            productPresent: {},
            good_category_id: -1,
            manufacture_id: -1,
            status: null,
            isUploadingAvatar: false,
            percent: 0
        },
        categories: [],
        manufactures: []
    },

    good: {
        barcode: {
            barcodeList: {
                barcodes: [],
                isLoading: false,
                currentPage: 1,
                totalPages: 0,
            },
            createBarcode: {
                showModal: false,
                barcode: {},
                isSaving: false
            }
        },
        attachPropertyItem: {
            showModal: false,
            isLoading: false,
            goodPropertyItems: [],
            task: {},
            isSaving: false,
            boards: [],
            selectedBoards: []
        },
        createProperty: {
            property: {},
            isLoading: false,
            isSaving: false
        },
        propertyItem: {
            propertyItems: [],
            isLoading: false
        },
        goodList: {
            goods: [],
            currentPage: 1,
            totalPages: 1,
            isLoading: false
        },
        createGood: {
            isLoading: false,
            good: {
                properties: [],
                files: []
            },
            percent: 0,
            percentCover: 0,
            isUploadingAvatar: false,
            isSaving: false,
            isUploadingCover: false,
            files: []
        }
    },
    login: {
        email: "",
        password: "",
        token: null,
        isLoading: false,
        error: false,
        user: {
            role: -1
        }
    },
    user: {},
    tabs: {
        tabListData: [],
        isLoading: true,
        error: false,
        allTabs: [],
        isLoadingAllTabs: false,
        errorAllTabs: false,
    },
    staffs: {
        staffListData: [],
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        addStaff: {
            staffForm: {
                name: '',
                username: '',
                email: '',
                phone: '',
                age: 0,
                address: '',
                homeland: '',
                marital: 0,
                literacy: 0,
                role: 0,
                start_company: new Date().toISOString().slice(0, 10),
                avatar_url: ''
            },
            isChangingAvatar: false,
            isLoading: false,
            error: false,
            isLoadingStaff: false,
            errorStaff: false,
            isResettingPassword: false,
            errorResetPassword: false,
        },
        editStaff: {
            isLoadingStaff: false,
            errorStaff: false,
            isLoadingUpdateStaff: false,
            errorUpdateStaff: false,
            isLoadingDeleteStaff: false,
            errorDeleteStaff: false,
            staff: {}
        },
        messageChangeRoleStaff: null,
        isLoadingChangeRoleStaff: false,
        errorChangeRoleStaff: false,
        messageChangeBaseStaff: null,
        isLoadingChangeBaseStaff: false,
        errorChangeBaseStaff: false,
        roles: {
            roleListData: [],
            isLoading: false,
            error: false,
        }, bases: {
            basesData: [],
            isLoading: false,
            error: false,
        },
        users: {
            userListData: [],
            isLoading: false,
            error: false,
            currentPage: 1,
            totalPages: 1
        },
        departments: [],
    },
    roles: {
        roleListData: [],
        tabs: {
            tabListData: [],
            isLoading: true,
            error: false,
            allTabs: [],
            isLoadingAllTabs: false,
            errorAllTabs: false,
        },
        isLoading: false,
        error: false,
        createRole: {
            isLoading: false,
            error: false,
        },
        editRole: {
            isLoadingRole: false,
            errorRole: false,
            isLoadingUpdateRole: false,
            errorUpdateRole: false,
        },
        roleForm: {
            role_title: ''
        },
        isLoadingDeleteRole: false,
        errorDeleteRole: false
    },

    baseList: {
        bases: [],
        isLoadingBases: false,
        currentPage: 1,
        totalPages: 1,
        createBase: {
            isSavingBase: false,
            isLoadingBase: false,
            base: {
                name: "",
                address: ""
            }
        }
    },

    book: {
        taskListTemplateModal: {
            showModal: false,
            boards: [],
            isLoading: false
        },
        taskSpan: {
            showModal: false,
            hours: 0,
            task: {
                span: 0
            },
            isSaving: false
        },
        taskListDetail: {
            showModal: false,
            taskList: {},
            isSaving: false,
            isSavingTask: false,
            showEditTaskModal: false,
            isLoading: false
        },
        taskLists: {
            taskLists: [],
            isLoading: false,
            currentPage: 0,
            totalPages: 0
        },
        addTaskList: {
            showModal: false,
            isSaving: false,
            taskList: {}
        }
    },

    task: {
        addChildGood: {
            good: {},
            taskId: 0,
            isSaving: false,
            showModal: false
        },
        archiveBoard: {
            showModal: false,
            boards: [],
            isLoading: false
        },
        personalSetting: {
            showModal: false,
            setting: {},
            isSaving: false,
            isLoading: false
        },
        taskDeadline: {
            showModal: false,
            isSaving: false,
            task: {}
        },
        addMemberToTask: {
            showModal: false,
            isLoading: false,
            members: [],
            task: {},
            isSaving: false,
            selectedMembers: []
        },
        commentCard: {
            value: "",
            attachments: []
        },
        archiveCard: {
            cards: [],
            isLoading: false,
            isEmpty: false,
            showModal: false
        },
        comment: {
            comments: []
        },
        projectDetail: {
            showModal: false,
            project: {},
            projectId: 0,
            isSaving: false,
            isLoading: false
        },
        manageLabel: {
            label: {},
            isSavingLabel: false
        },
        uploadAttachment: {
            files: []
        },
        addMember: {
            isLoading: false,
            members: [],
            search: ""
        },
        createTask: {
            isSavingTask: false,
            task: {}
        },
        createTaskList: {
            taskList: {},
            isLoading: false,
            taskLists: [],
            isSavingTaskList: false
        },
        cardDetail: {
            isSavingDeadline: false,
            isLoading: false,
            card: {},
            showModal: false,
            isSavingCard: false
        },
        askGoodProperties: {
            showModal: false,
            isSaving: false,
            goodPropertiesOutput: {},
            goodProperties: [],
            task: {},
            isLoading: false
        },
        createCard: {
            card: {},
            isSaving: false,
            showModal: false,
            board: {},
            isLoading: false,
            isLoadingTaskListTemplate: false,
            taskListTemplates: [],
            goodPropertyItems: []
        },

        boardList: {
            projectId: 0,
            members: [],
            boards: [],
            setting: {},
            isLoadingBoards: false,
            canDragCard: false,
            canDragBoard: false
        },

        createBoard: {
            showModal: false,
            board: {},
            isSaving: false
        },

        createProject: {
            project: {},
            isLoadingProject: false,
            isSavingProject: false
        },

        project: {
            projects: [],
            currentPage: 1,
            totalPages: 1,
            isLoadingProjects: false,
            isSaving: false
        }
    },
    register: {
        registerList: {
            registers: [],
            isLoadingRegisters: false
        }
    },

    emailTemplates: {
        templates: [],
        isLoading: false,
        error: false,
        isUpdatingThumbnail: false,
        updateThumbnailError: false,
        isSaving: false,
        savingError: false,
        currentPage: 1,
        totalPages: 1,
        emailTemplate: {
            id: 0,
            name: '',
            content: '',
            thumbnailUrl: '',
            owner: {},
            isLoading: false,
            error: false
        }
    },

    emailForms: {
        forms: [],
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        isUpdatingLogo: false,
        updateLogoError: false,
        isUpdatingAvatar: false,
        updateAvatarError: false,
        isSaving: false,
        isPreSaving: false,
        isSendingMail: false,
        errorSendMail: false,
        emailForm: {
            id: 0,
            name: '',
            logoUrl: '',
            title: '',
            subtitle: '',
            template: {},
            content: '',
            footer: '',
            avatarUrl: '',
            linkButton: '',
            titleButton: '',
            isLoading: false,
            error: false
        },
        emailTemplates: {
            templates: [],
            isLoading: false,
            error: false,
            currentPage: 1,
            totalPages: 1
        },
        subscribersList: [],
        isStoring: false,
        errorStore: false,
    },

    blog: {
        post: {
            isUpdatingImage: false,
            updateImageError: false,
            imageUrl: '',
            title: '',
            description: '',
            tags: '',
            category: 0,
            content: '',
            isSaving: false,
            saveError: false,
            isPreSaving: false,
            preSaveError: false,
            id: ''
        },
        categories: {
            categories: [],
            isLoading: false,
            error: false
        },
        category: {
            name: '',
            isCreating: false,
            error: false
        },
        isLoading: false,
        error: false,
        totalPages: 1,
        currentPage: 1,
        posts: [],
        isLoadingPost: false,
        errorPost: false,
    },
    registerStudents: {
        registers: [],
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        gens: [],
        currentGen: {},
        isLoadingGens: false,
        errorGens: false,
        historyCall: [],
        isLoadingHistoryCall: false,
        errorHistoryCall: false,
        isChangingStatus: false,
        errorChangeStatus: false,
        telecallId: 0,
        isChangingClass: false,
        errorChangeClass: false,
        isLoadingClasses: false,
        errorClasses: false,
        classes: [],
        isLoadingRegisters: false,
        isLoadingRegistersByStudent: false,
        errorRegistersByStudent: false,
        registersByStudent: [],
        classFilter: [],
        salerFilter: [],
        campaignFilter: [],
        isLoadingClassFilter: false,
        isLoadingSalerFilter: false,
        isLoadingCampaignFilter: false,
        excel: {},
        isLoadingExcel: false,
        isCommittingInfoStudent: false,
    },

    profile: {
        isLoading: false,
        profile: {
            current_role: {},
            start_company: new Date().toISOString().slice(0, 10),
        },
        error: false,
        isChangingAvatar: false,
        isSaving: false,
        savingError: false,
        isChangingPassword: false,
        errorChangePassword: false
    },

    studySession: {
        isLoading: false,
        error: false,
        studySessions: [],
        studySession: {
            start_time: '',
            end_time: ''
        },
        isSaving: false,
        errorSave: false,
        isEditing: false,
        errorEdit: false
    },

    scheduleClass: {
        isLoading: false,
        error: false,
        scheduleClasses: [],
        scheduleClass: {
            studySessionIds: []
        },
        isSaving: false,
        errorSave: false,
        isEditing: false,
        errorEdit: false,
        isLoadingStudySession: false,
        errorStudySession: false,
        studySessions: []
    },

    gens: {
        gens: [],
        isLoading: false,
        error: false,
        gen: {},
        isSaving: false,
        errorSave: false,
        isEditing: false,
        errorEdit: false,
        currentPage: 1,
        totalPages: 1
    },

    personalCalendar: {
        calendarEvents: [],
        isLoading: false
    },

    notification: {
        notificationList: {
            notifications: [],
            isLoading: false,
            isEmpty: false,
            unread: 0
        }
    },
    infoStudent: {
        student: {},
        isLoadingStudent: false,
        errorStudent: false,
        registers: [],
        isLoadingRegisters: false,
        errorRegisters: false,
        historyCalls: [],
        isLoadingHistoryCalls: false,
        errorHistoryCalls: false,
        progress: [],
        isLoadingProgress: false,
        errorProgress: false,
        isEditingStudent: false,
        errorEditing: false,
    },

    dashboard: {
        it: {
            dateArray: [],
            pointByDate: [],
            cardsByDate: [],
            isLoading: false
        },
        gens: [],
        isLoadingGens: true,
        errorGens: false,
        currentGen: {},
        bases: [],
        isLoadingBases: false,
        errorBases: false,
        dashboard: {},
        isLoading: true,
        error: false,
        class: {},
        isLoadingClass: false,
        errorClass: false,
        timeShifts: 0,
        dateShifts: '',
        timeClasses: 0,
        dateClasses: '',
        isLoadingAttendanceShifts: false,
        errorAttendanceShifts: false,
        isLoadingAttendanceClasses: false,
        errorAttendanceClasses: false,
    },

    collectMoney: {
        currentPage: 1,
        totalPages: 1,
        nextCode: '',
        nextWaitingCode: '',
        users: [],
        isLoading: false,
        error: false
    },
    historyCollectMoney: {
        currentPage: 1,
        totalPages: 1,
        registers: [],
        isLoading: false,
        error: false
    },
    historyCalls: {
        currentPage: 1,
        totalPages: 1,
        teleCalls: [],
        isLoading: false,
        error: false
    },
    classes: {
        excel: [],
        isLoadingExcel: false,
        currentPage: 1,
        totalPages: 1,
        classes: [],
        gens: [],
        isLoading: false,
        isLoadingGens: false,
        error: false,
        isLoadingInfoCreateClass: true,
        errorInfoCreateClass: false,
        infoCreateClass: {},
        isStoringClass: false,
        errorStoreClass: false,
        class: {},
        isLoadingClass: false,
        errorClass: false,
        isChangingClassLesson: false,
        errorChangeClassLesson: false,
        isLoadingStaffs: false,
        errorStaff: false,
        staffs: [],
        isChangingTeachingAssis: false,
        errorChangeTeachingAssis: false,
        isChangingTeacher: false,
        errorChangeTeacher: false,
    },

    rule: {
        ruleView: '',
        isLoading: false,
        error: false
    },

    cardFilter: {
        cardLabels: [],
        members: [],
        selectedCardLabels: [],
        selectedMembers: []
    },

    emailSubscribersList: {
        subscribersList: [],
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        isStoring: false,
        errorStore: false,
        subscribers: {
            subscribers: [],
            isLoading: false,
            error: false,
            currentPage: 1,
            totalPages: 1,
        },
        isLoadingAddEmails: false,
        errorAddEmails: false,
        isLoadingSubscribersListItem: false,
        errorSubscribersListItem: false,
        subscribersListItem: {},
    },

    emailCampaigns: {
        campaigns: [],
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        subscribersList: [],
        isStoring: false,
        errorStore: false,
        isLoadingForms: false,
        errorForms: false,
        forms: []
    },
    shiftRegisters: {
        isLoadingGensBases: false,
        errorGensBases: false,
        bases: [],
        gens: [],
        currentGen: {},
        isLoading: false,
        error: false,
        shiftRegisters: []
    },

    historyShiftRegisters: {
        currentPage: 1,
        totalPages: 1,
        shiftPicks: [],
        isLoading: false,
        error: false
    },
    shiftSessions: {
        isStoring: false,
        errorStore: false,
        shiftSessions: [],
        isLoading: false,
        error: false
    },


    categories: {
        addCategoriesModal: {
            isShowModal: false,
            isSaving: false,
            id: '',
            parent_id: '',
            name: '',
            isEdit: false,
        },
        isLoading: true,
        error: false,
        categoriesList: [],
    },

    goodOrders: {

        isUpdate: false,
        orderId: 0,
        shipGoodModal: false,
        isSendingShipOrder: false,
        shippedGoodResponse: {},
        shippingGood: {
            products: [],
            order: {
                id: "",
                pick_name: "Graphics",
                pick_address: "175 Chùa Láng",
                pick_province: "Hà Nội",
                pick_district: "Quận Đống Đa",
                pick_tel: "0903400807",
                tel: "",
                name: "",
                address: "",
                province: "",
                district: "",

                is_freeship: "1",
                pick_date: "",
                pick_money: "",
                note: "",
                value: ""
            }
        },

        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        orders: [],
        totalOrder: 0,
        totalMoney: 0,
        totalPaidMoney: 0,
        limit: 1,
        totalCount: 1,
        order: {
            isSaving: false,
            isLoading: false,
            error: false,
            total: 1130000,
            paid: 0,
            debt: 1130000,
            order: {
                code: "ORDER20171203164031",
                created_at: "16:40 03-12-2017",
                note: "",
                payment: "Chuyển khoản",
                status: "place_order",
                good_orders: [],
                customer: {
                    name: "test",
                    address: "HN",
                    phone: "test",
                    email: "po01636863831@gmail.com"
                },
            },
        },
        staffs: [],
        allStaffs: [],
        isLoadingStaffs: false,
        errorStaffs: false,
    },

    importGoods: {
        isLoading: false,
        error: false,
        importOrders: [],
        currentPage: 1,
        totalPages: 1,
        importGood: {
            infoOrder: {},
            infoPaid: {},
            importOrder: {
                imported_goods: []
            },
            isLoading: false,
            error: false,
            isLoadingHistoryPaid: false,
            errorHistoryPaid: false,
            historyPaidMoney: []
        },
        formImportGood: {
            imported_goods: [],
            scot: 0,
            paid_money: 0,
            isStoring: false,
            error: false,
            payment: '',
            isLoadingHistoryPaid: false,
            errorHistoryPaid: false,
        },
        addGoodFile: {
            isCheckingGoods: false,
            errorCheckGoods: false,
            existsGoods: [],
            notExistsGoods: [],
        },
        isLoadingWarehouses: false,
        errorWarehouses: false,
        warehouses: [],
        isStoringSupplier: false,
        errorStoreSupplier: false,
        isSavingPaidMoney: false,
        errorPaidMoney: false,
    },
    wareHouses: {
        isLoading: true,
        wareHousesList: [],
        bases: [],
        totalPages: 1,
        modal: {
            wareHouse: {
                id: '',
                name: '',
                location: '',
                base: {
                    id: '',
                    name: '',
                    address: '',

                }
            },
            isShowModal: false,
            isEdit: false,
            isSaving: false,
        }
    },

    customers: {
        groupsInOverlay: [],
        customersList: [],
        ordersList: [],
        isLoading: true,
        isLoadingInOverlay: false,
        totalOrderPages: 10,
        totalGroupCustomerPages: 10,

        totalPages: 10,
        totalMoneys: 10,
        totalDebtMoneys: 10,
        totalCount: 10,
        modal: {
            isSaving: false,
            customer: {
                name: '',
                phone: '',
                email: '',
                address: '',
                gender: '',
                dob: '',

                stringId: '',
                groups: [],
            }
        },
    },
    suppliers: {
        suppliersList: [],
        isLoading: false,
        totalCount: 10,
        totalPages: 10,
        modal: {
            isSaving: false,
            supplier: {
                name: '',
                phone: '',
                email: '',
                address: '',
            }
        }
    },

    addDiscount: {
        isLoadingOut: false,
        isSaving: false,
        isLoading: false,
        customers: [],
        goods: [],
        categories: [],
        groupCustomers: [],
        totalCustomerPages: 0,
        totalGoodPages: 0,
        totalGroupCustomerPages: 0,
        discount: {
            name: '',
            description: '',
            discount_type: '',
            discount_value: '',
            type: '',
            used_for: '',
            start_time: '',
            end_time: '',
            order_value: '',
            good: {},
            category: {},
            customer: {},
            customer_group: {}
        },

    },
    coursesCreateEdit: {
        isLoading: false,
        isEditing: false,
        isUpdatingAvatar: false,
        updateAvatarError: false,
        isUpdatingLogo: false,
        updateLogoError: false,
        isUpdatingCover: false,
        updateCoverError: false,
        isCommitting: false,
        commitSuccess: false,
        data: {
            id: null,
            name: "",
            duration: "",
            price: "",
            description: "",
            linkmac: "",
            linkwindow: "",
            num_classes: "",
            mac_how_install: "",
            window_how_install: "",
            cover_url: "",
            color: "",
            image_url: "",
            icon_url: "",
            created_at: "",
            detail: "",
            lessons: [],
            links: []
        }
    },
    courses: {
        isLoading: false,
        isUploadingLinkIcon: false,
        isUploadingLink: false,
        error: false,
        coursesList: [],
        isDeleting: false,
        paginator: {
            total_count: 1,
            total_pages: 1,
            current_page: 1,
            limit: 1
        },
        isEditing: false,
        isUpdatingAvatar: false,
        updateAvatarError: false,
        isUpdatingLogo: false,
        updateLogoError: false,
        isUpdatingCover: false,
        updateCoverError: false,
        isCommitting: false,
        commitSuccess: false,
        data: {
            id: null,
            name: "",
            duration: "",
            price: "",
            description: "",
            linkmac: "",
            linkwindow: "",
            num_classes: "",
            mac_how_install: "",
            window_how_install: "",
            cover_url: "",
            color: "",
            image_url: "",
            icon_url: "",
            created_at: "",
            detail: "",
            lessons: [],
            links: [],
        },
        link: {
            id: null,
            course_id: "",
            link_name: "",
            link_url: "",
            link_description: "",
            link_icon: "",
        }
    },
    lessons: {
        isLoading: false,
        isCommitting: false,
        commitSuccess: false,
        data: {
            id: null,
            course_id: 1,
            name: "",
            description: "",
            detail: "",
            order: "",
            detail_content: "",
            detail_teacher: "",
            created_at: "",
        }
    },

    marketingCampaigns: {
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        marketingCampaigns: [],
        courses: [],
        isLoadingCourses: false,
        errorCourses: false,
        isStoringCampaign: false,
        errorStoreCampaign: false,
    },

    summaryMarketingCampaign: {
        gens: [],
        isLoadingGens: false,
        errorGens: false,
        currentGen: {},
        bases: [],
        isLoadingBases: false,
        errorBases: false,
        isLoading: false,
        error: false,
        summary: [],
    },
    summarySales: {
        gens: [],
        isLoadingGens: false,
        errorGens: false,
        currentGen: {},
        bases: [],
        isLoadingBases: false,
        errorBases: false,
        isLoading: false,
        error: false,
        summary: [],
    },
    discounts: {
        discountsList: [],
        isLoading: false,
        totalPages: 10,
        totalCount: 10,
    },

    attendance: {
        isLoading: false,
        isLoadingGens: false,
        isLoadingBases: false,
        isTakingAttendance: false,
        isLoadingLessonClassModal: false,
        isLoadingLessonDetailModal: false,
        status: 1,
        currentGen: {
            id: "",
        },
        data: {
            classes: [],

        },
        class: [],
        lesson: [],
        bases: [],
        gens: [],
        selectedClass: {
            name: '',
            teacher: {},
            teacher_assistant: {},
        },
    },
    attendanceStaffs: {
        gens: [],
        isLoadingGens: true,
        errorGens: false,
        currentGen: {},
        bases: [],
        isLoadingBases: false,
        errorBases: false,
        isLoading: false,
        error: false,
        teachers: [],
        salesMarketings: [],
    },
    rooms: {
        isLoading: false,
        error: false,
        currentPage: 1,
        totalPages: 1,
        rooms: [],
        isLoadingBases: false,
        errorBases: false,
        isStoringRoom: false,
        errorStoreRoom: false,
        bases: [],
    },
    excel: {
        isLoading: false,
        data: [],
    },
    department: {
        isLoading: false,
        data: {
            paginator: {
                page: 1,
                total_pages: 1,
            },
        },
    },
    jobAssignment: {
        isLoading: false,
        data: {
            name: "",
            type: "personal",
            cost: 0,
            deadline: "",
            bonus_value: 0,
            bonus_type: "coin",
            staffs: [],
        },
        staffs: [
            {
                value: "value1",
                label: "label1",
                avatar_url: "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/20228725_307332333003611_8331484280221214574_n.jpg?_nc_eui2=v1%3AAeEnbuOLqOmgSQJOXaAs0QqOSyDH0fQVhc7SQgRFKS2e35Gmcw6NaW1AeWfpoY0rJtqmA1K_qhWgHN3rXZ-7LZl8tJ_RUcckp1HyzLOVuPgW-g&oh=8a656e2a7e4e259bc70a9554eeee0e6b&oe=5AFB8662"
            },
            {
                value: "value2",
                label: "label2",
                avatar_url: "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/20228725_307332333003611_8331484280221214574_n.jpg?_nc_eui2=v1%3AAeEnbuOLqOmgSQJOXaAs0QqOSyDH0fQVhc7SQgRFKS2e35Gmcw6NaW1AeWfpoY0rJtqmA1K_qhWgHN3rXZ-7LZl8tJ_RUcckp1HyzLOVuPgW-g&oh=8a656e2a7e4e259bc70a9554eeee0e6b&oe=5AFB8662"
            },
            {
                value: "value3",
                label: "label3",
                avatar_url: "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/20228725_307332333003611_8331484280221214574_n.jpg?_nc_eui2=v1%3AAeEnbuOLqOmgSQJOXaAs0QqOSyDH0fQVhc7SQgRFKS2e35Gmcw6NaW1AeWfpoY0rJtqmA1K_qhWgHN3rXZ-7LZl8tJ_RUcckp1HyzLOVuPgW-g&oh=8a656e2a7e4e259bc70a9554eeee0e6b&oe=5AFB8662"
            },
        ],
    },


    groupCustomers: {
        isSaving: false,
        isLoading: false,
        isLoadingModal: false,
        isLoadingOverlay: false,     // load trong overlay
        customersList: [],         // (chứa trong overlay)    +  customersShowInModal  = full = customers
        totalCustomerInOverlayPages: 1,
        totalCustomerInModalPages: 1,
        totalCustomerCount: 1,
        totalGroupCustomerPages: 1,
        groupCustomerForm: {
            id: 1,
            name: '',
            description: '',
            stringId: [],
            customers: [],                         // tat ca cac customer trong mot group
            customersShowInModal: [],              // cac customer show ra bang trong mot group
            color: '',
        },
        groupCustomersList: [],

    },
    workShiftSessions: {
        isStoring: false,
        errorStore: false,
        workShiftSessions: [],
        isLoading: false,
        error: false
    },
    workShiftRegisters: {
        isLoadingGensBases: false,
        errorGensBases: false,
        bases: [],
        gens: [],
        currentGen: {},
        isLoading: false,
        error: false,
        shiftRegisters: [],
        detailShifts: [],
        isLoadingDetailShifts: false,
        errorDetailShifts: false,
    },
    historyWorkShiftRegisters: {
        currentPage: 1,
        totalPages: 1,
        shiftPicks: [],
        isLoading: false,
        error: false
    },
    landingPages: {
        landingPages: [],
        currentPage: 1,
        totalPages: 1,
        isLoading: false,
        error: false
    }

};
