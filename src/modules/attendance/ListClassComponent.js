import React                    from 'react';
import Loading                  from '../../components/common/Loading';
import PropTypes                from 'prop-types';
import * as helper              from '../../helpers/helper';
import {Link} from 'react-router';
class ListClassComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

    }

    render(){
        return(

                            <div className="table-responsive">

                                {!this.props.isLoading && this.props.classes ?
                                    <div>
                                        { (this.props.classes && this.props.classes.length === 0) ?
                                            <h3>Không tìm thấy kết quả</h3>
                                            :
                                            <table className="table">
                                            <thead className="text-rose">
                                            <tr>
                                                <th/>
                                                <th>Tên</th>
                                                <th>Giảng viên</th>
                                                <th>Trợ giảng</th>
                                                <th>Thời gian học</th>
                                                <th>Trạng thái lớp</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.props.classes.map((classItem) => {
                                                return (
                                                    <tr key={classItem.id}>
                                                        <td>
                                                            <button
                                                                className="btn btn-round btn-fab btn-fab-mini text-white"
                                                                data-toggle="tooltip" title="" type="button"
                                                                rel="tooltip"
                                                                data-placement="right"
                                                                data-original-title={classItem.name}>
                                                                <img src={classItem.course.icon_url} alt=""/>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <a className="color-text-main" onClick={() => {
                                                            }}>{classItem.name}</a>
                                                        </td>
                                                        <td>
                                                            {
                                                                classItem.teacher ?
                                                                    (
                                                                        <button className="btn btn-xs btn-main"
                                                                              style={{backgroundColor: '#' + classItem.teacher.color}}
                                                                              onClick={()=>{return this.props.searchByTeacher(1,"",classItem.teacher.id);}}
                                                                        >
                                                                            {helper.getShortName(classItem.teacher.name)}
                                                                            <div className="ripple-container"/>
                                                                        </button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className="no-data">
                                                                            Không có
                                                                        </div>
                                                                    )

                                                            }

                                                        </td>
                                                        <td>
                                                            {
                                                                classItem.teacher_assistant ?
                                                                    (
                                                                        <button className="btn btn-xs btn-main"
                                                                              style={{backgroundColor: '#' + classItem.teacher_assistant.color}}

                                                                        >
                                                                            {helper.getShortName(classItem.teacher_assistant.name)}
                                                                            <div className="ripple-container"/>
                                                                        </button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className="no-data">
                                                                            Không có
                                                                        </div>
                                                                    )

                                                            }

                                                        </td>
                                                        <td>{classItem.study_time}</td>
                                                        <td>{classItem.status === 1 ? 'Mở' : 'Đóng'}</td>
                                                        <td>
                                                            <Link className="btn btn-fill btn-rose"
                                                                  type="button"
                                                                  to={'/manage/attendance/' + classItem.id}
                                                            >Điểm danh</Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            </tbody>
                                        </table>
                                        }
                                    </div>
                                :
                                    <Loading/>
                                }

                            </div>

        );
    }

}

ListClassComponent.propTypes = {
    classes : PropTypes.array,
    isLoading : PropTypes.bool,
    searchByTeacher : PropTypes.func,
};



export default (ListClassComponent);
