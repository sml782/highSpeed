import './order.less'

import OrderList from './OrderList'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const FormItem = Form.Item;

class Order extends React.Component {
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

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
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
        const formCol = { span: 6, offset:1};
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
                        </Breadcrumb>
                    </div>
                </div>
                <Form layout={formLayout} className="order-search-g">
                    <Row className="order-search">
                        <Col {...formCol}>
                            <FormItem
                                label="高铁车次" 
                            >
                                <Input placeholder="请输入客户车次" />
                            </FormItem>
                        </Col>
                        <Col  {...formCol}>
                            <FormItem
                                label="旅客姓名" 
                            >
                                <Input placeholder="旅客姓名" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="order-search">
                        <Col  {...formCol}>
                            <FormItem
                                label="客户名称"
                            >
                                <Input placeholder="请输入客户名称" />
                            </FormItem>
                        </Col>
                        <Col  {...formCol}>
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
                <OrderList />
            </div>
        )
    }
}

Order = Form.create()(Order)

export default Order