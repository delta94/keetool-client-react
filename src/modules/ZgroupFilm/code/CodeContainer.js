import React from 'react';
import TooltipButton from "../../../components/common/TooltipButton";
import Search from "../../../components/common/Search";
import Pagination from "../../../components/common/Pagination";
import Loading from "../../../components/common/Loading";
import CodeComponent from "./CodeComponent";
import AddEditCodeModal from "./AddEditCodeModal";
import {connect} from "react-redux";
import * as codeAction from "./codeAction";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import ShowCodeModal from "./ShowCodeModal";





class CodeContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        this.props.codeAction.getCode();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isAddEditCode !== this.props.isAddEditCode && !nextProps.isAddEditCode) {
            this.props.codeAction.getCode();
        }
    }
    render() {
        return (
            <div className="card">
                <div className="card-content">
                    <div className="tab-content">
                        <div className="flex-row flex">
                            <h4 className="card-title">
                                <strong>Danh sách tất cả mã giảm giá</strong>
                            </h4>
                            <div>
                                <TooltipButton
                                    placement="top"
                                    text="Thêm mã giảm giá">
                                    <button
                                        className="btn btn-primary btn-round btn-xs button-add none-margin"
                                        type="button"
                                        onClick={() => {
                                            this.props.codeAction.openModal();
                                            this.props.codeAction.handleCodeModal({});
                                        }}>

                                        <strong>+</strong>
                                    </button>
                                </TooltipButton>
                            </div>
                            <div>
                                <TooltipButton
                                    placement="top"
                                    text="Lọc">
                                    <button
                                        className="btn btn-primary btn-round btn-xs button-add none-margin"
                                        type="button"
                                        onClick={() => {
                                        }}>
                                        <i className="material-icons" style={{margin: "0px -4px", top: 0}}>
                                            filter_list
                                        </i>
                                    </button>
                                </TooltipButton>
                            </div>
                        </div>


                        <Search
                            onChange={() => {
                            }}
                            value={""}
                            placeholder="Nhập nội dung để tìm kiếm"
                        />
                        <br/>

                    </div>
                    <div>
                        {
                            this.props.isLoadingCode ? <Loading/> :
                                <CodeComponent
                                code={this.props.code}/>
                        }


                        <br/>
                        <div className="row float-right">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                 style={{textAlign: 'right'}}>
                                <b style={{marginRight: '15px'}}>
                                    Hiển thị kêt quả từ {1}
                                    - {3}/{7}</b><br/>
                                <Pagination
                                    totalPages={7}
                                    currentPage={5}
                                    loadDataPage={() => {
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ShowCodeModal/>
                <AddEditCodeModal/>
            </div>
        );
    }
}

CodeContainer.propTypes = {
    isLoadingCode: PropTypes.bool.isRequired,
    isAddEditCode: PropTypes.bool.isRequired,
    codeAction: PropTypes.object.isRequired,
    code: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoadingCode: state.code.isLoadingCode,
        code: state.code.code,
        isAddEditCode: state.code.isAddEditCode,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        codeAction: bindActionCreators(codeAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeContainer);