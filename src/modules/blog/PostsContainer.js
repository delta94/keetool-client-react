/**
 * Created by phanmduong on 11/1/17.
 */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import * as blogActions from "./blogActions";
import ListPost from "./ListPost";
import * as helper from "../../helpers/helper";
import Search from "../../components/common/Search";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import Select from "./Select";

// import Select from '../../components/common/Select';

import { Modal } from "react-bootstrap";

import StorePostModal from "./StorePostModal";

class BlogsContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.postsSearchChange = this.postsSearchChange.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        this.loadByCategories = this.loadByCategories.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.state = {
            page: 1,
            query: "",
            category_id: 0,

            isOpenModal: false,
            postId: 0,
            isEdit: false,
        };
        this.timeOut = null;
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentWillMount() {
        this.props.blogActions.getCategories();
        this.loadPosts(1);
    }

    openModal(isEdit, postId) {
        this.setState({ isOpenModal: true, postId: postId, isEdit: isEdit });
    }

    closeModal() {
        this.setState({ isOpenModal: false });
    }

    deletePost(post) {
        helper.confirm(
            "error",
            "Xoá",
            "Bạn có chắc chắn muốn xoá bài viết này",
            function() {
                this.props.blogActions.deletePost(post.id);
            }.bind(this),
        );
    }

    postsSearchChange(value) {
        this.setState({
            page: 1,
            query: value,
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(
            function() {
                this.props.blogActions.getPosts(
                    this.state.page,
                    this.state.query,
                    this.state.category_id,
                );
            }.bind(this),
            500,
        );
    }

    loadPosts(page, category_id) {
        this.setState({ page });
        if (category_id === 0) {
            this.props.blogActions.getPosts(page, this.state.query);
        } else {
            this.props.blogActions.getPosts(
                page,
                this.state.query,
                category_id,
            );
        }
    }

    handleSwitch(id, status, name) {
        this.props.blogActions.changeStatus(id, status, name);
    }

    loadByCategories(category_id) {
        this.setState({ category_id });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(
            function() {
                this.props.blogActions.getPosts(
                    this.state.page,
                    this.state.query,
                    this.state.category_id,
                );
            }.bind(this),
            500,
        );
    }

    render() {
        return (
            <div className="container-fluid">
                {this.props.isLoadingCategories || this.props.isLoading ? (
                    <Loading />
                ) : (
                    <div className="card">
                        <div
                            className="card-header card-header-icon"
                            data-background-color="rose"
                        >
                            <i className="material-icons">assignment</i>
                        </div>

                        <div className="card-content">
                            <h4 className="card-title">Danh sách bài viết</h4>
                            <div className="row">
                                <div className="col-md-4">
                                    <a
                                        onClick={() => this.openModal(false)}
                                        className="btn btn-rose"
                                    >
                                        Tạo bài viết
                                    </a>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-10">
                                    <Search
                                        onChange={this.postsSearchChange}
                                        value={this.state.query}
                                        placeholder="Tìm kiếm tiêu đề"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <Select
                                        category_id={this.state.category_id}
                                        loadByCategory={this.loadByCategories}
                                        catetrugoriesList={
                                            this.props.categoriesList
                                        }
                                    />
                                </div>
                            </div>

                            <ListPost
                                openModal={this.openModal}
                                handleSwitch={this.handleSwitch}
                                deletePost={this.deletePost}
                                posts={this.props.posts}
                                loadPosts={this.loadPosts}
                                loadByCategories={this.loadByCategories}
                            />
                        </div>

                        <div className="card-content">
                            <Pagination
                                totalPages={this.props.totalPages}
                                currentPage={this.state.page}
                                loadDataPage={this.loadPosts}
                            />
                        </div>
                    </div>
                )}

                <Modal
                    show={this.state.isOpenModal}
                    bsStyle="primary"
                    onHide={this.closeModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <strong>Bài viết</strong>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <StorePostModal
                            postId={this.state.postId}
                            isEdit={this.state.isEdit}
                            closeModal={this.closeModal}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

BlogsContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoadingCategories: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired,
    categoriesList: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    blogActions: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        posts: state.blog.posts,
        isLoading: state.blog.isLoading,
        isLoadingCategories: state.blog.isLoadingCategories,
        totalPages: state.blog.totalPages,
        currentPage: state.blog.currentPage,
        categories: state.blog.categories.categories,
        categoriesList: state.blog.categoriesList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        blogActions: bindActionCreators(blogActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogsContainer);
