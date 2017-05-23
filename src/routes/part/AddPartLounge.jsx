import './addpart.less'
import './addLounge.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Cascader,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import getTrainStation from '../../utils/station';//引入所属高铁站

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
            addFormResult:[]
        }
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        // this.getInit()

    }
    componentDidMount () {
        $('.add-lounges').parent().parent().parent().find('.ant-modal-footer').eq(1).remove()
        
    }

    componentDidUpdate(){
    
    }
    
    //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            setTimeout(() => {
                getTrainStation(value,(station) => {
                    console.log(station)
                    const trainStation = station.map((s) => {
                        return <AutoCompleteOption key={s.value}>{s.value}</AutoCompleteOption>;
                    })
                    _this.setState({ trainStation: trainStation})
                })
            },300)
        }
    }

    //休息室结果
    loungeSelect = (value) => {
        console.log('选择了休息室',value)
        const _this = this
        $.ajax({
            type: 'POST',
            url: serveUrl+"/hsr-product/getProductByHsOrId?access_token="+ User.appendAccessToken().access_token,
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                data:value,
            }),
            success: function(data){
                const lounges = []
                data.data.map((v,i) => {
                    lounges.push(<Option value={v.productId}>{v.product}</Option>)
                })
                _this.setState({lounges:lounges})
            }
        })
    }

    handleOk = () => {
        this.props.hideForm(() => {
            return false
        })
        this.props.form.validateFields((err,values) => {
            if(!err){
                this.props.getModalForm(() => {
                    return values
                })
            }
            
        })
    }
    handleCancle = () => {
        this.props.hideForm(() => {
            return false
        })
        this.props.form.resetFields()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const _this = this;

        return (
            <div className="add-lounges">
                <Form style={{marginTop:44}} onSubmit={_this.handleSubmit} >
                    <FormItem label="关联高铁站" {...formItemLayout} >
                        {getFieldDecorator('stationName', {
                            rules: [
                                { required: true, message: '请选择高铁站!' },
                            ],
                        })(
                            <AutoComplete
                                onChange={_this.handleStationChange.bind(_this)}
                                onBlur={_this.loungeSelect}
                                dataSource={_this.state.trainStation}
                                placeholder="请输入高铁站"
                                style={{width:250}}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关联休息室" >
                        {getFieldDecorator('lounge', {
                            rules: [
                                { required: true, message: '请选择休息室!' },
                            ],
                        })(
                            <Select mode="multiple" placeholder="请选择休息室" style={{width:250}}>
                                {_this.state.lounges}
                            </Select>
                        )}
                    </FormItem>
                    
                    <div className="ant-modal-footer">
                        <button type="button" className="ant-btn ant-btn-lg" onClick={this.handleCancle.bind(this)}><span>取 消</span></button>
                        <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={this.handleOk} ><span>确 定</span></button>
                    </div>
                </Form>
            </div>
        )
    }
}

AddPartLounge = Form.create()(AddPartLounge);

export default AddPartLounge;