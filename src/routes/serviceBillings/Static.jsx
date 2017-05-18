import './service.less'

import ServiceList from './ServiceList'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker, Tabs } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;


class Order extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            formLayout: 'inline',
            listKey:1,
        }
    }

    componentWillMount () {
        let key = this.props.listChange
        var k = 1
        console.log(key)
        this.setState({listKey:key})
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
        const { formLayout } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formCol = { span: 6, offset:1};
        const buttonItemLayout = null;
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择时间!' }],
        };

        return (
            <div>
                <div className="server-title">
                    <span>查询条件</span>
                </div>
                <div className="service-form">
                    <Form layout={formLayout} className="order-search-g">
                        <Row className="order-search">
                            <Col {...formCol}>
                                <FormItem
                                    label="高铁车站" 
                                >
                                    <Input placeholder="请输入高铁车站" />
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="休息室名称" 
                                >
                                    <Input placeholder="请输入休息室名称" />
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
                                    label="日期" 
                                    className="service-form-date" 
                                >
                                    {getFieldDecorator('range-picker', rangeConfig)(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="日期" 
                                    className="service-form-date" 
                                >
                                    {getFieldDecorator('range-time-picker', rangeConfig)(
                                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="order-search service-serc">
                            <Col  {...formCol}>
                               <FormItem {...buttonItemLayout}>
                                    <Button type="primary" size="large">搜索</Button>
                                    <Button type="primary" size="large">明细账单</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="service-list">
                    <ServiceList listKey={this.state.listKey} />
                </div>
            </div>
        )
    }
}

Order = Form.create()(Order)

export default Order