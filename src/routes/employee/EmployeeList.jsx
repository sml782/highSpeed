import './employee.less'

import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuListDate:[],
            menuIds:[],
            employeeList:[],
            employeeListLength:0,
            employeeCurrent:1,
            employeePageSize:10,
            employeeId:1,
            selectedEm:{},
            selectedRowKeys: [],
            visibleDel:false,
            addKey:0,
            visibleAdd:false,
            trainStationResult:[],
            trainStation:[],
            returnData:null,
        }
    }

    componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">")
        $(".ant-breadcrumb-separator").css({color:'#333'})
        const _this = this
        this.getInitList(this.state.employeeCurrent,this.state.employeePageSize)
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        
    }
    handleSubmit =(e)=>{
        console.log(e)
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              console.log(values);
            }
        });
    }
   
    getInitList(page,rows){
        const data = [];
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+"/hsr-role/getEmployeeList?access_token="+ User.appendAccessToken().access_token,
            //url:'http://192.168.0.147:8888/hsr-role/getEmployeeList?access_token=Y7NeYTS9nqcZuAe654lt1WDKhj4V56xUEMrPqWF0',
            data:{
                page:page,
                rows:rows,
                },
            success: function(data){
                console.log(data)
                //this.setState({employeeList:data,employeeListLength:data.length})
                data.data.rows.map((v,index)=>{
                    v.key = v.employee_id
                })

                _this.setState({
                    employeeList: data.data.rows,
                    employeeListLength:data.data.total
                })
            }
        });
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

    //删除弹框
    showModalDel = (record) => {
        console.log(record.employeeId)
        this.setState({
            visibleDel: true,
            employeeId:record.employee_id
        });
    }
    //删除确认
    handleOkDel = (value) => {
        const _this = this
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "/hsr-role/deleteEmployee?access_token="+User.appendAccessToken().access_token,
            //url:'http://192.168.0.147:8888/hsr-role/deleteEmployee?access_token=Y7NeYTS9nqcZuAe654lt1WDKhj4V56xUEMrPqWF0',
            data: JSON.stringify({
                data: [parseInt(value.employee_id)]
            }),
            success: function (data) {
                if(data.status == 200 ){
                    if(data.data != null){
                        message.error(data.data);
                    }else{
                        message.success(data.msg);
                        _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
                    }
                }else{
                    message.error(data.msg);
                }
                _this.setState({
                    visibleDel: false
                });
            }
        });
    }
    //添加/修改员工
    addEmployeeBtn=(record)=>{
        this.setState({ visibleAdd: true,addKey:Math.random() * Math.random() })
        const _this = this
        console.log(record)
        if(!record.dispatchConfig){
        _this.props.form.setFieldsValue({
            name:record.name,
            phone:record.phone,
            sex:record.sex.toString(),
            trainStationName:record.trainStationName,
        })
        _this.setState({
            returnData:record
        })            
        }else{
            this.setState({ selectedEm: {} })
        }
        
    }


    //添加/修改确认
    handleOk(){
        const dtd = $.Deferred()
        const _this = this;
        var employeeList, arr = [], selectedEm
        this.props.form.validateFields((err, values) => {
            if(!err){
                let arr = values.trainStationName.split('&')
                if(arr.length == 1){
                    values.trainStationName = _this.state.returnData.trainStationName
                    values.trainStationId = _this.state.returnData.trainStationId
                }else{
                    values.trainStationName = arr[1]
                    values.trainStationId = arr[0]
                }
                if(_this.state.returnData != null){
                    values.employeeId = _this.state.returnData.employee_id
                }
                values.sex = parseInt(values.sex)
                $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "/hsr-role/saveOrUpdateEmployee?access_token="+ User.appendAccessToken().access_token,
                data: JSON.stringify({
                        data:values
                    }),      
                success: function (data) {
                    if(data.status == 200 ){
                        if(data.data != null){
                            message.error(data.data);
                        }else{
                            message.success(data.msg);
                        }
                    }else{
                        message.error(data.msg);
                    }
                    _this.setState({ visibleAdd: false, returnData:null})
                    _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
                    }
                })
            }
    })

    }

    //取消添加/修改
    handleCancel(){
        this.setState({visibleAdd:false,returnData:null })
    }

    showTotal(total) {
      return `共 ${total} 条`;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const _this = this;
        const columns = [ {
            title: '员工姓名',
            width: '20%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '手机号',
            width: '20%',
            dataIndex: 'phone',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '所属高铁站',
            width: '20%',
            dataIndex: 'trainStationName',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '40%',
            render(text,record) {
                return (
                        <div className="order">
                            <span onClick={_this.addEmployeeBtn.bind(_this,record)} className='listRefresh'>编辑</span>
                            <Popconfirm title="确认删除?" onConfirm={_this.handleOkDel.bind(_this,record)}>
                                <span  style={{marginLeft:4}} className='listCancel'>删除</span>
                            </Popconfirm>
                        </div>
                        )
            }
        }];

       const pagination = {
            total: this.state.employeeListLength,
            size:'small',
            showTotal:this.showTotal ,
            onShowSizeChange(current, pageSize) {
                _this.state.employeeCurrent = current;
                _this.state.employeePageSize = pageSize;
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize);
            },
            onChange(current) {
                _this.state.employeeCurrent = current;
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize);
            },

      };

      const formI = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 14,
                offset: 6,
            },
        },
      };
       
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>员工管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Row>
                        <div className='btn-add' style={{marginLeft:'87%'}} onClick={this.addEmployeeBtn}><span>添加员工</span><img src={require('../../assets/images/add.png')} className='addImg'/></div>
                        <div className="search-result-list" >
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.employeeList}  className="serveTable"/>
                        </div>
                    </Row>
                 </div>
                 <Modal title="添加/编辑"
                     key={this.state.addKey}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOk.bind(this)}
                     onCancel={this.handleCancel.bind(this)}
                 >
                     <div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                label='员工姓名'
                                {...formI}
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入员工姓名!', whitespace: true }],
                                    
                                })(
                                    <Input placeholder="请输入员工姓名" />
                                )}
                           </FormItem>
                           <FormItem
                                label="性别" 
                                {...formI}
                            >
                                {getFieldDecorator('sex', {
                                    rules: [{ required: true, message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="1">男</Option>
                                        <Option value="0">女</Option>
                                    </Select>
                                )}
                           </FormItem>
                           <FormItem
                                {...formI}
                                label="手机号码"
                            >
                                {getFieldDecorator('phone', {

                                    rules: [{ required: true, message: '请输入手机号!', pattern:/^1[3|4|5|7|8][0-9]\d{4,8}$/ }],
                                })(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="所属高铁站"
                            >
                                {getFieldDecorator('trainStationName', {
                                    rules: [{ required: true, message: '请输入高铁站!' }],
                                })(
                                    <AutoComplete
                                        dataSource={this.state.trainStation}
                                        onChange={this.handleStationChange}
                                        placeholder="请输入高铁站"
                                    >
                                    </AutoComplete>
                                )}
                            </FormItem>
                        </Form>
                       
                     </div>
                 </Modal>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;