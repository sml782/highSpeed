import './order.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, Message, Table, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import { serveUrl, User, cacheData, access_token} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站
const msg = '确定删除吗?'


class OrderList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            orderListDate: [],
            orderListDateLength:0,
            orderListPage: 1,
            orderListRows: 10,
            selectedRowKeys: [],
            searchValue: '',
            menuListDate: [],
            menuIds: [],
            visibleDel:false,
            selectedOrder:{},
            filteredInfo: null,
            sortedInfo: null,
        }
        this.getInitList = this.getInitList.bind(this)
    }

    componentWillMount () {
 
    }

    componentDidMount () {
        //TODO AJAX
        this.getInitList(this.state.orderListPage, this.state.orderListRows)
        // this.props.form.validateFields((err, value) => {
        //   if(!err){
        //       console.log(value.queryTrainTime)
        //   }
        // })
    }

    componentWillUpdate () {

    }

    componentWillReceiveProps (values) {
        var v = Object.keys(values.initVal)
        if(v.length){
            this.getInitList(this.state.orderListPage, this.state.orderListRows, values.initVal)
        }
    }

    //获取
    getInitList(page, rows, values) {
        const _this = this;
        const data =  $.extend({
                page: page,
                rows: rows,
            },values)
        console.log(data)
        $.ajax({
            type: "GET",
            //url: serveUrl+'/hsr-order/getOrderByKey?access_token=' + User.appendAccessToken().access_token,
            url: 'http://192.168.0.135:8888' + "/hsr-order/getOrderByKey?access_token="+User.appendAccessToken().access_token,
            data: data,
            success: function (data) {
                console.log(data)
                if(data.status == 200 ){
                    if(data.data != null){
                        Message.success(data.msg);
                        const len = data.data.rows.length
                        const d = data.data.rows
                        for(var i = 0;i < len;i++){
                            d[i].key = d[i].orderId
                            d[i].children = d[i].travellerList
                            //高铁
                            d[i].trainCode = d[i].train.trainCode?d[i].train.trainCode:'--'
                            d[i].trainTime = d[i].train.trainTime?d[i].train.trainTime:'--'
                            d[i].startPlace = d[i].train.startPlace?d[i].train.startPlace:'--'
                            d[i].destinationPlace = d[i].train.destinationPlace?d[i].train.destinationPlace:'--'
                            //d[i].startTime = d[i].train.startTime?d[i].train.startTime:'--'
                            //d[i].checkTime = d[i].train.checkTime?d[i].train.checkTime:'--'
                            d[i].ticketBarrier = d[i].train.ticketBarrier?d[i].train.ticketBarrier:'--'
                            //收费
                            // d[i].isCharge = d[i].isCharge?'是':'否'
                            // d[i].type = d[i].type?d[i].type:'--'
                            // d[i].price = d[i].price?d[i].price:'--'
                            //登记人
                            d[i].register = d[i].register?d[i].register:'--'

                            var travellerName = ''
                            var phoneNumber = [d[i].travellerList[0].phoneNumber?d[i].travellerList[0].phoneNumber:'--']
                            var seatNum = [d[i].travellerList[0].seatNum?d[i].travellerList[0].seatNum:'--']
                            var thirdPartCode = [d[i].travellerList[0].thirdPartCode?d[i].travellerList[0].thirdPartCode:'--']
                            for(var k = 0;k < d[i].travellerList.length;k++){
                                d[i].travellerList[k].key = d[i].travellerList[k].travellerId
                                d[i].travellerList[k].travellerName = d[i].travellerList[k].travellerName?d[i].travellerList[k].travellerName:'--'
                                d[i].travellerList[k].phoneNumber = d[i].travellerList[k].phoneNumber?d[i].travellerList[k].phoneNumber:'--'
                                d[i].travellerList[k].seatNum = d[i].travellerList[k].seatNum?d[i].travellerList[k].seatNum:'--'
                                d[i].travellerList[k].thirdPartCode = d[i].travellerList[k].thirdPartCode?d[i].travellerList[k].thirdPartCode:'--'
                                travellerName += d[i].travellerList[k].isDeleted?'':d[i].travellerList[k].travellerName + '、'
                            }
                            d[i].travellerName = travellerName.substring(0,travellerName.length-1)
                            d[i].phoneNumber = phoneNumber
                            d[i].seatNum = seatNum
                            d[i].thirdPartCode = thirdPartCode
                        }
                        console.log(data.data.rows)
                        _this.setState({
                            orderListDate: d,
                            orderListDateLength: data.data.total,
                        })
                    }else{
                        Message.error(data.msg);
                        
                    }
                }else{
                    message.error(data.msg);
                }
            }
        });
    }


    //删除弹窗
    handleOkDel = (record) => {
        const _this = this
        $.ajax({
            type: "POST",
            //url: serveUrl + "/hsr-order/deleteOrder?access_token="+User.appendAccessToken().access_token,
            url: 'http://192.168.0.135:8888' + "/hsr-order/deleteOrder?access_token="+User.appendAccessToken().access_token,
            data: {orderId:record.orderId},      
            success: function (data) {
                console.log(data)
                if(data.status == 200 ){
                    if(data.data != null){
                        Message.error(data.msg);
                    }else{
                        Message.success(data.msg);
                        _this.getInitList(_this.state.orderListPage, _this.state.orderListRows)
                    }
                }else{
                    Message.error(data.msg);
                }
            }
        })
    }

    //编辑跳转
    changeOrder = (record) => {
        console.log(record)
        this.setState({selectedOrder:record})
        hashHistory.push(`/updateAppointment/${record.orderId}`)
    }
    showTotal(total) {
      return `共 ${total} 条`;
    }
    
    render () {
        const _this = this
        const pagination = {
           size:'small',
           showTotal:_this.showTotal ,
            total: _this.state.orderListDateLength,
            onShowSizeChange(current, pageSize) {
                _this.state.orderListPage = current;
                _this.state.orderListRows = pageSize;
                _this.getInitList(_this.state.orderListPage,_this.state.orderListRows);
            },
            onChange(current) {
                _this.state.orderListPage = current;
                _this.getInitList(_this.state.orderListPage,_this.state.orderListRows);
            },

      };
      const columns = [{
        title: '订单编号',
        dataIndex: 'orderId',
        width:150,
        fixed: 'left',
      }, {
        title: '高铁车次',
        dataIndex: 'trainCode',
        width:100,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '高铁日期',
        dataIndex: 'trainTime',
        width:110,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{moment(text).format('YYYY-MM-DD')}</span>
            </div>),
      }, {
        title: '出发地',
        dataIndex: 'startPlace',
        width:70,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '目的地',
        dataIndex: 'destinationPlace',
        width:70,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '开车时间',
        dataIndex: 'startTime',
        width:110,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '检票时间',
        dataIndex: 'checkTime',
        width:110,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '检票口',
        dataIndex: 'ticketBarrier',
        width:70,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '旅客姓名',
        dataIndex: 'travellerName',
        width:110,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '手机号码',
        dataIndex: 'phoneNumber',
        width:130,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '座位号',
        dataIndex: 'seatNum',
        width:70,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '第三方卡号',
        dataIndex: 'thirdPartCode',
        width:130,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '客户名称',
        dataIndex: 'clientName',
        width:90,
        render: (text,record) => (
            <div>
                <span >{text?text:'--'}</span>
            </div>),
      }, {
        title: '休息室名称',
        dataIndex: 'productName',
        width:130,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '客户到达时间',
        dataIndex: 'travellerComeTime',
        width:140,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '客户离开时间',
        dataIndex: 'travellerLeaveTime',
        width:140,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{text?moment(text).format('HH:mm'):'--'}</span>
            </div>),
      }, {
        title: '服务人次',
        dataIndex: 'travellerNum',
        width:90,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '是否收费',
        dataIndex: 'isCharge',
        width:90,
        render: (text,record) => (
            <div>
                <span >{text?'是':'否'}</span>
            </div>),
      }, {
        title: '收费类型',
        width:90,
        dataIndex: 'type',
        render: (text,record) => (
            <div>
                <span >{text == ''?'--':text}</span>
            </div>),
      }, {
        title: '收费价格',
        dataIndex: 'price',
        width:90,
        render: (text,record) => (
            <div>
                <span >{text?text:'--'}</span>
            </div>),
      }, {
        title: '登记人',
        dataIndex: 'register',
        width:70,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '登记时间',
        dataIndex: 'registTime',
        width:140,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '订单状态',
        dataIndex: 'status',
        width:80,
        render: (text,record) => (
            <div>
                <span >{text?'已消费':'已取消'}</span>
            </div>),
      }, {
        title: '操作',
        dataIndex: 'handle',
        fixed: 'right',
        width:120,
        render: (text,record) => (<div>
            <span className='listRefresh' onClick={_this.changeOrder.bind(_this,record)}>编辑</span>
            <Popconfirm title="确认删除?" onConfirm={_this.handleOkDel.bind(_this,record)}>
                <span  style={{marginLeft:4}} className='listCancel'>取消</span>
            </Popconfirm>
        </div>),
      }];
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User',    // Column configuration not to be checked
        }),
      };
        return (
            <div className="search-result-list" >
                <Table className="order-list" columns={columns} pagination={pagination} dataSource={_this.state.orderListDate} scroll={{x: '190%', y: 0}} />
            </div>
        )
    }
}

export default OrderList