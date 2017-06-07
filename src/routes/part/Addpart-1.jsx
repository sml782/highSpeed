import './part.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,Message,Table,Checkbox,Tree,Modal,TreeSelect} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData, access_token } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import AddPartLounge from './AddPartLounge'

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';
const TreeNode = Tree.TreeNode;

function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

class ServiceList extends React.Component {
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
            children:[],
            expandedKeys: ["-1"],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            addkey:1,
            station:[],
            lounges:[],
            selectLKey:undefined,
            visibleDel:false,
            visibleAdd:false,
            loungeKey:0,
            changeLounge:{},
            totalSiderBar:null,

            value:[],//已选择的菜单
            loungeId:null,//休息室的id
            productList:[],//已选择的休息室
            loungeIdList:[],//休息室列表
        }
    }
   
    componentWillMount() {
        if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
        
    }
    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        this.getInit()
    }
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
        $(".ant-select-selection__placeholder, .ant-select-search__field__placeholder").css({display:'none'});  
    }

     getInit =()=>{
        this.setState({
            menuListDate:[]
        })
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + "hsr-role/getMenuByRoleId?access_token=" + User.appendAccessToken().access_token,
            contentType:'application/json;charset=utf-8',
            data:{
                roleId:1
            },
            success: function(data){
                if(data.status == 200){
                    data.data.map(k=>{
                        k.label = k.name;
                        k.value = k.menuId.toString();
                        k.key = k.menuId;
                        if(k.children){
                            k.children.map(i=>{
                                i.label = i.name;
                                i.value = i.menuId.toString();
                                i.key = i.menuId;
                                if(i.children){
                                    i.children.map(j=>{
                                        j.label = j.name;
                                        j.value = j.menuId.toString();
                                        j.key = j.menuId;
                                    });
                                }
                            });
                        }
                    });
                    _this.setState({
                        menuListDate:data.data
                    })
                }
            }
        })
    }
    
    //删除框
    showModalDel = (record) => {
        this.setState({
            visibleDel:true,
            loungeId:record.productId
        });
    }
    handleOkDel = () => {
        let num = null;
        this.state.productList.map((k,index)=>{
            if(k.productId == this.state.loungeId){
                num = index;
            }
        });
        this.state.productList.splice(num,1);//删除指定位置的某个元素
        removeByValue(this.state.loungeIdList,this.state.loungeId);//删除休息室id（删除数组中值为多少的某个元素）
        this.setState({
            loungeIdList:this.state.loungeIdList,
            visibleDel:false,
            productList:this.state.productList
        });
    }
    handleCancelDel = () => {
        this.setState({ visibleDel:false,loungeKey:null })
    }

    //添加高铁休息室
    showModalAdd = (recode) => {
        this.setState({ visibleAdd:true })
    }

    handleOkAdd = () => {
        this.setState({ visibleAdd:false })
    }
    handleCancelAdd = (cb) => {
        this.setState({ visibleAdd:false })
    }
    //保存高铁休息室
    addProduct=(data)=>{
        this.state.productList.push({
            stationName:data[0].stationName,
            lounge:data[0].lounge,
            productId:data[0].productId
        });
        this.state.loungeIdList.push(data[0].productId);
        this.setState({
            visibleAdd:false,
            productList:this.state.productList,
            loungeIdList:this.state.loungeIdList
        });
    }

   handleSubmit =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                 const formData = {
                    client_id: "HSR",
                    grant_type: "password",
                    client_secret: "111111",
                    username: values.account,
                    password: values.description,
                    password_confirmation: values.description,
                }
                $.ajax({
                    type: "POST",
                    contentType: 'application/json;charset=utf-8',
                    url: 'http://airport.zhiweicloud.com/oauth/auth/register',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        if (Object.prototype.toString.call(data) === "[object String]") {
                            Message.error(JSON.parse(data).display_message.username[0]);
                        } else {
                            const formData1 = {
                                 data:[{
                                    name: values.name,
                                    account: values.account,
                                    productIdList:_this.state.loungeIdList,
                                    menuIdList:_this.state.value,
                                    roleId:data.user_id,
                                    isExist:0,
                                }]
                            }
                            $.ajax({
                                type: "POST",
                                contentType: 'application/json;charset=utf-8',
                                // url: "http://192.168.1.199:8887/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                                url: serveUrl+"hsr-role/saveOrUpdateRole?access_token="+ User.appendAccessToken().access_token,
                                data: JSON.stringify(formData1),
                                success: function (data) {
                                    if (data.status == 200) {
                                        Message.success(data.msg);
                                        hashHistory.push('/system');
                                    }
                                    else if (data.status == 500) {
                                        Message.error(data.msg);
                                    }
                                    
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    handleReset=()=>{
        hashHistory.push('/system');
    }
    //已选菜单
    onChange = (value) => {
        this.setState({ value: value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [
            {
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
                            </div>
                            )
                }
            }
        ];   

        const tProps = {
            treeData:_this.state.menuListDate,
            value: _this.state.value,
            onChange: _this.onChange,
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Please select',
            style: {
                width: 300,
            },
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>新增角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">                
                    <Form layout='horizontal' style={{marginTop:44}}>
                        <Row>
                            <Col span={12}>
                            <FormItem label="角色名称" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >

                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入角色名称!' }],
                                })(
                                    <Input  placeholder="请输入角色名称" style={{width:358}}/>
                                )}
                            </FormItem>
                            </Col>
                        <Col span={12}>
                            <FormItem label="登录账号" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >

                                {getFieldDecorator('account', {
                                    rules: [{ required: true, message: '请输入登录账号!' }],
                                })(
                                    <Input  placeholder="请输入登录账号" style={{width:358}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} style={{marginTop:20}}>
                            <FormItem labelInValue label="角色密码" {...formItemLayout} required style={{marginLeft:-20}}>
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: '请输入角色密码!' }],
                                })(
                                    <Input type='password'  placeholder="请输入角色密码" style={{width:358}}  className='required'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} style={{marginTop:20}}>
                        <FormItem labelInValue label="菜单权限" {...formItemLayout} hasFeedback style={{marginLeft:-20}}>
                            {getFieldDecorator('menuListName', {
                            })(
                                <TreeSelect {...tProps} placeholder="请选择" />
                            )}
                        </FormItem>
                        </Col>
                        <Col span={24}>
                        <div className="station-lounges" style={{marginTop:20}}>
                            <span  onClick={this.showModalAdd} className='btn-add' style={{display:'inline-block',marginLeft:'87%'}}>添加高铁休息室</span>
                            <Table style={{marginBottom:20,width:'100%',textAlign:"center",marginTop:20}} columns={columns} dataSource={this.state.productList}  className="lounges"/>

                        </div>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center'}} className="mb44">
                            <FormItem>
                                <span className='btn-search' style={{display:'inline-block'}} onClick={this.handleSubmit}>保存</span>
                                &nbsp;&nbsp;&nbsp;
                                <span className='btn-cancel' style={{display:'inline-block'}} onClick={this.handleReset}>取消</span>
                            </FormItem>
                        </Col>
                        </Row>
                    </Form>

                    <Modal title="添加"
                        key={Math.random()*Math.random()}
                        visible={this.state.visibleAdd}
                        onOk={this.handleOkAdd.bind(this)}
                        onCancel={this.handleCancelAdd.bind(this)}
                    >
                        <div>
                            <AddPartLounge addProduct={this.addProduct} addCancle={_this.handleCancelAdd.bind(_this)} />
                        </div>
                    </Modal>

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

                 </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;