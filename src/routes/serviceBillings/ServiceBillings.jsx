import './service.less'

import Static from './Static'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker, Tabs } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

function callback(key) {
  console.log(key);
}

class Order extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            formLayout: 'inline',
            tabsSelected:1,
        }
    }

    componentWillMount () {

    }

    componentDidMount () {
        //TODO AJAX
        $('.ant-tabs-ink-bar').remove();
    }

    componentWillUpdate () {

    }

    onchange (key) {
        this.setState({tabsSelected:key})
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

   

    

    render () {
        const { formLayout } = this.state;
        const formCol = { span: 4, offset:1};
        const buttonItemLayout = null;

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>服务账单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="server-bar">
                    <Tabs defaultActiveKey="1" onChange={this.onchange.bind(this)}>
                        <TabPane tab="统计账单" key="1">
                            <Static listChange={this.state.tabsSelected} />
                        </TabPane>
                        <TabPane tab="明细账单" key="2">
                            <Static listChange={this.state.tabsSelected} />
                        </TabPane>
                        <TabPane tab="零售客户统计账单" key="3">
                            <Static listChange={this.state.tabsSelected} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

Order = Form.create()(Order)

export default Order