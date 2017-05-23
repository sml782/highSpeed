import './part.less'

import AddPartLounge from './AddPartLounge'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Tree,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData, access_token } from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';
const TreeNode = Tree.TreeNode;

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
        }
        this.hideForm = this.hideForm.bind(this)
    }
   
    componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        this.getInit()
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
    }
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
       
    }

     getInit =()=>{
        this.setState({
                        menuListDate:[]
                    })
        const _this = this
        $.ajax({
            type: "GET",
            //url: serveUrl+"/hsr-role/getMenuByRoleId?access_token="+ User.appendAccessToken().access_token,
            url: serveUrl + "/hsr-role/getMenuByRoleId?access_token=" + access_token,
            contentType:'application/json;charset=utf-8',
            data:{
                roleId:1
            },
            success: function(data){
                let allCheckobj = {menuId:-1,name:"菜单",children:data.data}
                let arr = [allCheckobj]
                _this.setState({
                    menuListDate:arr
                })
                
            }
        })
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
        
        const __this = this
        if(text.target.checked){
            __this.state.menuIds.push(_this.id)
            
        }else{
            __this.state.menuIds.remove(_this.id); 
        }
        
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

   handleSubmit =(e)=>{
        const _this = this;
        e.preventDefault();
        var lounges = this.state.lounges
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var productIds = [], proStr = ''
                lounges.map((v,i) => {
                    productIds = productIds.concat(v.lounge)
                })
                productIds.map((v,i) => {
                    proStr =  proStr.concat(v,',')
                })
                proStr = proStr.substring(0,proStr.length-1)
                console.log(productIds)
                values.productIds = {productIds:proStr}
                console.log(values)
                const formData = {
                    data:[{
                        "name": values.name,//菜单管理
                        "description": values.description, //菜单排序
                        "account": values.account,
                        "productIds": proStr,
                        "menuIdList":_this.state.menuIds,
                    }]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    //url: serveUrl+"/hsr-role/saveOrUpdateRole?access_token="+ User.appendAccessToken().access_token,
                    url: serveUrl+"/hsr-role/saveOrUpdateRole?access_token="+ access_token,
                    data: JSON.stringify(formData),
                    success: function(data){
                        if(data.status == 200){
                            message.success(data.msg);
                            hashHistory.push('/system');
                        }
                        else{
                            message.error(data.msg);
                        }
                        
                    }
                });  
            }
        });
    }

    handleReset=()=>{
        hashHistory.push('/system');
    }
   
//树形控件

  onExpand = (expandedKeys) => {
    //  console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
  //  console.log(checkedKeys)
    var newarr = [];
    for(var i=0;i<checkedKeys.length;i++){
        if(checkedKeys[i]!="-1"){
             var newkey = parseInt(checkedKeys[i])
             newarr.push(newkey)
        }
    }
    this.setState({
        menuIds:newarr
    });
  }
  onSelect = (selectedKeys, info) => {
    //  console.log(selectedKeys);
    //this.setState({ menuIds:selectedKeys });
  }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
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

        //tree
        const loop = data => data.map((v,values) => {
            if (v.children) {
                return (
                <TreeNode key={v.menuId} title={v.name} >
                    {loop(v.children)}
                </TreeNode>
                );
            }
            return <TreeNode key={v.menuId} title={v.name} />;
        });
     
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to='/system'>角色管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>新增角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Form layout={'horizontal'} onSubmit={this.handleSubmit} style={{marginTop:44}}>
                        <Row>
                            <FormItem label="角色名称" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入角色名称!' }],
                                })(
                                    <Input  placeholder="请输入角色名称" style={{width:358}}  className='required'/>
                                    
                                )}
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem label="登录账号" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                                {getFieldDecorator('account', {
                                    rules: [{ required: true, message: '请输入登录账号!' }],
                                })(
                                    <Input  placeholder="请输入登录账号" style={{width:358}}  className='required'/>
                                    
                                )}
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem labelInValue label="角色描述" {...formItemLayout} required style={{marginLeft:-20}}>
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: '请选择跟进人!' }],
                                })(
                                    <Input  placeholder="请输入角色名称" style={{width:358}}  className='required'/>
                                )}
                            </FormItem>
                        </Row>

                        <div className="station-lounges">
                            <Button onClick={_this.showModalAdd} type="primary" size="large">添加高铁休息室</Button>
                            <Table style={{marginBottom:20,width:600,textAlign:"center"}} columns={columns} dataSource={this.state.lounges}  className="lounges"/>
                        </div>
                        
                        <div className="search-result-list" style={{marginLeft:14}}>
                             <Tree
                                checkable
                                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}  
                                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
                            >
                                {loop(_this.state.menuListDate)}
                            </Tree>
                        </div>

                        <Row style={{marginTop:50 }}>
                            <Col span={24} style={{ textAlign: 'center'}} className="mb44">
                                <FormItem>
                                    <button className='btn-small' onClick={this.handleSubmit}>保存</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small' onClick={this.handleReset}>取消</button>
                                </FormItem>
                            </Col>
                        </Row>
                        
                    </Form>
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
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;