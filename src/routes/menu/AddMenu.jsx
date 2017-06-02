import './menu.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Menu } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData, access_token} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;


    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const defaultCheckedList = ['Apple', 'Orange'];
    const plainOptions1 = ['Apple', 'Pear', 'Orange'];

class AddMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: defaultCheckedList,
            checkedList1: defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            indeterminate1: true,
            checkAll1: false,

            productTypeData:[],
            serveTypeData:[],
            serveListDate: [],
            serveListDateLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            siderBar1:[],
            current: '1',
            openKeys: [''],
            pId:0,
        }
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
            pId:e.key,
        })
    }
    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
        this.setState({
            pId:latestOpenKey,
        })
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys = (key) => {
        const map = {};
        return map[key] || [];
    }
     componentWillMount() {
        //   if(User.isLogin()){
              
        // } else{
        //     hashHistory.push('/login');
        // }
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'hsr-role/getMenuByRoleId?access_token=' + User.appendAccessToken().access_token,
            data:{airportCode:'LJG',roleId:1},
            success: function(data){
                _this.setState({
                    siderBar1:data.data
                })
            }
        })
        
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
    }

    handleSubmit =(e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = {
                    data:[{
                        "pid": _this.state.pId,//菜单父id
                        "name": values.name,//菜单管理
                        "url": values.url,//菜单url 
                        "position": values.position, //菜单排序
                        type:values.type
                    }]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl + 'hsr-role/addMenu?access_token=' + User.appendAccessToken().access_token,
                    data: JSON.stringify(formData),
                    success: function(data){
                        if(data.status == 200){
                            message.success(data.msg);
                            hashHistory.push('system')
                        }
                        else if(data.status == 500){
                            message.error('后台错误');
                        }else{
                            message.error(data.msg);
                        }
                    }
                });  
            }
        });
    }

    handleReset=()=>{
        this.props.form.resetFields();
        hashHistory.push('system');
    }
    recursion(dataSource) {
        return (
        dataSource.map((v, index) => {
            if (v.children) {
            return (
                <SubMenu key={v.menuId} title={v.name} className='floatNone'>
                {this.recursion(v.children)}
                </SubMenu>
            )
            } else {
            return (<Menu.Item key={v.menuId} className='floatNone'>{v.name}</Menu.Item>)
            }
        })
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
       

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>新增菜单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                     <Menu
                        onClick={this.handleClick}
                        className='menuLeft'
                        style={{ width: 185,marginTop:10,marginLeft:14,float:'left'}}
                        mode="inline"
                        onOpenChange={this.onOpenChange}
                        selectedKeys={[this.state.current]}
                     >
                        {this.recursion(this.state.siderBar1)}
                    </Menu>
                            
                    <Form horizontal style={{marginLeft:200}}>
                        <Row>
                            <Col span={12} >
                                <FormItem label="菜单名称" {...formItemLayout} hasFeedback   >
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true,message: '请输入菜单名称!' }],
                                    })(
                                        <Input   style={{width:358}}  className='required'/>
                                        
                                    )}
                                </FormItem>
                            </Col>
                        <Col span={12}>
                        <FormItem label="菜单链接" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('url', {
                                 rules: [{ required: true,message: '请输入菜单链接!'  }],
                            })(
                                <Input   style={{width:358}}  className='required'/>
                                
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem label="菜单排序" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('position', {
                                 rules: [{ required: true,message: '请输入菜单排序!'  }],
                            })(
                                <Input   style={{width:358}}  className='required'/>
                                
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem label="菜单图标" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('type', {
                            })(
                                <Input   style={{width:358}}  className='required'/>
                                
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row>
                            <Col span={12} style={{marginLeft:200,marginTop:-50}}>
                                <FormItem >
                                    <button className='btn-search' onClick={this.handleSubmit}>保存</button>
                                    <button className='btn-add'  onClick={this.handleReset} style={{marginLeft:20}}>取消</button>
                                </FormItem>
                            </Col>
                        </Row>
                        
                        
                    </Form>
                   
                 </div>
            </div>
        )
    }
}

AddMenu = Form.create()(AddMenu);

export default AddMenu;