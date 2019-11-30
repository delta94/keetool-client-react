import React from 'react';
import FormInputText from "../../../components/common/FormInputText";
import Loading from "../../../components/common/Loading";
import {loadMarketingEmail, storeMarketingCampaign, assignMarketingCampaign} from "../../marketingCampaign/marketingCampaignApi";
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import {isEmptyInput, showErrorNotification} from "../../../helpers/helper";
import {CirclePicker} from "react-color";
import Search from "../../../components/common/Search";


class MarketingCampaignOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            create: false,
            campaign: {},
            isLoading: false,
            isProcessing: false,
            isDeleting: false,
            search: ''
        };
        this.state = this.initState;
    }

    componentDidMount() {
        this.loadMarketingEmail();
    }

    loadMarketingEmail = () => {
        this.setState({campaign: {}, create: false, isLoading: true, isDeleting: false});
        loadMarketingEmail(1, -1).then((res) => {

            this.setState({
                campaigns: res.data.data.marketing_campaigns,
                isLoading: false
            });

        });
    };

    deleteSource = (campaign) => {
        this.setState({
            isProcessing: true
        });
        deleteSource(campaign)
            .then(() => {
                this.loadMarketingEmail();
            }).catch(() => {
            showErrorNotification("Chiến dịch đang sử dụng không thể xóa!");
        }).finally(() => {
            this.setState({
                isProcessing: false
            });
        });
    };

    toggleDelete = () => {
        this.setState({
            isDeleting: !this.state.isDeleting
        });
    };

    editSource = (campaign) => {
        this.setState({
            campaign,
            create: true
        });
    };

    updateFormData = (event) => {
        this.setState({
            campaign: {
                ...this.state.campaign,
                name: event.target.value
            }
        });
    };


    toggle = () => {
        this.setState({
            create: !this.state.create
        });
    };

    saveMarketingCampaign = () => {
        if (isEmptyInput(this.state.campaign.name)) {
            showErrorNotification("Bạn cần nhập tên chiến dịch");
        } else if (isEmptyInput(this.state.campaign.color)) {
            showErrorNotification("Bạn cần chọn màu");
        } else {
            this.setState({
                isLoading: true,
                create: false
            });
            storeMarketingCampaign(this.state.campaign)
                .then(() => {
                    this.setState({
                        campaign: {},
                        create: false
                    });
                    this.loadMarketingEmail();
                });


        }
    };

    assignMarketingCampaign = (campaign) => {
        this.setState({
            isProcessing: true
        });
        assignMarketingCampaign(campaign.id, this.props.student.id)
            .then(() => {
                this.loadMarketingEmail();
                let {updateInfoStudent, student} = this.props;
                updateInfoStudent({...student, campaign_id: campaign.id});
                this.setState({
                    isProcessing: false
                });
            });
    };

    close = () => {
        this.setState({show: false});
    };

    changeColor = (color) => {
        color = color ? color.hex : '';
        this.setState({
            campaign: {
                ...this.state.campaign,
                color
            }
        });
    };

    campaignName = () => {
        let s = this.state.campaigns && this.state.campaigns.filter(i => i.id == this.props.student.campaign_id)[0];
        return s ? s.name : "N/A";
    };

    render() {
        let {isDeleting, isLoading, isProcessing} = this.state;
        let showLoading = isLoading || isProcessing;

        return (
            <div style={{position: "relative"}} className="source-value">
                <div className=""
                     onClick={() => this.setState({show: true})}>
                    {this.campaignName()}
                </div>
                <Overlay
                    rootClose={true}
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}>
                    <div className="kt-overlay" style={{width: "300px", marginTop: 25}}>


                        {!showLoading && <div style={{position: "relative"}}>
                            {
                                this.state.create ? (
                                    <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                       onClick={this.toggle}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                    </a>
                                ) : (
                                    <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                       onClick={() => this.setState({
                                           create: !this.state.create,
                                           campaign: {}
                                       })}>
                                        <i className="material-icons">add</i>
                                    </a>
                                )
                            }
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a'}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <div style={{textAlign: "center", fontSize: 16, color: 'black', marginBottom: 15}}>Chiến dịch
                            </div>
                        </div>}
                        <div>{showLoading && <Loading/>}</div>
                        {!this.state.create && !showLoading && <div>
                            <Search
                                placeholder="Tìm theo tên"
                                value={this.state.search}
                                onChange={search => this.setState({search})}
                            />
                        </div>}
                        {
                            this.state.create && !isProcessing ? (
                                <div>
                                    <FormInputText
                                        placeholder="Tên chiến dịch"
                                        name="name"
                                        updateFormData={this.updateFormData}
                                        value={this.state.campaign.name || ""}/>
                                    <div style={{paddingLeft: "15px", marginTop: "20px"}}>
                                        <CirclePicker
                                            width="100%"
                                            color={this.state.campaign.color}
                                            onChangeComplete={this.changeColor}/>
                                    </div>
                                    {
                                        isDeleting ? (
                                            <div>
                                                {!isProcessing && (
                                                    <div style={{display: "flex", flexWrap: 'no-wrap'}}>
                                                        <button style={{margin: "15px 0 10px 5px"}}
                                                                className="btn btn-white width-50-percent"
                                                                onClick={this.toggleDelete}>
                                                            Huỷ
                                                        </button>
                                                        <button style={{margin: "15px 5px 10px 0"}}
                                                                className="btn btn-danger width-50-percent"
                                                                onClick={() => this.deleteSource(this.state.campaign)}>
                                                            Xác nhận
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <div style={{display: "flex"}}>

                                                {/*{this.state.campaign.id &&*/}
                                                {/*    <button style={{margin: "15px 0 10px 5px"}}*/}
                                                {/*            className="btn btn-white width-50-percent"*/}
                                                {/*            onClick={this.toggleDelete}>*/}
                                                {/*        Xoá*/}
                                                {/*    </button>*/}
                                                {/*}*/}
                                                <button style={{margin: "15px 5px 10px 0"}}
                                                        className="btn btn-success width-50-percent"
                                                        onClick={this.saveMarketingCampaign}>
                                                    Lưu
                                                </button>

                                            </div>
                                        )
                                    }


                                </div>
                            ) : (
                                <div>
                                    {
                                        !showLoading && (
                                            <div>
                                                {this.state.campaigns && this.state.campaigns
                                                    .filter(campaign => {
                                                        const s1 = campaign.name.trim().toLowerCase();
                                                        const s2 = this.state.search.trim().toLowerCase();
                                                        return s1.includes(s2) || s2.includes(s1);
                                                    })
                                                    .map((campaign) => {
                                                        const campaignAdded = this.props.student && this.props.student.campaign_id == campaign.id;
                                                        return (
                                                            <div key={campaign.id} style={{display: "flex"}}>
                                                                <button
                                                                    onClick={() => {
                                                                        this.assignMarketingCampaign(campaign);
                                                                    }}
                                                                    className="btn"
                                                                    style={{
                                                                        textAlign: "left",
                                                                        backgroundColor: `#${campaign.color}`,
                                                                        width: "calc(100% - 30px)",
                                                                        margin: "2px 0",
                                                                        display: "flex",
                                                                        justifyContent: "space-between"
                                                                    }}>
                                                                    {campaign.name}
                                                                    <div>
                                                                        {campaignAdded ?
                                                                            <i className="material-icons">done</i> : ""}

                                                                    </div>
                                                                </button>
                                                                <div className="board-action"
                                                                     style={{lineHeight: "45px"}}>
                                                                    <a onClick={() => this.editSource(campaign)}><i
                                                                        className="material-icons">edit</i></a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }


                    </div>
                </Overlay>
            </div>
        );
    }
}

export default MarketingCampaignOverlay;