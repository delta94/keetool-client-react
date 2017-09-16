import React from 'react';
import PropTypes from 'prop-types';
import {Media} from "react-bootstrap";

class CommentItem extends React.Component {

    render() {
        const {comment} = this.props;
        return (
            <Media>
                <Media.Left align="top">
                    <img style={{borderRadius: 5}} width={48} height={48} src={comment.commenter.avatar_url}
                         alt={comment.commenter.name}/>
                </Media.Left>
                <Media.Body>
                    <Media.Heading>{comment.commenter.name}
                        <small style={{color: "#919191", marginLeft: 10}}>{comment.created_at}</small>
                    </Media.Heading>
                    <div>{comment.content}</div>
                </Media.Body>
            </Media>
        );
    }

}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired
};

CommentItem.defaultProps = {};

export default CommentItem;