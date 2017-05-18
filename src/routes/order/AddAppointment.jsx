import './order.less'
import './addAppointment.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const FormItem = Form.Item;

class AddAppointment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            formLayout: 'inline',
        }
    }

    componentWillMount () {

    }

    componentDidMount () {
        //TODO AJAX
    }

    componentWillUpdate () {

    }

    onchange () {

    }

    handleFormLayoutChange = (e) => {
        this.setState({ formLayout: e.target.value });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = this.state;
        const buttonItemLayout = null;
        const config = {
            rules: [{ type: 'object', message: '请选择高铁日期!' }],
        }

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>添加订单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <Form layout={formLayout} className="order-add-g">
                    <div className="order-client">
                        <div className="title">
                            <span>客户信息</span>
                        </div>
                        <Row style={{padding:'20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="客户名称" 
                                >
                                    {getFieldDecorator('clientName', {
                                        rules: [{
                                        required: true,message: '请输入客户名称!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>

                    <div className="order-passenger">
                        <div className="title">
                            <span>旅客信息</span>
                        </div>
                        <Row style={{padding:'20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="旅客姓名" 
                                >
                                    {getFieldDecorator('passengerName', {
                                        rules: [{
                                        required: true,message: '请输入旅客姓名!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="手机号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'0 20px 10px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="座位号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="第三方卡号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                    </div>

                    <div className="order-train">
                        <div className="title">
                            <span>高铁信息</span>
                        </div>
                        <Row style={{padding:'20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="旅客姓名" 
                                >
                                    {getFieldDecorator('passengerName', {
                                        rules: [{
                                        required: true,message: '请输入旅客姓名!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="手机号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'0 20px 10px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="座位号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="第三方卡号" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        <Col span={8}>
                            <FormItem
                                label="客户名称"
                            >
                                <Input placeholder="请输入客户名称" />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                label="高铁日期"
                            >
                                {getFieldDecorator('highSpeedDate', config)(
                                    <DatePicker />
                                )}
                           </FormItem>
                        </Col>
                        <FormItem {...buttonItemLayout}>
                            <Button type="primary" size="large">搜索</Button>
                        </FormItem>
                    </Row>
                </Form>
                <div className="order-menu">
                    <Button type="primary" className="add-order"><Link to="/addAppointment" >添加订单</Link></Button>
                    <Button className="leave-order">确认离开</Button>
                </div>
            </div>
        )
    }
}

AddAppointment = Form.create()(AddAppointment)

export default AddAppointment