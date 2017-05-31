import './order.less'

import OrderList from './OrderList'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const FormItem = Form.Item;

class Order extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            queryValues:[]
        }
    }

    componentWillMount () {
       
        
    }

    componentDidMount () {
        //TODO AJAX
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.queryTrainTime = moment(values.queryTrainTime).format("YYYY-MM-DD")
                console.log(values)
                this.setState({queryValues:values})
            }
            
        })
    }


    handleReset = () => {
        this.props.form.resetFields();
    }

    render () {
        const _this = this
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = this.state;
        const formCol = { span: 8};
        const buttonItemLayout = null;

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
                <Form layout={'inline'} className="order-search-g">
                    <Row className="order-search">
                        <Col {...formCol}>
                            <FormItem
                                label="高铁车次" 
                            >
                                {getFieldDecorator('queryTrainCode', {})(
                                    <Input placeholder="请输入客户车次" />
                                )}
                            </FormItem>
                        </Col>
                        <Col  {...formCol}>
                            <FormItem
                                label="旅客姓名" 
                            >   
                                {getFieldDecorator('queryTravellerName', {})(
                                    <Input placeholder="旅客姓名" />
                                )}
                            </FormItem>
                        </Col>
                         <Col  span={7} style={{marginLeft:35}}>
                            <div className='btn-add'><Link to='/addAppointment'><span>添加订单</span><img src={require('../../assets/images/add.png')} className='addImg'/></Link></div>
                        </Col>
                    </Row>
                    <Row className="order-search">
                        <Col  {...formCol}>
                            <FormItem
                                label="客户名称"
                            >
                                {getFieldDecorator('queryClientName', {})(
                                    <Input placeholder="请输入客户名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col  {...formCol}>
                            <FormItem
                                label="高铁日期"
                            >
                                {getFieldDecorator('queryTrainTime', {
                                    initialValue:moment(new Date(), 'YYYY-MM-DD')
                                })(
                                    <DatePicker />
                                )}
                           </FormItem>
                        </Col>                        
                        <Col  span={7} style={{marginLeft:35}}>
                            <div className='btn-search' onClick={_this.handleSearch.bind(_this)}><img src={require('../../assets/images/search.png')} className='seacrhImg'/><span>查&nbsp;询</span></div>
                       </Col>   
                    </Row>
                </Form>
                <OrderList initVal={_this.state.queryValues} />
            </div>
        )
    }
}

Order = Form.create()(Order)

export default Order