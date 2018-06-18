import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import * as filmAction from "../filmAction";
import {bindActionCreators} from 'redux';
import * as d3 from "d3";

//import * as helper from "../../../helpers/helper";
let ghedachon = [];
let sum = 0;

class BookingGrid extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            a: [],
        };
        this.creatBarChart = this.creatBarChart.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.creatBarChart();

    }

    submit() {

        let seat_ids = ghedachon.map(a => {
            return a.id
                ;

        });
        //console.log("a",seat_ids);
        this.props.filmAction.toggleBookingModal();
        this.props.filmAction.handleBookingModal({
            ...this.props.handleBookingModal,
            seats: JSON.stringify(seat_ids),
            sum: sum
        });
        //console.log("b", this.props.handleBookingModal);
    }

    // componentDidUpdate() {
    //     this.creatBarChart();
    // }

    creatBarChart() {
        const node = this.node;
        const node2 = this.node2;
        let data = this.props.seatForBooking;
        const height = this.props.height;
        const width = this.props.width;
        //console.log("size",height,width);
        let svg = d3
            .select(node)
            .append("svg")
            .attr("viewBox", "0 0 " + width + " " + height);
        let g = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });
        g.append("circle").attr('r', function (d) {
            return 10 * d.r;
        });
        g.append("text").attr('fill', 'white').attr('text-anchor', 'middle').attr('alignment-baseline', 'central')
            .attr("font-size", "20px")
            .attr("font-family", "sans-serif").text(function (d) {
            return d.name;
        });

        function add(dataSet) {
            let aa = d3.select(node2)
                .selectAll("span")
                .data(dataSet)
                .style("font-size", "28px")
                .style("font-weight", 600)
                .style("border", "2px 2px red solid");
            aa
                .text(' ')
                .text(function (d) {
                    return d.name + " ";
                });

            aa
                .enter()
                .append("span")
                .style("font-size", "28px")
                .style("font-weight", 600)
                .style("border", "#ff0000 solid 2px")
                .text(' ')
                .text(function (d) {
                    return d.name + " ";
                });

            aa.exit().remove();
        }

        function render(dataset) {
            d3.select('svg').selectAll('g').data(dataset)
                .on('click', d => {
                    if (d.status !== 3)
                        if (d.status === 1) {
                            sum = sum - parseInt(d.price);
                            data = data.map((ds)=>{
                                if (ds.id === d.id)
                                    return {
                                        ...ds,
                                        status: 0
                                    };
                                else return ds;
                            });
                            ghedachon = ghedachon.filter((e) => e !== d);
                            d3.selectAll(".total-pay")
                                .text(
                                    sum / 1000 + ".000 VNĐ"
                                );
                            add(ghedachon);
                            render(data);
                        } else {
                            sum = sum + parseInt(d.price);
                            data = data.map((ds)=>{
                                if (ds.id === d.id)
                                    return {
                                        ...ds,
                                        status: 1
                                    };
                                else return ds;
                            });
                            ghedachon = [...ghedachon, d];
                            d3.selectAll(".total-pay")
                                .text(
                                    (sum) / 1000 + ".000 VNĐ"
                                );
                            add(ghedachon);
                            render(data);
                        }

                })
                .select("circle").style('fill',
                function (d) {
                    return d.status === 3 ? "black" : (d.status !== 1 ? d.color : "gray");
                })
                .style("cursor", "pointer");


        }

        render(data);
        add(ghedachon);


    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <img src="https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/bg-screen.png"/><br/><br/>
                    <div ref={node => this.node = node}/>
                    <div style={{textAlign: "right"}}>
                        <div>
                            <button
                                type="button"
                                className="btn btn-rose"
                                onClick={() => {
                                    this.submit();
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <h2>Các ghế đã đặt</h2>
                    <div ref={node2 => this.node2 = node2}/>
                    <hr/>
                    <h2>
                        Giá vé
                        <p className="total-pay"/>
                    </h2>
                </div>

            </div>


        );
    }
}

BookingGrid.propTypes = {
    filmAction: PropTypes.object.isRequired,
    rooms: PropTypes.array.isRequired,
    handleBookingModal: PropTypes.object.isRequired,
    seatForBooking: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {
        rooms: state.film.rooms,
        seatForBooking: state.film.seatForBooking,
        width: state.film.width,
        height: state.film.height,
        handleBookingModal: state.film.handleBookingModal,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        filmAction: bindActionCreators(filmAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingGrid);

