

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const columns = []
columns[0] = [{
  title: '高铁日期',
  dataIndex: 'date',
  width:130,
}, {
  title: '高铁车站',
  dataIndex: 'station',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'lounge',
  width:130,
}, {
  title: '客户名称1',
  dataIndex: 'name1',
  width:110,
}, {
  title: '服务次数',
  dataIndex: 'degree1',
  width:110,
}, {
  title: '客户名称2',
  dataIndex: 'name2',
  width:110,
}, {
  title: '服务次数',
  dataIndex: 'degree2',
  width:110,
}, {
  title: '客户名称3',
  dataIndex: 'name3',
  width:110,
}, {
  title: '服务次数',
  dataIndex: 'degree3',
  width:110,
}, {
  title: '接待统计',
  dataIndex: 'count',
  width:130,
}]

columns[1] = [{
  title: '订单编号',
  dataIndex: 'no',
  width:150,
  fixed:'left',
}, {
  title: '高铁车站',
  dataIndex: 'station',
  width:110,
}, {
  title: '高铁日期',
  dataIndex: 'date',
  width:130,
}, {
  title: '休息室名称',
  dataIndex: 'lounge',
  width:130,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width:110,
}, {
  title: '旅客姓名',
  dataIndex: 'passengerName',
  width:110,
}, {
  title: '车次',
  dataIndex: 'trainNo',
  width:110,
}, {
  title: '出发地',
  dataIndex: 'departure',
  width:110,
}, {
  title: '目的地',
  dataIndex: 'destination',
  width:110,
}, {
  title: '开车时间',
  dataIndex: 'drivingTime',
  width:130,
}, {
  title: '服务次数',
  dataIndex: 'count',
  width:100,
}, {
  title: '检票时间',
  dataIndex: 'checkinTime',
  width:100,
}, {
  title: '旅客进入时间',
  dataIndex: 'entranceTime',
  width:130,
}, {
  title: '旅客离开时间',
  dataIndex: 'leaveTime',
  width:130,
}, {
  title: '休息时长',
  dataIndex: 'restTime',
  width:130,
}, {
  title: '卡号',
  dataIndex: 'cartNo',
  width:130,
}]

columns[2] = [{
  title: '日期',
  dataIndex: 'date',
  width:130,
}, {
  title: '高铁车站',
  dataIndex: 'station',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'lounge',
  width:130,
}, {
  title: '刷卡人次',
  dataIndex: 'name1',
  width:110,
}, {
  title: '刷卡金额',
  dataIndex: 'degree1',
  width:110,
}, {
  title: '现金人次',
  dataIndex: 'name2',
  width:110,
}, {
  title: '现金金额',
  dataIndex: 'degree2',
  width:110,
}, {
  title: '网络人次',
  dataIndex: 'name3',
  width:110,
}, {
  title: '网络金额',
  dataIndex: 'degree3',
  width:110,
}, {
  title: '合计人次',
  dataIndex: 'total',
  width:130,
}, {
  title: '合计金额',
  dataIndex: 'count',
  width:130,
}]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  }),
};

class OrderList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data:[],
            column:[],
            scrollX:true,
        }
    }

    componentWillMount () {
        const data = []
        const key = this.props.listKey
        //console.log(columns)
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                name1: `Edrward ${i}`,
                age: 32,
                address: `London Park no. ${i}`,
            });
        }
        this.setState({data:data,column:columns[key*1-1]})
        if(key*1 == 2){
            this.setState({scrollX:"110%"})
        }
    }

    componentDidMount () {
        //TODO AJAX
        console.log(this.props.listKey*1)
        var inp = $('.ant-tabs-tabpane-active').find('.service-form').find('.ant-row.order-search').eq(1).find('.ant-col-6')
        if(this.props.listKey * 1 == 1){
            inp.eq(2).hide()
        }else{
            inp.not(':last-child').hide()
        }
    }
    
    componentWillUpdate () {

    }

    onchange () {

    }

    
    render () {
        return (
            <Table className="order-list" rowSelection={rowSelection} columns={this.state.column} dataSource={this.state.data} scroll={{x:this.state.scrollX,y:0}} />
        )
    }
}

export default OrderList