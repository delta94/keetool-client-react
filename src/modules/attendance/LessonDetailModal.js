import React                        from 'react';
import {Modal}                      from 'react-bootstrap';
import Loading                      from '../../components/common/Loading';
import * as helper                  from '../../helpers/helper';
import TooltipButton from '../../components/common/TooltipButton';
import PropTypes                    from 'prop-types';
class LessonDetailModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }


    render(){
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header closeButton>
                    <h3>{ "Danh sách buổi học lớp " +  this.props.class.name}</h3>
                    <div className="row">
                        <div className="col-md-3">{
                            this.props.class.teacher ?
                                (
                                    <TooltipButton text="Giảng viên"
                                                   placement="top"
                                    >
                                        <button className="btn btn-sm"
                                                style={{backgroundColor: '#' + this.props.class.teacher.color}}>
                                            {helper.getShortName(this.props.class.teacher.name)}
                                            <div className="ripple-container"/>
                                        </button>
                                    </TooltipButton>
                                )
                                :
                                (
                                    <div className="no-data">
                                        Không có thông tin giảng viên
                                    </div>
                                )

                        }</div>


                        <div className="col-md-3">{
                            this.props.class.teacher_assistant ?
                                (
                                    <TooltipButton text="Trợ giảng"
                                                   placement="top">
                                        <button className="btn btn-sm"
                                                style={{backgroundColor: '#' + this.props.class.teacher_assistant.color}}>
                                            {helper.getShortName(this.props.class.teacher_assistant.name)}
                                            <div className="ripple-container"/>
                                        </button>
                                    </TooltipButton>
                                )
                                :
                                (
                                    <div className="no-data">
                                        Không có thông tin trợ giảng
                                    </div>
                                )

                        }</div>
                    </div>
                </Modal.Header>
                <Modal.Body>

                    <div className="table-responsive">
                        <table className="table" style={{textAlign:"center"}}>
                            <thead className="text-rose">
                            <tr>
                                <th>Thứ tự</th>
                                <th>Tình trạng điểm danh</th>
                                <th/>
                            </tr>
                            </thead>
                            {this.props.lessondata.map((item)=>{
                                return (
                                    <tr key={item.order}>
                                        <td><h6>
                                            <strong>Buổi {item.order} </strong>
                                        </h6></td>
                                        <td width="65%">
                                            <h6>{item.attended_students + "/" + item.total_students}</h6>
                                            <div className="progress progress-line-success progress-bar-table" style={{width: "95%"}}>
                                                <div className="progress-bar progress-bar-success" role="progressbar"
                                                     aria-valuenow="60"
                                                     aria-valuemin="0"
                                                     aria-valuemax="100"
                                                     style={{width: item.attended_students * 100 / item.total_students+'%'}}>
                                                    <span className="sr-only">{item.attended_students * 100 / item.total_students}%</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <button className="btn btn-fill btn-rose" type="button"
                                                    style={{fontSize: "xx-small"}}
                                                    onClick={()=>{}}
                                            >Điểm danh</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>

                </Modal.Body>
            </Modal>
        );
    }
}

LessonDetailModal.PropTypes ={
    lessondata: PropTypes.array,
}

export default (LessonDetailModal);
/**/