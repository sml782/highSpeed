import './service.less'

import ServiceList from './ServiceList'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker, Tabs } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import getTrainStation from '../../utils/station';//引入所属高铁站
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;


class Order extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            listKey:1,
            trainStation:[],
            billList:null,
        }
    }

    componentWillMount () {
        let key = this.props.listChange
        var k = 1
        this.setState({listKey:key})
        if(key*1 == 2){
            this.setState({
              url:'/hsr-order/getDetailBill'
          })
        }else if(key*1 == 1){
            this.setState({
              url:'/hsr-order/getCountBill'
            })
        }else if(key*1 == 3){
            this.setState({
              url:'/hsr-order/getRetailBill'
            })
        }
    }

    componentDidMount () {
        //TODO AJAX
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            const _this = this;
            values.page = _this.state.page
            values.rows = _this.state.rows
            $.ajax({
                type: "GET",
                //url: serveUrl+"/hsr-role/getEmployeeById?access_token="+ User.appendAccessToken().access_token,
                url:'http://192.168.0.135:8888'+_this.state.url+'?access_token='+ User.appendAccessToken().access_token,
                data:JSON.stringify(values),
                success: function(data){
                    console.log(data)
                    data.data.rows.map((v,index)=>{
                        v.key = index
                        v.orderId = 123
                    })
                    _this.setState({
                        billList: data.data.rows
                    })
                }
            });
        });
    }

    handleFormLayoutChange = (e) => {
        this.setState({ formLayout: e.target.value });
    }

     //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            getTrainStation(value,(station) => {
                const trainStation = station.map((s) => {
                     const key = s.no +'&'+s.value
                    return <AutoCompleteOption key={key}>{s.value}</AutoCompleteOption>;
                })
                _this.setState({ trainStation: trainStation})
            })
        }
    }

    

    render () {
        const { getFieldDecorator } = this.props.form;
        const formCol = { span: 8};
        const buttonItemLayout = null;

        return (
            <div>
                <div className="service-form">
                    <Form layout={'inline'} className="order-search-g">
                        <Row className="order-search">
                            <Col {...formCol}>
                                <FormItem
                                    label="高铁车站" 
                                >
                                      {getFieldDecorator('trainName')(
                                        <AutoComplete
                                            dataSource={this.state.trainStation}
                                            onChange={this.handleStationChange}
                                            placeholder="请输入高铁站"
                                        />
                                      )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="休息室名称" 
                                >
                                  {getFieldDecorator('clientName')(
                                    <Input placeholder="请输入休息室名称" />)}
                                </FormItem>
                            </Col>
                             <Col  span={7} style={{marginLeft:35}}>
                                    <div className='btn-search'><img src={require('../../assets/images/search.png')} className='seacrhImg'/><span>查&nbsp;询</span></div>
                            </Col>  
                        </Row>
                        <Row className="order-search">
                            <Col  {...formCol}>
                                <FormItem
                                    label="客户名称"
                                >
                                      {getFieldDecorator('productName')(
                                    <Input placeholder="请输入客户名称" />
                                      )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="日期" 
                                >
                                    {getFieldDecorator('range-picker')(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="日期"  
                                >
                                    {getFieldDecorator('range-time-picker')(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                           
                        </Row>
                        
                    </Form>
                </div>
                <div className="service-list">
                    <ServiceList listKey={this.state.listKey} listData={this.state.billList} />
                </div>
            </div>
        )
    }
}

Order = Form.create()(Order)

export default Order