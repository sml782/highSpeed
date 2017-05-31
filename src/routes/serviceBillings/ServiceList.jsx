

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';


const columns = []
columns[0] = [{
  title: '高铁日期',
  dataIndex: 'trainTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.trainTime).format('YYYY-MM-DD HH:MM')}</span>
  }
}, {
  title: '高铁车站',
  dataIndex: 'trainStation',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  width:130,
}, {
  title: '客户名称1',
  dataIndex: 'name1',
  width:110,
}, {
  title: '服务人次',
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
  dataIndex: 'serverCount',
  width:130,
}]

columns[1] = [{
  title: '订单编号',
  dataIndex: 'orderId',
  width:150,
  fixed:'left',
}, {
  title: '高铁车站',
  dataIndex: 'station',
  width:110,
  render(text,record) {
      return <span>{record.train.startPlace}</span>
  }
}, {
  title: '高铁日期',
  dataIndex: 'date',
  width:130,
  render(text,record) {
      return <span>{record.train.trainTime}</span>
  }
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  width:130,
}, {
  title: '客户名称',
  dataIndex: 'clientName',
  width:110,
}, {
  title: '旅客姓名',
  dataIndex: 'passengerName',
  width:110,
  render(text,record) {
      let text1 = ''
      record.travellerList.map((v,index)=>{
        if(index == 0){
          text1 = v.travellerName
        }else{
          text1 = text1 + ',' +v.travellerName
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '车次',
  dataIndex: 'trainNo',
  width:110,
    render(text,record) {
      return <span>{record.train.trainCode}</span>
  }
}, {
  title: '出发地',
  dataIndex: 'departure',
  width:110,
  render(text,record) {
      return <span>{record.train.startPlace}</span>
  }
}, {
  title: '目的地',
  dataIndex: 'destination',
  width:110,
    render(text,record) {
      return <span>{record.train.destinationPlace}</span>
  }
}, {
  title: '开车时间',
  dataIndex: 'drivingTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.train.startTime).format('MM-DD HH:mm')}</span>
  }
}, {
  title: '检票时间',
  dataIndex: 'checkinTime',
  width:100,
     render(text,record) {
      return <span>{moment(record.train.checkTime).format('MM-DD HH:mm')}</span>
  }
}, {
  title: '旅客进入时间',
  dataIndex: 'travellerComeTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.travellerComeTime).format('MM-DD HH:mm')}</span>
  }
}, {
  title: '旅客离开时间',
  dataIndex: 'travellerLeaveTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.travellerLeaveTime).format('MM-DD HH:mm')}</span>
  }
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
  dataIndex: 'trainTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.trainTime).format('YYYY-MM-DD HH:mm')}</span>
  }
}, {
  title: '高铁车站',
  dataIndex: 'trainName',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  width:130,
}, {
  title: '刷卡人次',
  dataIndex: 'name1',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='2'){
          text1=v.num
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '刷卡金额',
  dataIndex: 'degree1',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='2'){
          text1=v.acount
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '现金人次',
  dataIndex: 'name2',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='3'){
          text1=v.num
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '现金金额',
  dataIndex: 'degree2',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='3'){
          text1=v.acount
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '网络人次',
  dataIndex: 'name3',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='4'){
          text1=v.num
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '网络金额',
  dataIndex: 'degree3',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='4'){
          text1=v.acount
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '合计人次',
  dataIndex: 'numAll',
  width:130,
}, {
  title: '合计金额',
  dataIndex: 'acountAll',
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
            url:'',
            page:1,
            rows:10,
            billList:[],
            flag:1,
        }
    }

    componentWillMount () {
        const data = []
        const key = this.props.listKey
        //console.log(columns)
        this.setState({data:data,column:columns[key*1-1]})
        if(key*1 == 2){
            this.setState({
              scrollX:"150%",
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
        console.log(this.props.listKey*1)
        //console.log($('.ant-tabs-content').find('.ant-tabs-tabpane').not(':first-child').find('.server-search').find('.server-detail'))
        $('.ant-tabs-content').find('.ant-tabs-tabpane').not(':first-child').find('.server-search').find('.server-detail').hide()
        var inp = $('.ant-tabs-tabpane-active').find('.service-form').find('.ant-row.order-search').eq(1).find('.ant-col-8')
        if(this.props.listKey * 1 == 1){
            inp.eq(2).hide()
        }else{
            inp.not(':last-child').hide()
        }
        this.getInitList(this.state.page,this.state.rows)
    }

    getInitList (page,rows){
        const _this = this;
          $.ajax({
              type: "GET",
              //url: serveUrl+"/hsr-role/getEmployeeById?access_token="+ User.appendAccessToken().access_token,
              url:'http://192.168.0.135:8888'+_this.state.url+'?access_token='+ User.appendAccessToken().access_token,
              data:{
                  page:page,
                  rows:rows,
                  },
              success: function(data){
                  console.log(data)
                  data.data.rows.map((v,index)=>{
                      v.key = index
                  })
                  _this.setState({
                      billList: data.data.rows
                  })
              }
          });
      }
    showTotal(total) {
      return `共 ${total} 条`;
    }
    

    
    render () {
      const pagination = {
        size:'small',
        showTotal:this.showTotal 
      }
        return (
            <Table className="order-list" pagination={pagination} columns={this.state.column} dataSource={this.props.listData==null?this.state.billList:this.props.listData} scroll={{x:this.state.scrollX,y:0}} />
        )
    }
}

export default OrderList