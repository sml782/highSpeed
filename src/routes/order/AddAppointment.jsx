import './addAppointment.less'

import Passenger from './Passenger'

import React from 'react'
import { hashHistory } from 'react-router'
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, Message, Table, AutoComplete, Modal, DatePicker } from 'antd'
import { Link } from 'react-router'
import $ from 'jquery'
import moment from 'moment'
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该旅客吗?';

class AddAppointment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            addKey:0,
            changeKey:0,
            clientName:[],
            clientList:[],
            train:{},
            placeList:[],
            startPlaceList:[],
            destinationList:[],
            product:[],
            productList:[],
            visibleDel:false,
            visibleAdd:false,
            visibleSelect:false,
            passengerKey:0,
            passengerList:[],
            selectPassenger:{},
            registerName:[],
            registerList:[],
        }
        this.getProduct = this.getProduct.bind(this)
    }

    componentWillMount () {

    }

    componentDidMount () {
        //TODO AJAX
        $('.type').hide()
    }

    componentWillUpdate () {

    }

    onchange () {

    }
    
    //控制收费类型显示与隐藏
    typeShow = (value) => {
        console.log(value)
        if(value * 1){
            $('.type').show()
        }else{
            $('.type').hide()
        }
    }

    //删除旅客Modal
    delPassModal = (record) => {
        console.log(record)
        this.setState({visibleDel:true,selectPassenger:record})
    }
    //删除确认
    delPassOk = () => {
        const selectPassenger = this.state.selectPassenger
        const passengerList = this.state.passengerList
        passengerList.map((v,i)=>{
            if(v.key == selectPassenger.key){
                passengerList.splice(i,1)
            }
        })
        this.setState({visibleDel:false,passengerList:passengerList,selectPassenger:{}})
        console.log(this.state.passengerList)
    }
    //删除取消
    delPassCancle = () => {
        this.setState({visibleDel:false,selectPassenger:{}})
    }

    //增加旅客Modal
    addPassModal = (record) => {
        console.log(record)
        this.setState({addKey:Math.random()*Math.random(),visibleAdd:true,selectPassenger:record})
    }

    //确认增加旅客
    addPassengerOk = (cb) => {
        const values = cb()
        const selectPassenger = this.state.selectPassenger
        const passengerList = this.state.passengerList
        if(selectPassenger.key == undefined){
            this.setState({passengerKey:++this.state.passengerKey})
            values.key = this.state.passengerKey
            passengerList.push(values)
        }else{
            passengerList.map((v,i) => {
                if(v.key == selectPassenger.key){
                    v.phoneNumber = values.phoneNumber
                    v.seatNum = values.seatNum
                    v.thirdPartCode = values.thirdPartCode
                    v.travellerName = values.travellerName
                    console.log(v)
                }
            })
        }
        this.setState({visibleAdd:false, passengerList:passengerList,selectPassenger:{}})
    }
    //取消增加旅客
    addPassengerCancel = (cb) => {
        this.setState({visibleAdd:false,selectPassenger:{}})
    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    //请求客户名称
    clientChange = (value) => {
        const _this = this
        console.log(value)
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-client/getClientDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: {
                name:value
            },
            success: function (data) {
                console.log(data)
                if(data.status == 200 ){
                    if(data.data != null){
                        //Message.success(data.msg);
                        const client = data.data.map((v,i)=>{
                            v.key = v.id
                            const key = v.id+'&'+v.value
                            return (<AutoCompleteOption key={key}>{v.value}</AutoCompleteOption>)
                        })
                        _this.setState({
                            clientName: client,
                            clientList:data.data
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

    //请求高铁车次
    trainChange = () => {
        const _this = this
        this.props.form.validateFields((err,val) => {
            if(!err){
                console.log(val)
                $.ajax({
                    type: "GET",
                    url: serveUrl + 'hsr-order/getTrainInfo?access_token=' + User.appendAccessToken().access_token,
                    data: {
                        trainTime: moment(val.trainTime,'YYYY-MM-DD').format('YYYY-MM-DD'),
                        trainCode: val.trainCode,
                    },
                    success: function (data) {
                        console.log(data)
                        if(data.status == 200 ){
                            if(data.data != null){
                                //Message.success(data.msg);
                                const place = data.data.trainPos.map((v,i) => {
                                    return (<Option key={v.stationName}>{v.stationName}</Option>)
                                })
                                _this.setState({
                                    train:data.data,
                                    placeList:place,
                                    startPlaceList:place.slice(0,-1),
                                    destinationList:place.slice(1),
                                })
                            }else{
                                //Message.error(data.msg);
                            }
                        }else{
                            //Message.error(data.msg);
                        }
                    }
                        
                })
            }

        })
        
    }

    //切换出发地时改变后续值
    startPlaceChange = (value) => {
        const _this = this
        console.log(value)
        const place = this.state.placeList
        this.state.train.trainPos.map((v,i) => {
            if(v.stationName == value){
                console.log(value)
                _this.setState({ 
                    destinationList: place.slice(i+1),
                })
                _this.props.form.setFieldsValue({
                    startTime:moment(_this.state.train.trainPos[i].startTime,"YYYY-MM-DD HH:mm"),
                    checkTime:moment(_this.state.train.trainPos[i].checkTime,"YYYY-MM-DD HH:mm"),
                })
                _this.getProduct(value)
                return
            }
        })
    }

    //请求休息室名称
    getProduct = (value) => {
        const _this = this 
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-product/getProductByHsOrId?access_token=' + User.appendAccessToken().access_token,
            data: {
                data:value
            },
            success: function (data) {
                console.log(data)
                if(data.status == 200 ){
                    if(data.data != null){
                        //Message.success(data.msg);
                        const productList = data.data.rows.map((v,i) => {
                            return (<Option key={v.productId+'&'+v.name}>{v.name}</Option>)
                        })
                        console.log(productList)
                        _this.setState({
                            product:productList,
                            productList:data.data.rows
                        })
                    }else{
                        //Message.error(data.msg);
                        
                    }
                }else{
                    Message.error(data.msg);
                }
            }
                
        })
    }
    //请求登记人---员工
    registerChange = (value) => {
        const _this = this
        console.log(value)
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-role/getEmployeeDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: {
                name:value
            },
            success: function (data) {
                console.log(data)
                if(data.status == 200 ){
                    if(data.data != null){
                        //Message.success(data.msg);
                        const register = data.data.map((v,i)=>{
                            return <AutoCompleteOption key={v.id}>{v.value}</AutoCompleteOption>;
                        })
                        _this.setState({
                            registerName: register,
                            registerList:data.data
                        })
                    }else{
                        //Message.error(data.msg);
                        
                    }
                }else{
                    Message.error(data.msg);
                }
                
            }
        });
    }

    handleOk = () => {
        const _this = this
        console.log(this.state.passengerList)
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log(values)
                 //高铁日期
                values.trainTime = moment(values.trainTime).format('YYYY-MM-DD')
                //开车时间
                values.startTime = moment(values.startTime).format("YYYY-MM-DD HH:mm:ss")
                //检票时间
                values.checkTime = moment(values.checkTime).format("YYYY-MM-DD HH:mm:ss")
                //客户到达时间
                values.travellerComeTime = moment(values.travellerComeTime).format("YYYY-MM-DD HH:mm:ss")
                //客户离开时间
                values.travellerLeaveTime = moment(values.travellerLeaveTime).format("YYYY-MM-DD HH:mm:ss")
                //休息室
                const product = values.productName.split('&')
                values.productId = product[0]
                values.productName = product[1]  
                //是否收费
                values.isCharge =  values.isCharge == '是' ? 1 : 0                    
                //是否删除
                values.isDeleted = 0
                //状态
                values.status = 1
                //添加旅客
                values.travellerData = _this.state.passengerList
                //客户名
                const clientName = values.clientName.split('&')
                values.clientId = clientName[0]
                values.clientName = clientName[1]
                //登记人
                const register = values.register.split('&')
                values.register = register[0]
                values.registerName = clientName[1]
                console.log(values)
                $.ajax({
                    type: "POST",
                    contentType:'application/x-www-form-urlencoded',
                    url: serveUrl + "hsr-order/updateOrder?access_token=" + User.appendAccessToken().access_token,
                    data: JSON.stringify({data:values}),      
                    success: function (data) {
                        console.log(data)
                        if(data.status == 200 ){
                            if(data.data != null){
                                Message.error(data.msg);
                            }else{
                                Message.success(data.msg);
                                hashHistory.push('/order')
                            }
                        }else{
                            Message.error(data.msg);
                        }
                    }
                })
            }
        })
    }

    handleCancle = () => {
        const _this = this
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log(values)
                 //高铁日期
                values.trainTime = moment(values.trainTime).format('YYYY-MM-DD')
                //开车时间
                values.startTime = moment(values.startTime).format("YYYY-MM-DD HH:mm:ss")
                //检票时间
                values.checkTime = moment(values.checkTime).format("YYYY-MM-DD HH:mm:ss")
                //客户到达时间
                values.travellerComeTime = moment(values.travellerComeTime).format("YYYY-MM-DD HH:mm:ss")
                //客户离开时间
                values.travellerLeaveTime = moment(values.travellerLeaveTime).format("YYYY-MM-DD HH:mm:ss")
                //休息室
                const product = values.productName.split('&')
                values.productId = product[0]
                values.productName = product[1]   
                //是否收费
                values.isCharge =  values.isCharge == '是' ? 1 : 0                   
                //是否删除
                values.isDeleted = 0
                //状态
                values.status = 0
                //添加旅客
                values.travellerData = this.state.passengerList
                //客户名
                const clientName = values.clientName.split('&')
                values.clientId = clientName[0]
                values.clientName = clientName[1]
                //登记人
                const register = values.register.split('&')
                values.register = register[0]
                values.registerName = clientName[1]
                console.log(values)

                $.ajax({
                    type: "POST",
                    contentType:'application/x-www-form-urlencoded',
                    url: serveUrl + "hsr-order/updateOrder?access_token=" + User.appendAccessToken().access_token,
                    data: JSON.stringify({data:values}),      
                    success: function (data) {
                        console.log(data)
                        if(data.status == 200 ){
                            if(data.data != null){
                                Message.error(data.msg);
                                
                            }else{
                                Message.success(data.msg);
                                hashHistory.go('/order')
                            }
                        }else{
                            Message.error(data.msg);
                        }
                    }
                })
            }
        })
    }

    

    handleReset = () => {
        
    }
    
    render () {
        const _this = this

        const columns = [
            {
                title: '旅客姓名',
                dataIndex: 'travellerName',
                width:'20%',
            }, {
                title: '手机号',
                dataIndex: 'phoneNumber',
                width:'20%',
            }, {
                title: '座位号',
                dataIndex: 'seatNum',
                width:'20%',
            }, {
                title: '第三方卡号',
                dataIndex: 'thirdPartCode',
                width:'20%',
            },{
                title: '操作',
                width: '20%',
                dataIndex: 'handle',
                render(text,record) {
                    return (
                            <div className="order">
                                <a onClick={_this.delPassModal.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>&nbsp;&nbsp;
                                <a onClick={_this.addPassModal.bind(_this,record)} style={{marginRight:10,color:'#4778c7'}}>编辑</a>
                            </div>
                            )
                }
            }
        ]

        const { getFieldDecorator } = this.props.form;
    
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
                <Form layout={'inline'} className="order-add-g" onSubmit={_this.handleSubmit.bind(_this)}>
                    <div className="order-client">
                        <div className="title">
                            <span>客户信息</span>
                        </div>
                        <Row style={{padding:'20px'}}>
                            <Col span={12}>
                                <FormItem
                                    label="客户名称" 
                                >
                                    {getFieldDecorator('clientName', {
                                        rules: [{
                                            required: true,message: '请输入客户名称!',
                                        }],
                                    })(
                                        <AutoComplete
                                            dataSource={_this.state.clientName}
                                            onSearch={_this.clientChange.bind(_this)}
                                            placeholder="请输入客户名称"
                                        >
                                        </AutoComplete>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>

                    <div className="order-passenger">
                        <div className="title">
                            <span>旅客信息</span>
                            <div className='passengerButton' >
                                <Button type="primary" onClick={ _this.addPassModal.bind(_this) } className="addPassenger">增加旅客</Button>
                            </div>
                        </div>
                        <Table style={{marginTop:20}} className="passenger-list" columns={columns} dataSource={_this.state.passengerList} />
                    </div>

                    <div className="order-train">
                        <div className="title">
                            <span>高铁信息</span>
                        </div>
                        <Row style={{padding:'10px 20px',marginTop:10}}>
                            <Col span={12}>
                                <FormItem
                                    label="高铁日期"
                                >
                                    {getFieldDecorator('trainTime', {
                                       rules: [{
                                            required: true,message: '请输入高铁日期!',
                                        }],
                                    })(
                                        <DatePicker placeholder="请选择高铁日期" format="YYYY-MM-DD" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="开车时间"
                                >
                                    {getFieldDecorator('startTime', {
                                        
                                    })(
                                        <DatePicker placeholder="请选择开车时间" showTime format="HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={12}>
                                <FormItem
                                    label="高铁车次"
                                >
                                    {getFieldDecorator('trainCode', {
                                        rules: [{
                                            required: true,message: '请输入高铁车次!',
                                        }],
                                    })(
                                        <Input onBlur={_this.trainChange.bind(_this)} placeholder='请输入高铁车次' />
                                    )}
                                </FormItem>
                            </Col>
                        <Col span={12}>
                                <FormItem
                                    label="检票时间"
                                >
                                    {getFieldDecorator('checkTime', {
                                        
                                    })(
                                        <DatePicker placeholder="请选择检票时间" showTime format="HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={12}>
                                <FormItem
                                    label="出发地"
                                >
                                    {getFieldDecorator('startPlace', {
                                        
                                    })(
                                        <Select onChange={_this.startPlaceChange.bind(_this)} placeholder="请选择出发地">
                                            {_this.state.startPlaceList}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="检票口"
                                >
                                    {getFieldDecorator('ticketBarrier', {
                                        
                                    })(
                                        <Input placeholder='请输入检票口' />
                                    )}
                                    </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px 20px'}}>
                            <Col span={12}>
                                <FormItem
                                    label="目的地"
                                >
                                    {getFieldDecorator('destinationPlace', {
                                        
                                    })(
                                        <Select placeholder="请选择目的地">
                                            {_this.state.destinationList}
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
                        <Row style={{padding:'10px 20px',marginTop:10}}>
                            <Col span={12}>
                                <FormItem
                                    label="休息室名称"
                                >
                                    {getFieldDecorator('productName', {
                                        
                                    })(
                                        <Select placeholder="请选择休息室名称">
                                            {_this.state.product}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                        label="客户到达时间"
                                    >
                                    {getFieldDecorator('travellerComeTime', {
                                        
                                    })(
                                        <DatePicker placeholder="请选择客户到达时间" showTime format="HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={12}>
                                <FormItem
                                        label="客户离开时间"
                                    >
                                    {getFieldDecorator('travellerLeaveTime', {
                                        
                                    })(
                                        <DatePicker placeholder="请选择客户离开时间" showTime format="HH:mm" style={{width:'300px'}} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="服务人次" 
                                >
                                     {getFieldDecorator('travellerNum', {
                                         
                                     })(
                                        <Input placeholder="请填写服务人次" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px'}}>
                            <Col span={12}>
                                <FormItem
                                    label="是否收费"
                                >
                                    {getFieldDecorator('isCharge', {
                                        
                                    })(
                                        <Select placeholder="请选择" onSelect={_this.typeShow.bind(_this)}>
                                            <Option value="1">是</Option>
                                            <Option value="0">否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} className="type">
                                <FormItem
                                    label="收费类型"
                                >
                                    {getFieldDecorator('type', {
                                       
                                    })(
                                        <Select placeholder="请选择">
                                            <Option value="刷卡">刷卡</Option>
                                            <Option value="现金">现金</Option>
                                            <Option value="网络">网络</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 20px 20px'}} className="type">
                            <Col span={12}>
                                <FormItem
                                    label="服务价格" 
                                >
                                    {getFieldDecorator('price', {
                                        
                                    })(
                                        <Input placeholder="请填写服务价格" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="order-service">
                        <div className="title">
                            <span>登记信息</span>
                        </div>
                        <Row style={{padding:'10px 20px 20px',marginTop:10}}>
                            <Col span={12}>
                                <FormItem
                                    label="登记人" 
                                >
                                    {getFieldDecorator('register', {
                                        
                                    })(
                                         <AutoComplete
                                            dataSource={_this.state.registerName}
                                            onSearch={_this.registerChange.bind(_this)}
                                            placeholder="请输入登记人"
                                        >
                                        </AutoComplete>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                        <Row style={{padding:'20px',textAlign:'center'}}>
                             <Col span={24}>
                            <span style={{display:'inline-block'}} className='btn-search' onClick={_this.handleOk.bind(_this)}>提交</span>
                            <span className='btn-cancel' style={{display:'inline-block',marginLeft:10}} onClick={_this.handleCancle.bind(_this)}>取消</span>
                             </Col>
                        </Row>
                </Form>

                <Modal title="警告"
                     key={Math.random()*Math.random()}
                     visible={_this.state.visibleDel}
                     onOk={_this.delPassOk.bind(_this)}
                     onCancel={_this.delPassCancle.bind(_this)}
                 >
                     <DeleteDialog msg={msg} />
                 </Modal>

                <Modal title={'添加旅客'}
                     key={_this.state.addKey}
                     visible={_this.state.visibleAdd}
                     onOk={_this.addPassengerOk.bind(_this)}
                     onCancel={_this.addPassengerCancel.bind(_this)}
                     className="traveller-change"
                 >
                     <Passenger hide={_this.addPassengerCancel.bind(_this)} add={_this.addPassengerOk.bind(_this)} values={_this.state.selectPassenger} />
                 </Modal>
            </div>
        )
    }
}

AddAppointment = Form.create()(AddAppointment)

export default AddAppointment