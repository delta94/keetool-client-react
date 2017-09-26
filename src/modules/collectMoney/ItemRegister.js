import React from 'react';
import * as helper from '../../helpers/helper';
import PropTypes from 'prop-types';

class ItemRegister extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            register: {
                id: '',
                code: '',
                money: '',
                note: '',
                received_id_card: 0
            }
        };
        this.updateFormData = this.updateFormData.bind(this);
    }

    componentWillMount() {
        this.state = ({
            register: {
                ...this.state.register,
                ...{
                    id: this.props.register.id,
                    code: this.props.nextCode,
                }
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nextCode !== this.props.nextCode) {
            this.setState({
                register: {
                    ...this.state.register,
                    code: nextProps.nextCode
                }
            });
        }
    }

    componentDidUpdate(){
        $.material.init();
    }

    updateFormData(event) {
        const field = event.target.name;
        let register = {...this.state.register};
        if (event.target.type === "checkbox") {
            register[field] = event.target.checked;
        } else {
            if (field == 'money') {
                if (!isNaN(Number(event.target.value.toString().replace(/\./g, "")))) {
                    register[field] = event.target.value;
                }
            } else {
                register[field] = event.target.value;
            }
        }
        this.setState({
            register: register
        });
    }

    checkValidate() {
        if (helper.isEmptyInput(this.state.register.code)) {
            helper.showTypeNotification('Vui lòng nhập mã học viên', 'warning');
            return;
        }

        if (helper.isEmptyInput(this.state.register.money)) {
            helper.showTypeNotification('Vui lòng nhập số tiền', 'warning');
            return;
        }
        this.props.updateMoney(this.props.user, this.state.register);
    }

    render() {
        let register = this.props.register;
        return (
            <tr>
                <td>
                    <button className="btn btn-round btn-fab btn-fab-mini text-white"
                            data-toggle="tooltip" title="" type="button" rel="tooltip"
                            data-placement="right"
                            data-original-title={register.class_name}>
                        <img src={register.icon_url} alt=""/>
                    </button>
                </td>
                <td>{register.class_name}</td>
                <td className="text-center">{register.register_time}</td>
                {register.is_paid ?
                    <td>{register.code}</td>
                    :
                    <td>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.register.code}
                                name="code"
                                onChange={this.updateFormData}
                            />
                        </div>
                    </td>
                }
                {register.is_paid ?
                    <td>
                        {(helper.isEmptyInput(register.money) || register.money === 0)
                            ? 0 : helper.dotNumber(register.money)}đ</td>
                    :
                    <td>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={helper.dotNumber(this.state.register.money)}
                                name="money"
                                onChange={this.updateFormData}
                            />
                        </div>
                    </td>
                }
                {register.is_paid ?
                    <td>
                        <div className="checkbox text-center">
                            <label>
                                <input type="checkbox"
                                       name="optionsCheckboxes"
                                       checked={register.received_id_card === 1}
                                       disabled
                                />
                            </label>
                        </div>
                    </td>
                    :
                    <td>
                        <div className="checkbox text-center">
                            <label>
                                <input type="checkbox"
                                       name="received_id_card"
                                       checked={Boolean(this.state.register.received_id_card)}
                                       onChange={this.updateFormData}
                                />
                            </label>
                        </div>
                    </td>
                }
                {register.is_paid ?
                    <td>{register.note}</td>
                    :
                    <td>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.note}
                                name="note"
                                onChange={this.updateFormData}
                            />
                        </div>
                    </td>
                }
                {register.is_paid ?
                    <td className="text-center">{register.paid_time}</td>
                    :
                    <td className="text-center">
                        Chưa nộp
                    </td>
                }
                {register.is_paid ?
                    <td>
                        <div className="text-success">
                            <b>Đã nộp tiền</b>
                        </div>
                    </td>
                    :
                    <td>
                        {register.isUpdating ?
                            (
                                <button
                                    className="btn btn-fill btn-rose disabled"
                                >
                                    <i className="fa fa-spinner fa-spin"/> Đang nộp
                                </button>
                            )
                            :
                            (
                                <button
                                    className="btn btn-fill btn-rose"
                                    onClick={() => this.checkValidate()}
                                >
                                    Nộp
                                </button>
                            )
                        }
                    </td>
                }
            </tr>
        );
    }
}

ItemRegister.propTypes = {
    nextCode: PropTypes.string.isRequired,
    register: PropTypes.object.isRequired,
    updateMoney: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};


export default ItemRegister;
