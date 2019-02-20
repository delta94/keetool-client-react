import React from "react";
import PropTypes from "prop-types";
import * as blogActions from "./blogActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Avatar from "../../../components/common/Avatar";
import moment from "moment";
import {DATE_FORMAT_SQL} from "../../../constants/constants";
import {loadGapi} from "../GapiClass";
import FormInputDate from "../../../components/common/FormInputDate";

class ListPost extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.data =
            [
                {
                    id: this.props.id,
                    query: {
                        metrics: 'ga:sessions',
                        dimensions: 'ga:date',
                        filters: 'ga:pagePath==/blog/' + this.props.slug,
                    },
                    chart: {
                        type: 'LINE',
                        options: {
                            width: '100%'
                        }
                    }
                },

            ];
    }

    componentDidMount() {
        let now = moment();
        this.data = this.props.posts.map(obj => {
            return {
                id: obj.id,
                query: {
                    metrics: 'ga:sessions',
                    dimensions: 'ga:date',
                    filters: 'ga:pagePath==/blog/' + obj.slug,
                    'start-date': moment(now).subtract(14, 'day').day(0).format(DATE_FORMAT_SQL),
                    'end-date': moment(now).format(DATE_FORMAT_SQL)
                },
                chart: {
                    type: 'LINE',
                    options: {
                        width: '50%'
                    }
                }
            };
        });
        loadGapi(this.data);

    }


    // componentWillReceiveProps(nextProps) {
    //
    // }

    onChangeDate = (e, name, index) => {
        let obj = {...this.data[index]};
        obj.query = {...obj.query, [name]: e.target.value};
        this.data[index] = obj;
        if (this.props.inited) {
            loadGapi(this.data);
        }

    }

    render() {
        console.log(this.data);
        return (
            <div>

                <div className="row">
                    {this.props.posts && this.props.posts.map((post, index) => {
                        let dataObj = this.data[index] ? this.data[index] : {query: {}};
                        return (
                            <div
                                className="col-md-12"
                                key={post.id}
                            >
                                <div className="card card-chart">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="card-content">
                                                <div
                                                    id="simpleBarChart"
                                                    className="ct-chart"
                                                    style={{
                                                        width: "100%",
                                                        background:
                                                            "url(" +
                                                            post.image_url +
                                                            ")",
                                                        backgroundSize: "cover",
                                                        backgroundPosition:
                                                            "center",
                                                        height: "200px",
                                                        borderRadius: "10px",
                                                        position: "relative"
                                                    }}
                                                >

                                                </div>
                                                <div className="card-action">
                                                    <h4 className="card-title"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between"
                                                        }}>
                                                        <a href={`/blog/${post.id}/editor`} target="_blank">
                                                            {post.title
                                                                ? post.title
                                                                : "Chưa có tên"}
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    height: 40
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}>
                                                        {post.author.avatar_url ? (
                                                            <Avatar
                                                                size={40}
                                                                url={post.author.avatar_url}
                                                                style={{borderRadius: 6}}
                                                            />
                                                        ) : null}
                                                        <div>
                                                            <strong>
                                                                {post.author.name}
                                                            </strong>
                                                            <br/>
                                                            <p className="category" style={{fontSize: 12}}>
                                                                {post.created_at}
                                                            </p>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="analytic-wrapper">
                                                <div className="analytic-route-item">1</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <div id={"chart-" + post.id + "-container"}></div>
                                                </div>
                                            </div>
                                                {!this.props.isLoadingPosts && <div className="row">
                                                    <div className="col-md-4">
                                                        <FormInputDate value={dataObj.query['start-date']}
                                                                       format={DATE_FORMAT_SQL}
                                                                       name={'start-date' + index}
                                                                       id={'start-date' + index}
                                                                       updateFormData={(e) => this.onChangeDate(e, 'start-date', index)}
                                                        /></div>
                                                    <div className="col-md-4">
                                                        <FormInputDate value={dataObj.query['end-date']}

                                                                       format={DATE_FORMAT_SQL}
                                                                       name={'end-date' + index}
                                                                       id={'end-date-' + index}
                                                                       updateFormData={e => this.onChangeDate(e, 'end-date', index)}
                                                        /></div>
                                                </div>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ListPost.propTypes = {
    posts: PropTypes.array.isRequired,
    blogActions: PropTypes.object.isRequired
    // loadByCategories: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        posts: state.blog.posts,
        categories: state.blog.categories,
        isLoadingPosts: state.blog.isLoadingPosts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        blogActions: bindActionCreators(blogActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPost);
