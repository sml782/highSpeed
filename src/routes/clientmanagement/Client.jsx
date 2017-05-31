import './client.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import AddClient from './AddClient';
import UpdateClient from './UpdateClient';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';
const url = 'http://192.168.0.147:8888/';

class Client extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientListDate: [],
            clientListDateLength:0,
            clientListDateCurrent:1,
            clientListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            visibleAdd:false,
            employeeId:null,
            clientTypeResult:[],
            clientId:null,//删除客户的id 
            visibleEdit:false
        }
    }


    getInitList(page,rows){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    url: url+"hsr-client/getClientList?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        page:page,
                        rows:rows,
                    },
                    success: function(data){
                        if(data.status == 200){
                            data.data.rows.map(v=>{
                                v.key = v.clientId;
                            });
                            _this.setState({
                                clientListDate: data.data.rows,
                                clientListDateLength:data.data.total
                            })
                        }
                    }
                });
            }
        });
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        this.getInitList(this.state.clientListDateCurrent,this.state.clientListDatePageSize); 
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $(".ant-modal-footer").css({display:'none'});
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    //增加客户
    handleAddSubmit =(e)=>{
       const _this=this;
    }
   
     getInitList(page,rows){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    //url: serveUrl+"/hsr-client/getClientList?access_token="+ User.appendAccessToken().access_token,
                    url: 'http://192.168.0.147:8888'+"/hsr-client/getClientList?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        page:page,
                        rows:rows,
                        },
                    success: function(data){
                        console
                        // data.data.rows.map((v,index)=>{
                        //     v.key = v.employee_id
                        // })
                        _this.setState({
                            clientListDate: data.data.rows,
                            clientListDateLength:data.data.total
                        })
                    }
                });
            }
        });
    }

    //删除弹框
    showModalDel = (record) => {
        this.setState({
            visibleDel: true,
            clientId:record.clientId
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false
        });
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: url + "hsr-client/deleteClient?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.clientId)]
            }),
            success: function (data) {
                if(data.status == 200 ){
                    message.success(data.msg);
                    _this.getInitList(_this.state.clientListDateCurrent,_this.state.clientListDatePageSize);
                }
                else{
                    message.error(data.msg);
                }
            }
        });
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    //编辑客户弹窗
    showEdit = (record) => {
        this.setState({
            visibleEdit: true,
            clientId:record.clientId
        });
        const _this = this;
        $.ajax({
            type: "GET",
            url: url + "hsr-client/clientView?access_token=" + User.appendAccessToken().access_token,
            data: {
                clientId:record.clientId
            },
            success: function (data) {
                if (data.status == 200) {
                    _this.props.form.setFieldsValue({
                        name:data.data.name,
                        type:data.data.type,
                        ifCheckStr:data.data.ifCheckStr,
                        ifChargeStr:data.data.ifChargeStr
                    })
                }
            }
        });
        
    }
    //增加客户
    addClientBtn = (record) => {
        this.setState({visibleAdd:true})
    }

    //添加
    handleOk(){
        this.setState({visibleAdd:false});
        const _this = this;
        const formatData = {
            data: [
                {
                    name: _this.props.form.getFieldValue('name1'),
                    type: _this.props.form.getFieldValue('type1'),
                    ifCheckStr:_this.props.form.getFieldValue('ifCheckStr1'),
                    ifChargeStr:_this.props.form.getFieldValue('ifChargeStr1')
                }
            ]
        }
        $.ajax({
            type: "POST",
            url: url + "hsr-client/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(formatData),
            success: function (data) {
                if (data.status == 200) {
                    _this.setState({
                        visibleEdit: false
                    });
                    _this.getInitList(_this.state.clientListDateCurrent,_this.state.clientListDatePageSize);
                }
            }
        });
    }

    //取消添加
    handleCancel(){
        this.setState({visibleAdd:false})
    }

    //修改
    handleEditOk(){  
        console.log(this.props.form.getFieldValue('name'))   
    }

    //修改
    handleEditCancel(){
        this.setState({visibleEdit:false});
    }
    

    //保存编辑客户
     handleEditClick =()=>{
        this.setState({
            visibleEdit:false
        });
        this.getInitList(this.state.clientListDateCurrent,this.state.clientListDatePageSize); 
    }

    //保存新增客户
     handleAddClick =()=>{
        this.setState({
            visibleAdd:false
        });
        this.getInitList(this.state.clientListDateCurrent,this.state.clientListDatePageSize); 
    }

    showTotal(total) {
      return `共 ${total} 条`;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const _this = this;
        const columns = [ {
            title: '客户名称',
            width: '15%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '客户类型',
            width: '15%',
            dataIndex: 'type',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '是否需要验证卡号',
            width: '30%',
            dataIndex: 'ifCheckStr',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '是否收费',
            width: '15%',
            dataIndex: 'ifChargeStr',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '25%',
            dataIndex: 'handle',
            render(text,record) {
                return (
                        <div className="order">
                            <span onClick={_this.showEdit.bind(_this,record)}  className='listRefresh'>编辑</span>
                           <Popconfirm title="确认删除?" onConfirm={() => _this.showModalDel.bind(_this,record)}>
                            <span onClick={_this.showModalDel.bind(_this,record)} style={{marginLeft:4}} className='listCancel'>取消</span>
                            </Popconfirm>
                        </div>
                        )
            }
        }];

       const pagination = {
            size:'small',
            showTotal:this.showTotal ,
            total: this.state.clientListDateLength,
            onShowSizeChange(current, pageSize) {
                _this.state.clientListDateCurrent = current;
                _this.state.clientListDatePageSize = pageSize;
                _this.getInitList(_this.state.clientListDateCurrent,_this.state.clientListDatePageSize);
            },
            onChange(current) {
                _this.state.clientListDateCurrent = current;
                _this.getInitList(_this.state.clientListDateCurrent,_this.state.clientListDatePageSize);
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

       //客户类型
       const { clientTypeResult } = this.state;
        const clientType = clientTypeResult.map((type) => {
            return <AutoCompleteOption key={type}>{type}</AutoCompleteOption>;
        });

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <Row>
                        <div className='btn-add' style={{marginLeft:'87%'}} onClick={this.addClientBtn.bind(this)}><span>新增客户</span><img src={require('../../assets/images/add.png')} className='addImg'/></div>
                        <div className="search-result-list" >
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.clientListDate}  className="serveTable"/>     
                        </div>
                    </Row>
                </div>
                <Modal title="警告"
                    key={Math.random() * Math.random()}
                    visible={this.state.visibleDel}
                    onOk={this.handleOkDel}
                    onCancel={this.handleCancelDel}
                    >
                    <div>
                        <DeleteDialog msg={msg} />
                    </div>
                </Modal>

                <div>
                    <Modal title="添加"
                        key={Math.random() * Math.random()}
                        visible={this.state.visibleAdd}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                        >
                        <div>
                            <AddClient handleAddClick={this.handleAddClick}/>
                        </div>
                    </Modal>
                </div>

                <div>
                    <Modal title="编辑"
                        key={Math.random() * Math.random()}
                        visible={this.state.visibleEdit}
                        onOk={this.handleEditOk.bind(this)}
                        onCancel={this.handleEditCancel.bind(this)}
                        >
                        <div>
                            <UpdateClient clientId={this.state.clientId} handleEditClick={this.handleEditClick}/>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

Client = Form.create()(Client);

export default Client;