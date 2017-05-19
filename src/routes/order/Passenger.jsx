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
            formLayout: 'inline',
            highSpeedNo:[],
            entrance:[],
            retiringRoom:[],
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

    render(){
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='passenger'>
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
            
        )
    }
}

Passenger = Form.create()(Passenger)

export default Passenger