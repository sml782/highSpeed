import './order.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'

const columns = [{
  title: '订单编号',
  dataIndex: 'no',
  width:150,
  fixed: 'left',
}, {
  title: '高铁车次',
  dataIndex: 'trains',
  width:100,
}, {
  title: '高铁日期',
  dataIndex: 'date',
  width:110,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '出发地',
  dataIndex: 'departure',
  width:70,
}, {
  title: '目的地',
  dataIndex: 'destination',
  width:70,
}, {
  title: '开车时间',
  dataIndex: 'start',
  width:110,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '检票时间',
  dataIndex: 'checked',
  width:110,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '检票口',
  dataIndex: 'entry',
  width:70,
}, {
  title: '旅客姓名',
  dataIndex: 'name',
  width:110,
}, {
  title: '手机号码',
  dataIndex: 'phone',
  width:130,
}, {
  title: '座位号',
  dataIndex: 'seatNo',
  width:70,
}, {
  title: '第三方卡号',
  dataIndex: 'cardNo',
  width:130,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width:90,
}, {
  title: '休息室名称',
  dataIndex: 'waitingRoom',
  width:130,
}, {
  title: '客户到达时间',
  dataIndex: 'arriveTime',
  width:140,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '客户离开时间',
  dataIndex: 'leaveRoom',
  width:140,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '服务人次',
  width:90,
  dataIndex: 'serviceCount',
}, {
  title: '是否收费',
  width:90,
  dataIndex: 'chargeOrNot',
}, {
  title: '收费类型',
  width:90,
  dataIndex: 'chargeType',
}, {
  title: '收费价格',
  dataIndex: 'price',
  width:90,
}, {
  title: '登记人',
  dataIndex: 'registrant',
  width:70,
}, {
  title: '登记时间',
  dataIndex: 'registrantTime',
  width:110,
  sorter: (a, b) => a.time - b.time,
}, {
  title: '订单状态',
  dataIndex: 'orderStatus',
  width:90,
}, {
  title: '操作',
  dataIndex: 'operation',
  fixed: 'right',
  width:120,
  render: () => (<div><a href="#">取消</a><a href="#">编辑</a></div>),
}];
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
            data:[]
        }
    }

    componentWillMount () {
        const data = []
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                name: `Edrward ${i}`,
                age: 32,
                address: `London Park no. ${i}`,
            });
        }
        this.setState({data:data})
    }

    componentDidMount () {
        //TODO AJAX
    }

    componentWillUpdate () {

    }

    onchange () {

    }

    
    render () {
        return (
            <Table className="order-list" rowSelection={rowSelection} columns={columns} dataSource={this.state.data} scroll={{x: '140%', y: 0}} />
        )
    }
}

export default OrderList