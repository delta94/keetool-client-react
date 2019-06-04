import React from 'react';
import PropTypes from 'prop-types';
import {NO_AVATAR} from "../../constants/env";

import {avatarEmpty, isEmptyInput} from "../../helpers/helper";
import TooltipButton from "../../components/common/TooltipButton";

import ButtonGroupAction from "../../components/common/ButtonGroupAction";

class ListHonor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // sortDown: true
        };
    }

    changeSort = () => {
        this.setState({sortDown: !this.state.sortDown});
    };

    render() {
        const {honors} = this.props;
        // const {sortDown} = this.state;
        // let data = _.sortBy(honors, "start_time");
        // if (!sortDown) {
        //     data.reverse();
        // }
        return (
            <div className="col-md-12">
                <div className="table-responsive">
                    <table className="table table-sortable">
                        <thead className="text-rose">
                        <tr>
                            <th/>
                            <th>Họ và tên</th>
                            <th>
                                Thời gian
                            </th>
                            <th>Đóng góp</th>
                            <th>Mô tả</th>
                            <th/>
                            {this.props.user.role == 2 && <th/>}
                        </tr>
                        </thead>
                        <tbody>
                        {honors.map((honor, index) => {
                            let avatar = avatarEmpty(honor.avatar_url)
                                ? NO_AVATAR
                                : honor.avatar_url;
                            return (
                                <tr key={index}>
                                    <td>
                                        <div
                                            style={{
                                                borderRadius: '50%',
                                                border: 'solid 3px',
                                                width: '70px',
                                                height: 'auto',
                                                padding: '2px',
                                                borderColor: honor.user.role && honor.user.role.id > 0 ? "#04bf2c" : "#b3bbb3"
                                            }}>
                                            <div
                                                className="avatar-honor"
                                                style={{
                                                    background: 'url(' + avatar + ') center center / cover',
                                                    display: 'inline-block'
                                                }}
                                            />
                                        </div>

                                    </td>
                                    <td>
                                        <a href={`/hr/staff/${honor.user.id}/info`}>{honor.user.name}</a>
                                    </td>
                                    <td>{honor.start_time}{honor.end_time ? (" - " + honor.end_time) : "" }</td>
                                    <td><strong>{honor.title}</strong></td>
                                    <td style={{width: "400px"}}>{honor.short_description}</td>
                                    <td>
                                        {
                                            !isEmptyInput(honor.long_story) &&
                                            <TooltipButton placement={"top"} text={"Xem thêm"}>
                                                <a href={honor.long_story} style={{float: 'right'}}>
                                                    <i className="material-icons"
                                                       style={{fontSize: '43px', color: '#d20000'}}>
                                                        play_circle_filled
                                                    </i>
                                                </a>
                                            </TooltipButton>
                                        }

                                    </td>
                                    {this.props.user.role == 2 && <td>
                                        <ButtonGroupAction
                                            edit={()=>this.props.edit(honor)}
                                            delete={()=>this.props.delete(honor)}
                                        />
                                    </td>}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
            ;
    }
}

ListHonor.propTypes = {
    honors: PropTypes.array.isRequired,
};

export default ListHonor;