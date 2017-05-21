import './addpart.less'
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

class AddPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
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
            highSpeedData:[],
            lounges:[],
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
    }

    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }

     getInit =()=>{
        //  this.setState({
        //      menuListDate: []
        //  })
        // const _this = this;
        // $.ajax({
        //     type: "GET",
        //     url: serveUrl+"guest-role/list?access_token="+ User.appendAccessToken().access_token,
        //     success: function(data){
        //         data.data.rows.map((v,index)=>{
        //             v.key = v.roleId;
        //             v.status = false;
        //         })
        //         _this.setState({
        //             siderBar1:data.data.rows,
        //             totalSiderBar:data.data.total
        //         })
        //     }
        // })
    }

    getInitList(page, rows) {
        // const data = [];
        // const _this = this;
        // $.ajax({
        //     type: "GET",
        //     url: serveUrl + "guest-role/list?access_token=" + User.appendAccessToken().access_token,
        //     data: {
        //         page: page,
        //         rows: rows
        //     },
        //     success: function (data) {
        //         data.data.rows.map((v, index) => {
        //             v.key = v.roleId
        //         })
        //         _this.setState({
        //             siderBar1: data.data.rows,
        //             totalSideBar: data.data.total
        //         })
        //         //角色权限是否勾选
        //         _this.state.menuIds.map((v, index) => {
        //             const roleId = v;
        //             _this.state.siderBar1.map((k, index) => {
        //                 if (k.roleId == roleId) {
        //                     k.status = true;
        //                 }
        //             })
        //         });
        //         _this.state.siderBar1.map((j, index) => {
        //             if (j.status != true) {
        //                 j.status = false
        //             } else {
        //                 _this.state.menuIds.push(j.roleId)
        //             }
        //         })
        //         _this.setState({
        //             siderBar1: _this.state.siderBar1
        //         })
        //     }
        // });
    }

    selectStation = (station) => {
        console.log(station)
        var station = []
        this.setState({highSpeedData:station})
        for(var i = 0;i < 20;i++){
            station.push(`杭州东站${i}`)
        }
        this.setState({highSpeedData:station})

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
                    url: 'http://airport.zhiweicloud.com/oauth/auth/register',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        if (Object.prototype.toString.call(data) === "[object String]") {
                            message.error(JSON.parse(data).display_message.username[0]);
                        } else {
                            const formData1 = {
                                data: [{
                                    employeeId: data.user_id,
                                    isExist: 0,
                                    account: values.username,
                                    "name": values.name,
                                    roleIdList: _this.state.menuIds.unique()
                                }]
                            }
                            $.ajax({
                                type: "POST",
                                contentType: 'application/json;charset=utf-8',
                                // url: "http://192.168.1.199:8887/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                                url: serveUrl+"guest-employee/saveOrUpdate?access_token="+ User.appendAccessToken().access_token,
                                data: JSON.stringify(formData1),
                                success: function (data) {
                                    if (data.status == 200) {
                                        message.success(data.msg);
                                    }
                                    else if (data.status == 500) {
                                        message.error(data.msg);
                                    }
                                    hashHistory.push('/employeeList');
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
            labelCol: { span: 5 },
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

        const residences = [{
            value: '杭州东站',
            label: '杭州东站',
            children: [{
                value: 'A10',
                label: 'A10'
            },{
                value: 'B20',
                label: 'B20'
            }]
        },{
            value: '杭州城站',
            label: '杭州城站',
            children: [{
                value: 'C50',
                label: 'C50'
            },{
                value: 'B20',
                label: 'B20'
            }]
        }]            

        const pagination = {
            total: this.state.totalSiderBar,
            onShowSizeChange(current, pageSize) {
                _this.state.serveListDateCurrent = current;
                _this.state.serveListDatePageSize = pageSize;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            },
            onChange(current) {
                _this.state.serveListDateCurrent = current;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            }
        };

        //关联高铁站
        const { highSpeedData } = this.state;
        const highSpeedStation = highSpeedData.map((station) => {
            return <AutoCompleteOption key={station}>{station}</AutoCompleteOption>;
        });

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to='/system' >系统管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>新增角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Form layout={'horizontal'} style={{marginTop:44}}>
                        <FormItem label="角色姓名" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入角色姓名!' }],
                            })(
                                <Input  placeholder="请输入角色姓名" style={{width:358}}/>
                                
                            )}
                        </FormItem>

                        <FormItem label="登录账号" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                            {getFieldDecorator('username', {
                                rules: [    { required: true, message: '请输入登录账号!' }],
                            })(
                                <Input  placeholder="请输入登录账号" style={{width:358}}/>
                                
                            )}
                        </FormItem>

                        <FormItem label="关联高铁站" hasFeedback>
                            {getFieldDecorator('highSpeedStation', {
                                rules: [
                                    { required: true, message: '请选择高铁站!' },
                                ],
                            })(
                                <AutoComplete
                                    onChange={_this.selectStation.bind(_this)}
                                    dataSource={highSpeedStation}
                                    placeholder="请输入高铁站"
                                    style={{width:358}}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="关联休息室"
                        >
                            {getFieldDecorator('lounge', {
                                rules: [
                                    { required: true, message: '请选择休息室!', type: 'array' },
                                ],
                            })(
                                <Select mode="multiple" placeholder="请选择休息室" style={{width:358}}>
                                    <Option value="red">Red</Option>
                                    <Option value="green">Green</Option>
                                    <Option value="blue">Blue</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem labelInValue label="角色密码" {...formItemLayout} required style={{marginLeft:-20}}>
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
                        <FormItem labelInValue label="重复密码" {...formItemLayout} required style={{marginLeft:-20}}>
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

AddPart = Form.create()(AddPart);

export default AddPart;