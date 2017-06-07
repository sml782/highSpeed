import './service.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker, Tabs, Spin } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import getTrainStation from '../../utils/station';//引入所属高铁站
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;
const AutoCompleteOption = AutoComplete.Option;


const columns = []
columns[0] = [{
  title: '高铁日期',
  dataIndex: 'trainTime',
  width:130,
  render(text,record) {
      return <span>{text == '' ? '--':moment(text).format('YYYY-MM-DD')}</span>
  }
}, {
  title: '高铁车站',
  dataIndex: 'trainStation',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  key:0,
  width:130,
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
      return <span>{moment(record.train.trainTime).format('YYYY-MM-DD')}</span>
  }
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  key:1,
  width:130,
}, {
  title: '客户名称',
  dataIndex: 'clientName',
  width:110,
}, {
  title: '卡号',
  dataIndex: 'thirdPartCode',
  width:130,
  render(text,record) {
      let thirdPartCode = ''
      record.travellerList.map((v,i)=>{
        if(v.thirdPartCode){
          thirdPartCode = v.thirdPartCode
        }
      })
      return thirdPartCode
  }
}, {
  title: '旅客姓名',
  dataIndex: 'travellerName',
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
  dataIndex: 'trainCode',
  width:110,
    render(text,record) {
      return <span>{record.train.trainCode}</span>
  }
}, {
  title: '出发地',
  dataIndex: 'startPlace',
  width:110,
  render(text,record) {
      return <span>{record.train.startPlace}</span>
  }
}, {
  title: '目的地',
  dataIndex: 'destinationPlace',
  width:110,
    render(text,record) {
      return <span>{record.train.destinationPlace}</span>
  }
}, {
  title: '开车时间',
  dataIndex: 'startTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.train.startTime).format('MM-DD HH:mm')}</span>
  }
}, {
  title: '检票时间',
  dataIndex: 'checkTime',
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
}]

columns[2] = [{
  title: '日期',
  dataIndex: 'trainTime',
  width:130,
  render(text,record) {
      return <span>{moment(record.trainTime).format('YYYY-MM-DD')}</span>
  }
}, {
  title: '高铁车站',
  dataIndex: 'trainName',
  width:110,
}, {
  title: '休息室名称',
  dataIndex: 'productName',
  key:2,
  width:130,
},{
  title: '现金人次',
  dataIndex: 'cashNum',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='2'){
          text1 = v.num
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '现金金额',
  dataIndex: 'cashPrice',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='2'){
          text1 = v.acount
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '刷卡人次',
  dataIndex: 'slotNum',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='3'){
          text1 = v.num
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '刷卡金额',
  dataIndex: 'slotPrice',
  width:110,
  render(text,record) {
      let text1=''
      record.consumeList.map((v,index)=>{
        if(v.type=='3'){
          text1 = v.acount
        }
      })
      return <span>{text1}</span>
  }
}, {
  title: '网络人次',
  dataIndex: 'netNum',
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
  dataIndex: 'netPrice',
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
    
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  }),
};

