import React from "react";
import Loading from "../../components/common/Loading";
import store from "./EvaluateTeachingStore";
import Select from '../../components/common/Select';
import {observer} from "mobx-react";
import EvaluateTeaching from "./EvaluateTeaching";

@observer
class EvaluateTeachingContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        store.loadGens();
        store.loadBases();
    }


    onChangeGen(value) {
        store.selectedGenId = value;
        store.loadEvaluate();
    }

    onChangeBase(value) {
        store.selectedBaseId = value;
        store.loadEvaluate();
    }

    onChangeTeaching(value) {
        store.selectedTeaching = value;
        store.loadEvaluate();
    }

    render() {
        return (
            <div>
                {store.isLoadingGen || store.isLoadingBase ?
                    <Loading/>
                    :
                    <div>

                        <div>
                            <div className="row">
                                <div className="col-sm-4 col-xs-5">
                                    <Select
                                        defaultMessage={'Chọn khóa học'}
                                        options={store.gensData}
                                        value={store.selectedGenId}
                                        onChange={this.onChangeGen}
                                    />
                                </div>
                                <div className="col-sm-4 col-xs-5">
                                    <Select
                                        defaultMessage={'Chọn cơ sở'}
                                        options={store.basesData}
                                        value={store.selectedBaseId}
                                        onChange={this.onChangeBase}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-3">
                                    <Select
                                        defaultMessage={'Chọn hình thức giảng dạy'}
                                        options={store.teachings}
                                        value={store.selectedTeaching}
                                        onChange={this.onChangeTeaching}
                                    />
                                </div>
                            </div>
                            <EvaluateTeaching/>
                        </div>
                    </div>
                }
            </div>

        );
    }
}

EvaluateTeachingContainer.propTypes = {};

export default EvaluateTeachingContainer;

// Có 2 trường start_time và start_time_form để chỉ tgian bắt đầu nhưng do thư viện moment nên start_time ko có end_time (end_time
// tự tính trong apis)
