import './employee.less'

import AddEmployee from './AddEmployee'
import UpdateEmployee from './UpdateEmplayee'

import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,Message,Table,Checkbox,Modal,AutoComplete,Spin } from 'antd';
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
            visibleAdd:false,
            visibleUpdate:false,
            trainStationResult:[],
            trainStation:[],
            returnData:null,
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
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
        
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              
            }
        });
    }
   
    getInitList(page,rows){
        const data = [];
        const _this = this;
        _this.setState({loading:'block'})
        $.ajax({
            type: "GET",
            url: serveUrl + "hsr-role/getEmployeeList?access_token=" + User.appendAccessToken().access_token,
            data:{
                page:page,
                rows:rows,
                },
            success: function(data){
                
                if(data.status == 200 ){
                    if(data.data != null){
                        data.data.rows.map((v,index)=>{
                            v.key = v.employee_id
                        })

                        _this.setState({
                            employeeList: data.data.rows,
                            employeeListLength:data.data.total
                        })
                    }
                }else{
                    Message.error('获取员工列表失败')
                }
                _this.setState({loading:'none'})
            }
        });
    }

    //删除弹框
    showModalDel = (record) => {
        
        this.setState({
            visibleDel: true,
            employeeId:record.employee_id
        });
    }
    //删除确认
    handleOkDel = (record) => {
        const _this = this
        
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "hsr-role/deleteEmployee?access_token=" + User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(record.employee_id)]
            }),
            success: function (data) {
                if(data.status == 200 ){
                    if(data.data != null){
                        Message.error(data.data);
                    }else{
                        Message.success(data.msg);
                        
                    }
                }else{
                    Message.error(data.msg);
                }
                _this.setState({
                    visibleDel: false
                });
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
            }
        });
    }
    //添加员工
    addEmployeeBtn=()=>{
        this.setState({ visibleAdd: true})
    }


    //添加确认/取消
    handleOk(){
        this.setState({ visibleAdd: false})
        this.getInitList(this.state.employeeCurrent,this.state.employeePageSize)
    }

    //修改员工
    updateEmployeeBtn=(record)=>{
        this.setState({ visibleUpdate: true})
        const _this = this
        
        _this.setState({
            returnData:record
        })            
    }


    //修改确认/取消
    handleUpdateOk(){
        this.setState({ visibleUpdate: false, returnData:null})
        this.getInitList(this.state.employeeCurrent,this.state.employeePageSize)
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
                            <span onClick={_this.updateEmployeeBtn.bind(_this,record)} className='listRefresh'>编辑</span>
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
                            <Spin size='large' tip='加载中' style={{display:this.state.loading}} />
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.employeeList}  className="serveTable"/>
                        </div>
                    </Row>
                 </div>
                 <Modal title="添加员工"
                     key={Math.random() * Math.random()}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOk.bind(this)}
                     onCancel={this.handleOk.bind(this)}
                 >
                     <AddEmployee handleOk={_this.handleOk.bind(_this)} />
                 </Modal>
                 <Modal title="编辑员工"
                     key={Math.random() * Math.random()}
                     visible={this.state.visibleUpdate}
                     onOk={this.handleUpdateOk.bind(this)}
                     onCancel={this.handleUpdateOk.bind(this)}
                 >
                     <UpdateEmployee handleData={this.state.returnData} handleOk={_this.handleUpdateOk.bind(_this)}/>
                 </Modal>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;