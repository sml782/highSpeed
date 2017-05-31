import './products.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,Message,Table,Checkbox,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData, access_token} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;

class UpdateProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          trainStation:[],
          spro:{},
          updatePro:{},
        }
    }

     componentWillMount() {
        
    }
    componentDidMount(){
        $('.add').parent().parent().find('.ant-modal-footer').eq(1).remove()
        const values = this.props.selectedProduct
        console.log(values)
        if(Object.keys(values).length){
            this.setState({
                updatePro:values
            })
            this.props.form.setFieldsValue({
                productCode:values.productCode,
                name:values.name,
                trainStation:values.trainStation,
                price:values.price
            })
        }else{
            this.props.form.resetFields()
        }
        
    }

    componentDidUpdate(){    
        
    }

    handleSubmit =(e)=>{
       console.log(e)
       e.preventDefault()
    }
   
    //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            getTrainStation(value,(station) => {
                console.log(station)
                if(station){
                    const trainStation = station.map((s) => {
                        return <AutoCompleteOption key={s.no+'&'+s.value}>{s.value}</AutoCompleteOption>;
                    })
                    _this.setState({ trainStation: trainStation})
                }
            })
        }
    }

    //添加/修改确认
    handleOk(){
        const _this = this
        const dtd = $.Deferred()
        this.props.form.validateFields((err, values) => {
            if(!err){
                    const selectedProduct = this.props.selectedProduct
                    if(values.trainStationId == selectedProduct.trainStationId){
                        values.trainStationId = selectedProduct.trainStationId
                        values.trainStation = selectedProduct.trainStation
                    }else{
                        const s = values.trainStation.split('&')
                        if(s.length > 1){
                            values.trainStationId = s[0]
                            values.trainStation = s[1]
                        }else{
                            values.trainStationId = this.state.updatePro.trainStationId
                            values.trainStation = s[0]
                        }
                        
                    }
                    values.productId = selectedProduct.productId
                    console.log(values)
                    $.ajax({
                        type: "POST",
                        //url: serveUrl + "/hsr-product/updateProduct?access_token="+User.appendAccessToken().access_token,
                        url: 'http://192.168.0.135:8888' + "/hsr-product/updateProduct?access_token="+User.appendAccessToken().access_token,
                        data: JSON.stringify({data:values}),      
                        success: function (data) {
                            console.log(data)
                            if(data.status == 200 ){
                                if(data.data != null){
                                    Message.error(data.msg);
                                }else{
                                    Message.success(data.msg);
                                    _this.props.handleUpdateCancel(() => {
                                        return false
                                    })
                                    _this.props.form.resetFields()
                                }
                            }else{
                                Message.error(data.msg);
                            }
                            _this.props.getInitList(1,10)
                            }
                        })
                    
                }
            
        })
        
        
    }

    //取消添加/修改
    handleCancel(){
        const _this = this
        this.props.handleUpdateCancel(() => {
            return false
        })
        this.props.form.resetFields()
    }
    

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const _this = this;
      const formI = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 14,
                offset: 6,
            },
        },
      };
      
       
        return (
            <div className="add">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formI}
                        label="休息室代码"
                    >
                        {getFieldDecorator('productCode', {
                            rules: [{ required: true, message: '请输入休息室代码!' }],
                        })(
                            <Input placeholder="请输入休息室代码" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formI}
                        label="休息室名称"
                    >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入休息室名称!' }],
                        })(
                            <Input placeholder="请输入休息室名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formI}
                        label="所属高铁站"
                    >
                        {getFieldDecorator('trainStation', {
                            rules: [{ required: true, message: '请输入高铁站!' }],
                        })(
                            <AutoComplete
                                dataSource={this.state.trainStation}
                                onChange={this.handleStationChange}
                                placeholder="请输入高铁站"
                            >
                            </AutoComplete>
                        )}
                    </FormItem>
                    <FormItem
                        {...formI}
                        label={(
                            <span>零售价格&nbsp;</span>
                        )}
                    >
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '请输入零售价格!', pattern: /\d+/g }],
                        })(
                            <Input placeholder="请输入零售价格" />
                        )}
                    </FormItem>
                    <div className="ant-modal-footer">
                        <button type="button" className="ant-btn ant-btn-lg" onClick={this.handleCancel.bind(this)}><span>取 消</span></button>
                        <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={_this.handleOk.bind(_this)}><span>确 定</span></button>
                    </div>
                </Form>
                
            </div>
        )
    }
}

UpdateProducts = Form.create()(UpdateProducts);

export default UpdateProducts;