class Static extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            listKey:1,
            trainStation:[],
            data:[],
            column:[],
            scrollX:true,
            url:'',
            page:1,
            rows:10,
            billList:[],
            billTotal:0,
            flag:1,
            columnsStart:[],
            columnsEnd:[],
            searchData:{},
            loading:'block',
            clientName:[],
        }
    }

    componentWillMount () {
         if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
        let key = this.props.listChange
        this.setState({listKey:key,column:columns[key*1-1]})
        if(key*1 == 2){
            this.setState({
              url:'hsr-order/getDetailBill',
              scrollX:'130%',
          })
        }else if(key*1 == 1){
            this.setState({
              url:'hsr-order/getCountBill',
              columnsStart:columns[0].slice(0,3),
              columnsEnd:columns[0].slice(-1),
            })
        }else if(key*1 == 3){
            this.setState({
              url:'hsr-order/getRetailBill'
            })
        }
    }

    componentDidMount () {
        //TODO AJAX
        this.handleStationChange();
        this.clientChange();
        $('.ant-tabs-content').find('.ant-tabs-tabpane').not(':first-child').find('.server-search').find('.server-detail').hide()
        var inp = $('.ant-tabs-tabpane-active').find('.service-form').find('.ant-row.order-search').eq(1).find('.ant-col-8')
        if(this.props.listChange * 1 == 3 || this.props.listChange * 1 == 2){
            $('.order-client').last().remove()
        }
        this.getInitList(this.state.page,this.state.rows)
    }

    getInitList (page,rows,value){
        const _this = this;
        _this.setState({loading:'block'})
        const data = $.extend({page:page,rows:rows},value)
        $.ajax({
            type: "GET",
            url:serveUrl + _this.state.url + '?access_token=' + User.appendAccessToken().access_token,
            data:data,
            success: function(data){
                if(data.status == 200){
                    if(_this.state.url == 'hsr-order/getCountBill'){
                        const columnsStart = columns[0].slice(0,3);
                        const columnsEnd = columns[0].slice(-1);
                        var column = columnsStart.concat()
                        for(var i = 0;i < data.data.columnLength;i++){
                            column.push({
                                title: `客户名称${i+1}`,
                                dataIndex: `client${i+1}`,
                                width:110,
                            })
                            column.push({
                                title: `服务人次${i+1}`,
                                dataIndex: `serverNum${i+1}`,
                                width:110,
                            })
                        }
                        column = column.concat(columnsEnd)
                        _this.setState({
                            scrollX:data.data.columnLength?`${80+data.data.columnLength*10}%`:'100%',
                            column:column
                        })
                    }
                    
                    data.data.rows.map((v,i)=>{
                        v.key = i
                    })
                    _this.setState({
                        billList: data.data.rows,
                        billTotal:data.data.total
                    })
                }
                _this.setState({loading:'none'})
                
            }
        });
      }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            
            const _this = this;
            values.page = _this.state.page
            values.rows = _this.state.rows
            $.ajax({
                type: "GET",
                url:serveUrl + _this.state.url + '?access_token=' + User.appendAccessToken().access_token,
                data:JSON.stringify(values),
                success: function(data){
                    
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

    //控制搜索下拉的宽度
    liWidth = () => {
        $('.w').css({width:180})
    }

     //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            getTrainStation(value,(station) => {
                const trainStation = station.map((s) => {
                    return <AutoCompleteOption className='w' key={s.value}>{s.value}</AutoCompleteOption>;
                })
                _this.setState({ trainStation: trainStation})
            })
        }
    }

    //请求客户名称
    clientChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-client/getClientDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: {
                name:value
            },
            success: function (data) {
                if(data.status == 200 ){
                    if(data.data != null){
                        const client = data.data.map((v,i)=>{
                            v.key = v.id
                            return (<AutoCompleteOption className='w' key={v.value}>{v.value}</AutoCompleteOption>)
                        })
                        _this.setState({
                            clientName: client,
                        })
                    }else{
                        //Message.error(data.msg);
                    }
                }else{
                    //Message.error(data.msg);
                }
                
            }
        });
    }

    //搜索
    searchBill = () => {
        const searchData = this.props.form.getFieldsValue()
        if(searchData.trainDate){
            if(searchData.trainDate.length){
                searchData.startTime = searchData.trainDate[0].format('YYYY-MM-DD');
                searchData.endTime = searchData.trainDate[1].format('YYYY-MM-DD');
                searchData.trainDate = undefined;
            }
        }
        this.setState({searchData:searchData,page:1},() => {this.getInitList(this.state.page,this.state.rows,searchData)})
    }

    //导出账单
    exprotBill = () => {
       this.props.form.validateFields((err, values) => {
           if(values.trainDate){
                values.startTime = values.trainDate[0].format('YYYY-MM-DD');
                values.endTime = values.trainDate[1].format('YYYY-MM-DD');
                values.trainDate = undefined;
            }
            if (!err) {
                    var form = $("<form>"); //定义一个form表单
                    form.attr('style', 'display:none'); //在form表单中添加查询参数
                    form.attr('target', '');
                    form.attr('method', 'GET');
                    form.attr('action', serveUrl+"export-file/exportExcelForTrain");
                    // form.attr('action', "http://192.168.0.124:8988/exportBill");
                    var input1 = $('<input>');
                    input1.attr('type', 'hidden');
                    input1.attr('name', 'trainName');
                    input1.attr('value', values.trainName);
                    var input2 = $('<input>');
                    input2.attr('type', 'hidden');
                    input2.attr('name', 'productName');
                    input2.attr('value', values.productName);
                    var input3 = $('<input>');
                    input3.attr('type', 'hidden');
                    input3.attr('name', 'startTime');
                    input3.attr('value', values.startTime);
                    var input6 = $('<input>');
                    input6.attr('type', 'hidden');
                    input6.attr('name', 'endTime');
                    input6.attr('value', values.endTime);
                    var input4 = $('<input>');
                    input4.attr('type', 'hidden');
                    input4.attr('name', 'type');
                    input4.attr('value', this.state.listKey);
                    var input5 = $('<input>');
                    input5.attr('type', 'hidden');
                    input5.attr('name', 'access_token');
                    input5.attr('value', User.appendAccessToken().access_token);
                    $('body').append(form); //将表单放置在web中
                    form.append(input1); //将查询参数控件提交到表单上
                    form.append(input2);
                    form.append(input3);
                    form.append(input4);
                    form.append(input5);
                    form.append(input6);
                    form.submit();
                    form.remove();//使用完成移除form
            }
        });
    }

    showTotal(total) {
      return `共 ${total} 条`;
    }

    render () {
        const _this = this
        const { getFieldDecorator } = this.props.form;
        const formCol = { span: 8};
        const buttonItemLayout = null;

        const pagination = {
           size:'small',
           showTotal:_this.showTotal,
           total: _this.state.billTotal,
           current:_this.state.page,
            onShowSizeChange(current, pageSize) {
                _this.state.page = current;
                _this.state.rows = pageSize;
                _this.getInitList(_this.state.page,_this.state.rows,_this.state.searchData);
            },
            onChange(current) {
                _this.state.page = current;
                _this.getInitList(_this.state.page,_this.state.rows,_this.state.searchData);
            },

      };

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
                                                dataSource={_this.state.trainStation}
                                                onSearch={_this.handleStationChange.bind(_this)}
                                                onFocus={_this.liWidth.bind(_this)}
                                                placeholder="请输入高铁车站"
                                            >
                                            </AutoComplete>
                                      )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="休息室名称" 
                                >
                                    {getFieldDecorator('productName')(
                                        <Input placeholder="请输入休息室名称" />
                                    )}
                                </FormItem>
                            </Col>
                             <Col  span={7} style={{marginLeft:35}}>
                                    <div className='btn-search' onClick={this.searchBill}><img src={require('../../assets/images/search.png')} className='seacrhImg'/><span>查&nbsp;询</span></div>
                            </Col>  
                        </Row>
                        <Row className="order-search">
                            <Col  {...formCol}>
                                <FormItem
                                    label="客户名称"
                                    className='order-client' 
                                >
                                      {getFieldDecorator('clientName')(
                                            <AutoComplete
                                                dataSource={_this.state.clientName}
                                                onSearch={_this.clientChange.bind(_this)}
                                                onFocus={_this.liWidth.bind(_this)}
                                                placeholder="请输入客户名称"
                                            >
                                            </AutoComplete>
                                      )}
                                </FormItem>
                            </Col>
                            <Col  {...formCol}>
                                <FormItem
                                    label="日期" 
                                >
                                    {getFieldDecorator('trainDate')(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                            <Col  span={7} style={{marginLeft:35}}>
                                <div className='btn-export btn-search' onClick={this.exprotBill}><span>导出账单</span></div>
                            </Col>  
                        </Row>
                    </Form>
                </div>


                <div className="service-list">
                    <Spin size='large' tip='加载中' style={{display:this.state.loading}} />
                    <Table className="order-list" pagination={pagination} columns={this.state.column} dataSource={this.state.billList} scroll={{x:this.state.scrollX,y:0}} />
                </div>
            </div>
        )
    }
}

Static = Form.create()(Static)

export default Static