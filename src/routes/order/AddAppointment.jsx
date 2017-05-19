import './addAppointment.less'

import Passenger from './Passenger'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

class AddAppointment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            formLayout: 'inline',
            highSpeedNo:[],
            entrance:[],
            retiringRoom:[],
            passengerCount:1,
            passenger:[<Passenger key={1} />],
        }
    }

    componentWillMount () {

    }

    componentDidMount () {
        //TODO AJAX
        var count = this.state.passengerCount
        if(count > 1){
            $('.delPassenger').show()
        }else{
            $('.delPassenger').hide()
        }
    }

    componentWillUpdate () {

    }

    onchange () {

    }
    
    //增加旅客
    addPass (){
        var count = this.state.passengerCount
        var passenger = this.state.passenger
        count++
        passenger.push(<Passenger key={count} />)
        this.setState({passengerCount:count,passenger:passenger})
        if(count > 1){
            $('.delPassenger').show()
        }else{
            $('.delPassenger').hide()
        }
    }
    //删除旅客
    delPass (){
        var count = this.state.passengerCount
        var passenger = this.state.passenger
        count--
        passenger.pop()
        this.setState({passengerCount:count,passenger:passenger})
        if(count > 1){
            $('.delPassenger').show()
        }else{
            $('.delPassenger').hide()
        }
    }

    handleFormLayoutChange = (e) => {
        this.setState({ formLayout: e.target.value });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }
    //请求高铁车次
    handleHighSpeedChange = (value) => {
        let highSpeedNo;
        if (!value) {
            highSpeedNo = [];
        } else {
            highSpeedNo = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ highSpeedNo });
    }
    //请求高铁检票口
    handleEntranceChange = (value) => {
        let entrance;
        if (!value) {
            entrance = [];
        } else {
            entrance = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ entrance });
    }
    //请求休息室名称
    handleRetiringRoomChange = (value) => {
        let retiringRoom;
        if (!value) {
            retiringRoom = [];
        } else {
            retiringRoom = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ retiringRoom });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = this.state;
        
        const buttonItemLayout = null;
        const trainDate = {
            rules: [{ type: 'object', message: '请选择高铁日期!' }],
        }
        const drivingTime = {
            rules: [{ type: 'object', required: true, message: '请选择开车时间!' }],
        };
        const checkinTime = {
            rules: [{ type: 'object', required: true, message: '请选择检票时间!' }],
        };
        const arriveTime = {
            rules: [{ type: 'object', message: '请选择客户到达时间!' }],
        };
        const leaveTime = {
            rules: [{ type: 'object', message: '请选择客户离开时间!' }],
        };
        //高铁车次
        const { highSpeedNo } = this.state;
        const highSpeedOptions = highSpeedNo.map((highSpeed) => {
            return <AutoCompleteOption key={highSpeed}>{highSpeed}</AutoCompleteOption>;
        });
        //检票口
        const { entrance } = this.state;
        const entranceOptions = entrance.map((entr) => {
            return <AutoCompleteOption key={entr}>{entr}</AutoCompleteOption>;
        });
        //休息室名称
        const { retiringRoom } = this.state;
        const retiringRoomOptions = retiringRoom.map((retiring) => {
            return <AutoCompleteOption key={retiring}>{retiring}</AutoCompleteOption>;
        });
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
                            <div className='passengerButton'>
                                <Button type="primary" ghost onClick={ this.delPass.bind(this) } className="delPassenger">删除旅客</Button>
                                <Button type="primary" ghost onClick={ this.addPass.bind(this) } className="addPassenger">增加旅客</Button>
                            </div>
                        </div>
                        {this.state.passenger}
                    </div>

                    <div className="order-train">
                        <div className="title">
                            <span>高铁信息</span>
                        </div>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="高铁日期"
                                >
                                    {getFieldDecorator('highSpeedDate', trainDate)(
                                        <DatePicker />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                        label="开车时间"
                                    >
                                    {getFieldDecorator('drivingTime', drivingTime)(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="高铁车次"
                                >
                                    {getFieldDecorator('highSpeedNo', {
                                        rules: [{ required: true, message: '请选择高铁车次!' }],
                                    })(
                                        <AutoComplete
                                            dataSource={highSpeedOptions}
                                            onChange={this.handleHighSpeedChange}
                                            placeholder="请选择"
                                        >
                                            <Input />
                                        </AutoComplete>
                                    )}
                                    </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                        label="检票时间"
                                    >
                                    {getFieldDecorator('checkinTime', checkinTime)(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="出发地"
                                >
                                    {getFieldDecorator('departure', {
                                        rules: [{ message: '请选择出发地!' }],
                                    })(
                                        <Select placeholder="请选择">
                                            <Option value="杭州东站">杭州东站</Option>
                                            <Option value="杭州站">杭州站</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="检票口"
                                >
                                    {getFieldDecorator('entrance', {
                                        rules: [{ message: '请选择检票口!' }],
                                    })(
                                        <AutoComplete
                                            dataSource={highSpeedOptions}
                                            onChange={this.handleHighSpeedChange}
                                            placeholder="请选择"
                                        >
                                            <Input />
                                        </AutoComplete>
                                    )}
                                    </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="目的地"
                                >
                                    {getFieldDecorator('destination', {
                                        rules: [{ message: '请选择目的地!' }],
                                    })(
                                        <Select placeholder="请选择">
                                            <Option value="北京站">北京站</Option>
                                            <Option value="北京南站">北京南站</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="order-service">
                        <div className="title">
                            <span>服务信息</span>
                        </div>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="休息室名称"
                                >
                                    {getFieldDecorator('retiringRoom', {
                                        rules: [{ required: true, message: '请选择休息室名称!' }],
                                    })(
                                        <AutoComplete
                                            dataSource={retiringRoomOptions}
                                            onChange={this.handleRetiringRoomChange}
                                            placeholder="请选择"
                                        >
                                            <Input />
                                        </AutoComplete>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                        label="客户到达时间"
                                    >
                                    {getFieldDecorator('arriveTime', arriveTime)(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                        label="客户离开时间"
                                    >
                                    {getFieldDecorator('leaveTime', leaveTime)(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="服务人次" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="是否收费"
                                >
                                    {getFieldDecorator('chargeOrNot', {
                                        rules: [{ message: '请选择!' }],
                                    })(
                                        <Select placeholder="请选择">
                                            <Option value="是">是</Option>
                                            <Option value="否">否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="收费类型"
                                >
                                    {getFieldDecorator('chargeType', {
                                        rules: [{ message: '请选择收费类型!' }],
                                    })(
                                        <Select placeholder="请选择">
                                            <Option value="刷卡">刷卡</Option>
                                            <Option value="现金">现金</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="服务价格" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="order-service">
                        <div className="title">
                            <span>登记信息</span>
                        </div>
                        <Row style={{padding:'10px 20px 20px'}}>
                            <Col span={8}>
                                <FormItem
                                    label="登记人" 
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="order-submit">
                        <Row style={{padding:'20px'}}>
                            <Button type="primary">提交</Button>
                        </Row>
                    </div>
                </Form>
            </div>
        )
    }
}

AddAppointment = Form.create()(AddAppointment)

export default AddAppointment