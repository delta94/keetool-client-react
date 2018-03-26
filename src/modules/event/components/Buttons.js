import React from "react";
import PropTypes from "prop-types";
import Loading from "../../../components/common/Loading";

class StorePostComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        const { scrollerId } = this.props;
        $(scrollerId).scroll(() => {
            const scroll = $(scrollerId).scrollTop();
            const topButtons = $(window).height() - 210 + "px";
            $(".blog-buttons").css("top", topButtons);
            $(".blog-buttons").css(
                "transform",
                "translate(0px, " + scroll + "px)",
            );
        });
        const topButtons = $(window).height() - 210 + "px";
        $(".blog-buttons").css("top", topButtons);
    }

    componentDidUpdate() {}

    render() {
        return (
            <div style={this.props.style} className="blog-buttons">
                {this.props.isSaving ? (
                    <Loading />
                ) : (
                    <div>
                        <button
                            onClick={this.props.close}
                            className="btn btn-fill btn-danger"
                        >
                            Đóng
                        </button>

                        <button
                            className="btn btn-fill btn-success"
                            type="button"
                            disabled={this.props.disabled}
                            onClick={() => this.props.preSavePost(false)}
                        >
                            Lưu
                        </button>

                        <button
                            className="btn btn-fill btn-default"
                            type="button"
                            disabled={this.props.disabled}
                            onClick={() => this.props.preSavePost(true)}
                        >
                            Lưu và xem thử
                        </button>

                        <button
                            className="btn btn-fill btn-rose"
                            type="button"
                            disabled={this.props.disabled}
                            onClick={() => {
                                this.props.publish();
                            }}
                        >
                            Đăng bài
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

StorePostComponent.propTypes = {
    scrollerId: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired,
    isSaving: PropTypes.func.isRequired,
};

export default StorePostComponent;
