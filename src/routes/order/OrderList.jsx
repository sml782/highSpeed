import './order.less'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, Message, Table, Modal, DatePicker,Spin, AutoComplete  } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import { serveUrl, User, cacheData, access_token} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站
const msg = '确定删除吗?'

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

class OrderList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            clientName:[],
            queryValues:{},
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
            loading:'block',
        }
        this.getInitList = this.getInitList.bind(this)
    }

    componentWillMount () {
        
        
    }

    componentDidMount () {
         if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
        //TODO AJAX
        this.clientChange()
        this.getInitList(this.state.orderListPage, this.state.orderListRows)
    }

    componentWillUpdate () {

    }

    handleSearch = (e) => {
        e.preventDefault();
        const trainTime =  $('.trainTime').find('.ant-form-item-control-wrapper').find('.ant-calendar-picker-input').val()
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.queryTrainTime = trainTime == '' ? '' : moment(trainTime).format("YYYY-MM-DD");
                this.setState({queryValues:values,orderListPage:1},()=>{this.getInitList(this.state.orderListPage, this.state.orderListRows, values)});
            }
            
        })
    }

    handleReset = () => {
        this.props.form.resetFields();
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

    //客户点击时调节选项宽度
    clientWidth = () => {
        $('.w').css({width:180})
    }

    //获取
    getInitList(page, rows, values) {
        const _this = this;
        _this.setState({loading:'block'})
        const data =  $.extend({
                page: page,
                rows: rows,
            },values)
        
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-order/getOrderByKey?access_token=' + User.appendAccessToken().access_token,
            data: data,
            success: function (data) {
                
                if(data.status == 200 ){
                    if(data.data != null){
                        //Message.success(data.msg);
                        const len = data.data.rows.length
                        const d = data.data.rows
                        for(var i = 0;i < len;i++){
                            d[i].key = i;
                            //高铁
                            d[i].trainCode = d[i].train.trainCode?d[i].train.trainCode:'--'
                            d[i].trainTime = d[i].train.trainTime?d[i].train.trainTime:'--'
                            d[i].startPlace = d[i].train.startPlace?d[i].train.startPlace:'--'
                            d[i].destinationPlace = d[i].train.destinationPlace?d[i].train.destinationPlace:'--'
                            d[i].startTime = d[i].train.startTime?d[i].train.startTime:'--'
                            d[i].checkTime = d[i].train.checkTime?d[i].train.checkTime:'--'
                            d[i].ticketBarrier = d[i].train.ticketBarrier?d[i].train.ticketBarrier:'--'

                            //收费
                            // d[i].isCharge = d[i].isCharge?'是':'否'
                            // d[i].type = d[i].type?d[i].type:'--'
                            // d[i].price = d[i].price?d[i].price:'--'
                            //登记人
                            d[i].register = d[i].register?d[i].register:'--'
                            var travellerName = ''
                            for(var k = 0;k < d[i].travellerList.length;k++){
                                d[i].travellerList[k].key = d[i].travellerList[k].travellerId;
                                d[i].travellerList[k].orderId = ''
                                d[i].travellerList[k].trainCode = ''
                                d[i].travellerList[k].startPlace = ''
                                d[i].travellerList[k].destinationPlace = ''
                                d[i].travellerList[k].trainTime = ''
                                d[i].travellerList[k].startTime = '--'
                                d[i].travellerList[k].checkTime = '--'
                                travellerName += d[i].travellerList[k].travellerName ? d[i].travellerList[k].travellerName + '、' : ''
                                var phoneNumber = d[i].travellerList[0].phoneNumber
                                var seatNum = d[i].travellerList[0].seatNum
                                var thirdPartCode = d[i].travellerList[0].thirdPartCode
                            }
                            d[i].travellerName = travellerName.substring(0,travellerName.length-1) == '' ? '--' : travellerName.substring(0,travellerName.length-1)
                            d[i].phoneNumber = phoneNumber
                            d[i].seatNum = seatNum
                            d[i].thirdPartCode = thirdPartCode
                        }
                        _this.setState({
                            orderListDate: d,
                            orderListDateLength: data.data.total,
                        })
                        
                    }else{
                        //Message.error(data.msg);
                        
                    }
                }else{
                    Message.error(data.msg);
                }
                _this.setState({loading:'none'})
            }
        });
    }


    //删除弹窗
    handleOkDel = (record) => {
        const _this = this
        $.ajax({
            type: "POST",
            url: serveUrl + "hsr-order/cancelOrder?access_token=" + User.appendAccessToken().access_token,
            data: {orderId:record.orderId},      
            success: function (data) {
                
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
        
        this.setState({selectedOrder:record})
        hashHistory.push(`/updateAppointment/${record.orderId}`)
    }
    showTotal(total) {
      return `共 ${total} 条`;
    }
    
    render () {
        const _this = this
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = this.state;
        const formCol = { span: 8};
        const buttonItemLayout = null;
        const pagination = {
           size:'small',
           showTotal:_this.showTotal,
           current: _this.state.orderListPage,
            total: _this.state.orderListDateLength,
            onShowSizeChange(current, pageSize) {
                _this.state.orderListPage = current;
                _this.state.orderListRows = pageSize;
                _this.getInitList(_this.state.orderListPage,_this.state.orderListRows,_this.state.queryValues);
            },
            onChange(current) {
                _this.state.orderListPage = current;
                _this.getInitList(_this.state.orderListPage,_this.state.orderListRows,_this.state.queryValues);
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
        width:120,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '高铁日期',
        dataIndex: 'trainTime',
        width:120,
        sorter: (a, b) => a.trainTime - b.trainTime,
        render: (text,record) => (
            <div>
                <span >{text == '--'?'--':moment(text).format('YYYY-MM-DD')}</span>
            </div>),
      }, {
        title: '出发地',
        dataIndex: 'startPlace',
        width:80,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '目的地',
        dataIndex: 'destinationPlace',
        width:80,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '开车时间',
        dataIndex: 'startTime',
        width:120,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{text == '--'?'--':moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '检票时间',
        dataIndex: 'checkTime',
        width:110,
        sorter: (a, b) => a.time - b.time,
        render: (text,record) => (
            <div>
                <span >{text == '--'?'--':moment(text).format('HH:mm')}</span>
            </div>),
      }, {
        title: '检票口',
        dataIndex: 'ticketBarrier',
        width:80,
        render: (text,record) => (
            <div>
                <span >{text}</span>
            </div>),
      }, {
        title: '旅客姓名',
        dataIndex: 'travellerName',
        width:120,
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
        width:80,
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
                <span >{text?moment(text).format('HH:mm'):'--'}</span>
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
        render: (text,record) => {
            var type = '';
            switch (text){
                case 2: type = '现金';
                    break;
                case 3: type = '刷卡';
                    break;
                case 4: type = '网络';
                    break;
                default: type = '无';
            }
            return (
                <div>
                    <span >{type}</span>
                </div>
            )
        },
      }, {
        title: '收费价格',
        dataIndex: 'price',
        width:90,
        render: (text,record) => (
            <div>
                <span >{text?text:0}</span>
            </div>),
      }, {
        title: '登记人',
        dataIndex: 'registerName',
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
        render: (text,record) => {
            if(record.status){
                return (
                    <div>
                        <span className='listRefresh' onClick={_this.changeOrder.bind(_this,record)}>编辑</span>
                        <Popconfirm title="确认取消?" onConfirm={_this.handleOkDel.bind(_this,record)}>
                            <span  style={{marginLeft:4}} className='listCancel'>取消</span>
                        </Popconfirm>
                    </div>
                )
            }
        },
      }];
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User',    // Column configuration not to be checked
        }),
      };
        return (
            <div className="search-result-list" >
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
                                    <AutoComplete
                                        dataSource={_this.state.clientName}
                                        onSearch={_this.clientChange.bind(_this)}
                                        onFocus={_this.clientWidth.bind(_this)}
                                        placeholder="请输入客户名称"
                                    >
                                    </AutoComplete>
                                )}
                            </FormItem>
                        </Col>
                        <Col  {...formCol}>
                            <FormItem
                                label="高铁日期"
                                className='trainTime'
                            >
                                {getFieldDecorator('queryTrainTime', {})(
                                    <DatePicker />
                                )}
                           </FormItem>
                        </Col>                        
                        <Col  span={7} style={{marginLeft:35}}>
                            <div className='btn-search' onClick={_this.handleSearch.bind(_this)}><img src={require('../../assets/images/search.png')} className='seacrhImg'/><span>查&nbsp;询</span></div>
                       </Col>   
                    </Row>
                </Form>
                <Spin size='large' tip='加载中' style={{display:this.state.loading}} />
                <Table className="order-list" columns={columns} pagination={pagination} dataSource={_this.state.orderListDate} scroll={{x: '190%', y: 0}} />
            </div>
        )
    }
}

OrderList = Form.create()(OrderList)

export default OrderList