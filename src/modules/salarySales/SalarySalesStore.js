/* eslint-disable */
import {observable, action, computed} from "mobx";
import {
    addBonusSalaryApi, addSaleSalaryApi, approvalSaleSalaryApi, getDetailSalaryBonusApi,
    loadBasesApi,
    loadGensApi, loadSalarySalesApi, sendEmailSaleSalaryApi
} from "./salarySaleApi";
import _ from 'lodash';
import {showErrorNotification, showNotification, showTypeNotification} from "../../helpers/helper";
import {approvalTeachingSalaryApi} from "../salaryTeaching/salaryTeachingApi";

export default new class salarySalesStore {
    @observable isLoadingGen = false;
    @observable gens = [];
    @observable isLoadingBase = false;
    @observable bases = [];
    @observable selectedGenId = 0;
    @observable selectedBaseId = 0;
    @observable isLoading = true;
    @observable isSendingEmail = false;
    @observable openModalAddSalaryBonus = false;
    @observable openModalDetailSalaryBonus = false;
    @observable openModalSendMail = false;
    @observable isAddingSalaryBonus = false;
    @observable openModalAddSalary = false;
    @observable isAddingSalary = false;
    @observable isLoadingDetailSalaryBonus = false;
    @observable isApproval = false;
    @observable data = [];
    @observable salaryBonus = {
        saleSalaryId: 0,
        amount: 0,
        note: ''
    };
    @observable salary = {
        saleSalaryId: 0,
        money: 0,
        note: '',
        type: 'normal' //'gd'
    };
    @observable detailSalaryBonus = [];
    @observable searchName = '';


    @action
    loadGens() {
        this.isLoadingGen = true;
        loadGensApi().then((res) => {
            this.gens = res.data.data.gens;
            if (this.selectedGenId == 0) {
                this.selectedGenId = res.data.data.teaching_gen.id;
            }
        }).finally(() => {
            this.isLoadingGen = false;
        });
    }

    @action
    loadBases() {
        this.isLoadingBase = true;
        loadBasesApi().then((res) => {
            this.bases = res.data.data.bases;
        }).finally(() => {
            this.isLoadingBase = false;
        });
    }

    @action
    loadSalarySales() {
        this.isLoading = true;
        loadSalarySalesApi(this.selectedGenId, this.selectedBaseId).then((res) => {
            this.data = res.data.data.sale_salary;
            this.data = this.data.map((data) => {
                return {...data, isSendMail: true}
            });
            this.isApproval = res.data.data.is_approval;
        }).finally(() => {
            this.isLoading = false;
        });
    }

    @action
    submitAddSalaryBonus() {
        this.isAddingSalaryBonus = true;
        addBonusSalaryApi(this.salaryBonus.saleSalaryId, this.salaryBonus.amount, this.salaryBonus.note).then((res) => {
            this.openModalAddSalaryBonus = false;
            const data = this.data.map((item) => {
                if (item.sale_salary_id == this.salaryBonus.saleSalaryId) {
                    return {
                        ...item,
                        bonus: res.data.data.total_bonus
                    }
                }
                return item;
            });
            this.data = data;

        }).finally(() => {
            this.isAddingSalaryBonus = false;
        });
    }

    @action
    submitAddSalary() {
        this.isAddingSalary = true;
        addSaleSalaryApi(this.salary.saleSalaryId, this.salary.money, this.salary.note, this.salary.type).then((res) => {
            this.openModalAddSalary = false;
            const data = this.data.map((item) => {
                if (item.sale_salary.id == this.salary.saleSalaryId) {
                    return {
                        ...item,
                        sale_salary: res.data.data
                    }
                }
                return item;
            });
            this.data = data;

        }).finally(() => {
            this.isAddingSalary = false;
        });
    }

    @action
    getDetailSalaryBonus = (saleSalaryId) => {
        this.isLoadingDetailSalaryBonus = true;
        getDetailSalaryBonusApi(saleSalaryId).then((res) => {
            this.detailSalaryBonus = res.data.data.salary_bonuses;
        }).finally(() => {
            this.isLoadingDetailSalaryBonus = false;
        })
    };

    @action
    sendingEmail() {
        this.isSendingEmail = true;
        let salaryIds = this.data.filter((data) => data.isSendMail).map((data) => data.sale_salary.id);
        console.log(salaryIds);
        sendEmailSaleSalaryApi(salaryIds).then(() => {
            showNotification("Gửi mail thành công");
            this.openModalSendMail = false;
        }).catch(() => {
            showErrorNotification("Gửi mail thất bại");
        }).finally(() => {
            this.isSendingEmail = false;
        });
    }

    @action
    approvalSalary = () => {
        showTypeNotification("Đang duyệt chi", "info");
        approvalSaleSalaryApi(this.selectedGenId, this.selectedBaseId).then((res) => {
            if (res.data.status == 1) {
                showNotification(res.data.message);
                this.isApproval = true;
            } else {
                showErrorNotification(res.data.message);
            }
        }).catch(() => {
            showErrorNotification("Có lỗi xảy ra");
        }).finally(() => {
        })
    };


    @computed
    get totalSalary() {
        let total = 0;
        this.getData.map((data) => {
            const total_salary = (parseInt(data.sale_salary.salary_normal_register) || 0)
                + (parseInt(data.sale_salary.salary_gd_register) || 0) + data.user.salary + (data.bonus || 0);
            total += total_salary;
        });

        return total;
    }

    @computed
    get getData() {
        return this.data.map((data) => {
            const total_salary = (parseInt(data.sale_salary.salary_normal_register) || 0)
                + (parseInt(data.sale_salary.salary_gd_register) || 0) + data.user.salary + (data.bonus || 0);
            return {...data, total_salary}
        })
    }

    @computed
    get gensData() {
        return this.gens.map(function (gen) {
            return {
                key: gen.id,
                value: 'Khóa ' + gen.name
            };
        });
    }

    @computed
    get basesData() {
        let baseData = this.bases.map(function (base) {
            return {
                key: base.id,
                value: base.name
            };
        });
        return [
            {
                key: 0,
                value: "Tất cả"
            },
            ...baseData
        ];
    }

    @computed get totalBonus() {
        return _.sumBy(this.detailSalaryBonus, "amount");
    }
}