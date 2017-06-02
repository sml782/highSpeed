import './order.less'
import './addAppointment.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

class Passenger extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }

    componentWillMount () {

    }

    componentDidMount () {
        //TODO AJAX
        //console.log($('.addp').parent().parent())
        $('.addp').parent().parent().next('.ant-modal-footer').remove()
        const values = this.props.values
        if(values.travellerName){
             this.props.form.setFieldsValue({
                travellerName:values.travellerName,
                phoneNumber:values.phoneNumber,
                seatNum:values.seatNum,
                thirdPartCode:values.thirdPartCode,
            })
        }
       
    }

    componentWillUpdate () {

    }



    onchange () {

    }

    //增加
    addPassenger = () => {
        const _this = this
        var values
        this.props.form.validateFields((err, value) => {
            if(!err){
                values = value
            }
        })
        this.props.add(()=>{
            return values
        })
        
    }
    //取消添加
    addCancel = () => {
        this.props.form.resetFields()
        this.props.hide(()=>{
            return false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    render(){
        const _this = this
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='passenger'>
                <Form layout={'inline'} style={{margin:'0px 16px'}} onSubmit={_this.handleSubmit.bind(_this)}>
       
                            <FormItem
                                label="旅客姓名"
                                style={{ margin:'10px 0px'}} 
                            >
                                {getFieldDecorator('travellerName', {
                                    rules: [{
                                        required: true,message: '请输入旅客姓名!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                       
                            <FormItem
                                label="手机号" 
                                style={{ margin:'10px 0px'}} 
                            >
                                {getFieldDecorator('phoneNumber', {
                                    rules: [{
                                        required:true, pattern:/^1[3|4|5|7|8][0-9]\d{4,8}$/gi, message: '请输入手机号!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                 
                            <FormItem
                                label="座位号" 
                                style={{ margin:'10px 0px'}} 
                            >
                                {getFieldDecorator('seatNum', {
                                    rules: [{
                                        message: '请输入座位号!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                      
                            <FormItem
                                label="第三方卡号" 
                                style={{ margin:'10px 0px'}} 
                            >
                                {getFieldDecorator('thirdPartCode', {
                                    rules: [{
                                        message: '请输入第三方卡号!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
            
                    
                </Form>
                <div className="ant-modal-footer addp">
                    <button type="button" className="ant-btn ant-btn-lg" onClick={_this.addCancel.bind(_this)}><span>取 消</span></button>
                    <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={_this.addPassenger.bind(_this)}><span>确 定</span></button>
                </div>
            </div>
            
        )
    }
}

Passenger = Form.create()(Passenger)

export default Passenger