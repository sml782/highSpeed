import './addpart.less'

import AddPartLounge from './AddPartLounge'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Cascader,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '是否删除?';

class UpdatePart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key:1,
            stationObj:[<AddPartLounge key={1} />],
            serveTypeData:[],
            serveListDate: [],
            serveListDateLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            totalSiderBar:null,
        }
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        // this.getInit()
        console.log(this.props.params.roleId)
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $('.loungeBtn').find('.ant-btn').eq(1).hide()
    }

    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }

    onChange = (_this,text) => {
        Array.prototype.indexOf = function(val) {              
            for (var i = 0; i < this.length; i++) {  
                if (this[i] == val) return i;  
            }  
            return -1;  
        }; 
        Array.prototype.remove = function(val) {  
            var index = this.indexOf(val);  
            if (index > -1) {  
                this.splice(index, 1);  
            }  
        }; 
        const __this = this;
        _this.status = !_this.status;
        if(text.target.checked){
            __this.state.menuIds.push(_this.roleId)
            
        }else{
            __this.state.menuIds.remove(_this.roleId); 
        }
        this.setState({
            menuListDate: this.state.menuListDate
        })
    }
    
    //添加高铁站
    addStation () {
        var stationObj = this.state.stationObj
        var k = this.state.key
        stationObj.push(<AddPartLounge key={++k} />)
        if(stationObj.length > 1){
            $('.loungeBtn').find('.ant-btn').eq(1).show()
        }
        this.setState({ stationObj: stationObj, key: k })
        
    }

    //删除高铁站
    delStation () {
        var stationObj = this.state.stationObj
        stationObj.pop()
        if(stationObj.length < 2){
            $('.loungeBtn').find('.ant-btn').eq(1).hide()
        }
        this.setState({ stationObj: stationObj })
        
    }

    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = {
                    client_id: "LJG",
                    grant_type: "password",
                    client_secret: "111111",
                    username: values.username,
                    password: values.password,
                    password_confirmation: values.password,
                }
                $.ajax({
                    type: "POST",
                    contentType: 'application/json;charset=utf-8',
                    url: 'http://testapi.iairportcloud.com/oauth/oauth/register',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        if (Object.prototype.toString.call(data) === "[object String]") {
                            message.error(JSON.parse(data).display_message.username[0]);
                        } else {
                            const formData1 = {
                                data: [{
                                    name: values.name,
                                    description: values.name,
                                    account: values.username,
                                    productIds: values.lounge,
                                    menuIdList: _this.state.menuIds.unique()
                                }]
                            }
                            $.ajax({
                                type: "POST",
                                contentType: 'application/json;charset=utf-8',
                                // url: "http://192.168.1.199:8887/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                                url: serveUrl+"/hsr-role/saveOrUpdateRole?access_token="+ User.appendAccessToken().access_token,
                                data: JSON.stringify(formData1),
                                success: function (data) {
                                    if (data.status == 200) {
                                        message.success(data.msg);
                                    }
                                    else if (data.status == 500) {
                                        message.error(data.msg);
                                    }
                                    hashHistory.push('/system');
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    handleReset =()=>{
        hashHistory.push('/addpart');
    }
   

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [{
            title: '角色名称',
            width: '12.5%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '角色描述',
            width: '12.5%',
            dataIndex: 'description',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '12.5%',
            render(text,record) {
                return (
                        <div className="order">
                            <Checkbox checked={text.status} onChange={_this.onChange.bind(_this,text)}></Checkbox>
                        </div>
                        )
            }
        }];   

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to='/system' >系统管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>编辑角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Form layout={'horizontal'} style={{marginTop:44}}>
                        <FormItem label="角色姓名" {...formItemLayout} hasFeedback required >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入角色姓名!' }],
                            })(
                                <Input  placeholder="请输入角色姓名" style={{width:358}}/>
                                
                            )}
                        </FormItem>

                        <FormItem label="登录账号" {...formItemLayout} hasFeedback required >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入登录账号!' }],
                            })(
                                <Input  placeholder="请输入登录账号" style={{width:358}}/>
                                
                            )}
                        </FormItem>
                        
                        <div className="loungeBtn">
                            <Button onClick={_this.addStation.bind(_this)} type="primary" size="large">添加</Button>
                            <Button onClick={_this.delStation.bind(_this)} type="primary" size="large">删除</Button>
                        </div>
                        
                        {this.state.stationObj}

                        <FormItem labelInValue label="角色密码" {...formItemLayout} required>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' },
                                            {
                                                message: "密码输入有误，请重新输入！",
                                                pattern: /^[a-zA-Z0-9]{6,21}$/
                                            }],
                            })(
                                <Input placeholder="请输入角色密码" type='password' style={{width:358}}/>
                            )}
                        </FormItem>
                        <FormItem labelInValue label="重复密码" {...formItemLayout} required>
                            {getFieldDecorator('confirmPassword', {
                                rules: [{ required: true, message: '请输入密码!' },
                                            {
                                                message: "密码输入有误，请重新输入！",
                                                pattern: /^[a-zA-Z0-9]{6,21}$/
                                            }],
                            })(
                                <Input placeholder="请输入角色密码" type='password' style={{width:358}}/>
                            )}
                        </FormItem>

                        <Row>
                            <Col span={24} offset={10} style={{ marginTop: 50 }} className="mb44">
                                <FormItem>
                                    <button className='btn-small wordWhite' onClick={this.handleSubmit}>保存</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small wordWhite' onClick={this.handleReset}>取消</button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    
                 </div>
            </div>
        )
    }
}

UpdatePart = Form.create()(UpdatePart);

export default AddPart;