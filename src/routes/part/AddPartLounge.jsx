import './addpart.less'
import './addLounge.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Cascader,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '是否删除?';

class AddPartLounge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trainStation:[],
            stationDataLength:0,
            lounges:[],
            addFormResult:[],

            stationList:[],//高铁列表
            loungeList:[],//高铁对应休息室列表

        }
    }

     componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
        //获取高铁列表
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "hsr-order/getTrainStationDropdownList",
            data: {access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    const Adata = [];
                    data.data.map((k) => {
                        Adata.push(k.value);
                    })
                    _this.setState({
                        stationList: Adata
                    })
                }
            }
        }); 
    }
    componentDidMount () {
        $('.add-lounges').parent().parent().parent().find('.ant-modal-footer').eq(1).remove()
        $(".ant-input ant-input ant-select-search__field").css({width:300});
    }

    componentDidUpdate(){
    
    }

    //获取高铁站对应的休息室
    AutoCompleteChange=(e)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "hsr-order/getTrainStationDropdownList",
            data: { access_token: User.appendAccessToken().access_token,name:e},
            success: function(data) {
                if (data.status == 200) {
                    const Adata = [];
                    data.data.map((k) => {
                        Adata.push(k.value);
                    })
                    _this.setState({
                        stationList: Adata
                    })
                    if(data.data.length == 1){
                        $.ajax({
                            type: "GET",
                            url: serveUrl + "hsr-product/getProductByHsOrId",
                            data: {access_token: User.appendAccessToken().access_token,data:_this.props.form.getFieldValue('stationName').toString()},
                            success: function (data) {
                                if (data.status == 200) {
                                    data.data.rows.map(k=>{
                                        k.key = k.productId;
                                    });
                                    _this.setState({
                                        loungeList:data.data.rows
                                    });
                                }
                            }
                        }); 
                    }
                }
            }
        });
    }

    //取消
    handleCancle = () => {
        this.props.form.resetFields()
        this.props.addCancle()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const _this = this;
        const Options1 = this.state.loungeList.map(k => <Option key={k.productId} value={k.productId.toString()+"&"+k.name}>{k.name}</Option>);

        return (
            <div className="add-lounges">
                <Form style={{marginTop:44}} onSubmit={_this.handleSubmit} >
                    <FormItem label="高铁站" {...formItemLayout} >
                        {getFieldDecorator('stationName', {
                            rules: [
                                { required: true, message: '请选择高铁站!' },
                            ],
                        })(
                            <AutoComplete
                                dataSource={this.state.stationList}
                                placeholder="请输入高铁站名称"
                                onChange={this.AutoCompleteChange}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关联休息室" >
                        {getFieldDecorator('lounge', {
                            rules: [
                                { required: true, message: '请选择休息室!' },
                            ],
                        })(
                            <Select style={{width:200}}>
                                {Options1}
                            </Select>
                        )}
                    </FormItem>
                    
                    
                </Form>
                <Row>
                    <Col span={24} style={{ textAlign: 'left' }} >
                        <div className="ant-modal-footer addp">
                            <button type="button" className="ant-btn ant-btn-lg" onClick={_this.handleCancle.bind(_this)}><span>取 消</span></button>
                            <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={
                                (data)=>{
                                    this.props.form.validateFields((err, values) => {
                                        if (!err) {
                                            const newArr = values.lounge.split("&");
                                            const dataSource = [];
                                            dataSource.push({
                                                stationName:values.stationName,
                                                productId:parseInt(newArr[0]),
                                                lounge:newArr[1]
                                            });
                                            this.props.addProduct(dataSource);
                                        }
                                    })
                                }}><span>确 定</span></button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

AddPartLounge = Form.create()(AddPartLounge);

export default AddPartLounge;