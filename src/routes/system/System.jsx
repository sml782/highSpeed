import './system.less'

import Part from '../part/Part'
import Menu from '../menu/Menu'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker, Tabs } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class System extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
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
        const formCol = { span: 4, offset:1};

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="system-bar">
                    <Tabs defaultActiveKey="1" onChange={this.onchange.bind(this)}>
                        <TabPane tab="角色管理" key="1">
                            <Part />
                        </TabPane>
                        <TabPane tab="菜单管理" key="2">
                            <Menu />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

System = Form.create()(System)

export default System