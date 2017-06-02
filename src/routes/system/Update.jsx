import './addpart.less'

import AddPartLounge from './AddPartLounge'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Cascader,AutoComplete,Modal} from 'antd';
import { Link} from 'react-router';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站
import $ from 'jquery';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '是否删除?';


class AddPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addkey:1,
            station:[],
            lounges:[],
            selectLKey:undefined,
            visibleDel:false,
            visibleAdd:false,
            loungeKey:0,
            changeLounge:{},
            menuListDate:[],
            menuIds:[],
            totalSiderBar:null,
        }
        this.hideForm = this.hideForm.bind(this)
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        // this.getInit()
        var lounges = []
        for(var i = 0;i < 10;i++){
            lounges.push({
                key:i,
                stationName:['杭州东站','杭州城站'][Math.floor(Math.random()*2)],
                lounge:['A10','B20'],
            })
        }
        this.setState({lounges:lounges})
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $('.loungeBtn').find('.ant-btn').eq(1).hide()
        const _this = this
        console.log(this.props.params.roleId)
        if(this.props.params.roleId){
            $.ajax({
                type: "GET",
                url: serveUrl + "hsr-role/getRoleById?access_token=" + User.appendAccessToken().access_token,
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify({
                    roleId:this.props.params.roleId
                }),
                success: function(data){
                    _this.props.form.setFieldsValue({
                        name:data.data.name,
                        username:data.data.account,
                    })
                    _this.setState({ changeLounge: data.data ,lounges: data.data.productIds})
                }
            });
        }
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
    
    //删除框
    showModalDel = (recode) => {
        console.log(recode.lounge)
        this.setState({ visibleDel:true, selectLKey:recode.key })
    }
    handleOkDel = () => {
        var lounges = this.state.lounges
        lounges.splice(this.state.loungeKey,1)
        this.setState({ visibleDel:false, lounges:lounges })
    }
    handleCancelDel = () => {
        this.setState({ visibleDel:false,loungeKey:null })
    }

    //通过form隐藏模态框
    hideForm (cb) {
        var visibleAdd = cb()
        this.setState({ visibleAdd: visibleAdd})
        
    }
    //获取Modal-Form值
    getModalForm = (cb) => {
        var lounges = this.state.lounges
        var addLounge = cb()
        addLounge.key = Math.random()
        lounges = lounges.unshift(addLounge)
        //this.setState({ lounges:lounges})
    }

    //添加/编辑框
    showModalAdd = (recode) => {
        const _this = this
        this.setState({ visibleAdd:true, addKey:Math.random()*Math.random() })
        if(recode.dispatchConfig){
            //添加
            
        }else{
            //编辑
            this.setState({ loungeKey:recode.key })
            console.log(addpl)
 
        }
    }

    
    handleOkAdd = () => {
        this.setState({ visibleAdd:false })
    }
    handleCancelAdd = () => {
        this.setState({ visibleAdd:false })
    }

    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        const dtd = $.Deferred()
        var lounges = this.state.lounges
        this.props.form.validateFields((err, values) => {
            if(!err){
                function add (dtd) {
                    values.productIds = lounges
                    console.log(values)
                    dtd.reject()
                    return dtd
                }
                $.when(add(dtd))
                    .done(
                        $.ajax({
                            type: "POST",
                            contentType: 'application/json;charset=utf-8',
                            url: serveUrl + "hsr-role/saveOrUpdateRole?access_token=" + User.appendAccessToken().access_token,
                            data: JSON.stringify({
                                    data:values
                                }),      
                            success: function (data) {
                                    _this.setState({ visibleAdd: false })
                                }
                            })
                    )
            }
        })

        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         const formData = {
        //             client_id: "LJG",
        //             grant_type: "password",
        //             client_secret: "111111",
        //             username: values.username,
        //             password: values.password,
        //             password_confirmation: values.password,
        //         }
        //         $.ajax({
        //             type: "POST",
        //             contentType: 'application/json;charset=utf-8',
        //             url: 'http://testapi.iairportcloud.com/oauth/oauth/register',
        //             data: JSON.stringify(formData),
        //             success: function (data) {
        //                 if (Object.prototype.toString.call(data) === "[object String]") {
        //                     message.error(JSON.parse(data).display_message.username[0]);
        //                 } else {
        //                     const formData1 = {
        //                         data: [{
        //                             name: values.name,
        //                             description: values.name,
        //                             account: values.username,
        //                             productIds: values.lounge,
        //                             menuIdList: _this.state.menuIds.unique()
        //                         }]
        //                     }
        //                     $.ajax({
        //                         type: "POST",
        //                         contentType: 'application/json;charset=utf-8',
        //                         url: serveUrl+"hsr-role/saveOrUpdateRole?access_token="+ User.appendAccessToken().access_token,
        //                         data: JSON.stringify(formData1),
        //                         success: function (data) {
        //                             if (data.status == 200) {
        //                                 message.success(data.msg);
        //                             }
        //                             else if (data.status == 500) {
        //                                 message.error(data.msg);
        //                             }
        //                             hashHistory.push('/system');
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //     }
        // });
    }

    handleReset =()=>{
        this.props.form.resetFields()
    }
   

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [{
            title: '高铁站',
            width: '25%',
            dataIndex: 'stationName',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '关联休息室',
            width: '55%',
            dataIndex: 'lounge',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '20%',
            render(text,record) {
                return (
                        <div className="order">
                            <a onClick={_this.showModalDel.bind(_this,record)}  style={{color:'#4778c7'}}>删除</a>
                            &nbsp;&nbsp;&nbsp;
                            <a onClick={_this.showModalAdd.bind(_this,record)} style={{marginRight:10,color:'#4778c7'}}>修改</a>
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
                            <Breadcrumb.Item><Link to='/system'>系统管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>新增角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <Form layout={'horizontal'} style={{marginTop:44}}>
                        <FormItem label="角色姓名" {...formItemLayout} required >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入角色姓名!' }],
                            })(
                                <Input  placeholder="请输入角色姓名" style={{width:358}}/>
                                
                            )}
                        </FormItem>

                        <FormItem label="登录账号" {...formItemLayout} required >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入登录账号!' }],
                            })(
                                <Input  placeholder="请输入登录账号" style={{width:358}}/>
                            )}
                        </FormItem>

                        <div className="station-lounges">
                            <Button onClick={_this.showModalAdd} type="primary" size="large">添加高铁休息室</Button>
                            <Table style={{marginBottom:20,width:600,textAlign:"center"}} columns={columns} dataSource={this.state.lounges}  className="lounges"/>
                        </div>

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
                 <Modal title="警告"
                     key={Math.random() * Math.random()}
                     visible={this.state.visibleDel}
                     onOk={this.handleOkDel.bind(this)}
                     onCancel={this.handleCancelDel.bind(this)}
                     >
                     <div>
                        <DeleteDialog msg={msg} />
                     </div>
                 </Modal>
                 <Modal title="添加/编辑"
                     key={this.state.addKey}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOkAdd.bind(this)}
                     onCancel={this.handleCancelAdd.bind(this)}
                 >
                    <div>
                        <AddPartLounge hideForm={this.hideForm} getModalForm={this.getModalForm} lounges={this.state.lounges[this.state.loungeKey]} />
                    </div>
                 </Modal>
            </div>
        )
    }
}

AddPart = Form.create()(AddPart);

export default AddPart;