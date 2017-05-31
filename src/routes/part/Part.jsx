import '../system/system.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,access_token} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';
const url = 'http://192.168.0.147:8888/';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
            serveTypeData:[],
            roleId:1,
            partListDate: [],
            partListDateLength:null,
            partListDateCurrent:1,
            partListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            clientTypeResult:[],
        }
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        this.getInitList(this.state.partListDateCurrent,this.state.partListDatePageSize)

    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        const _this = this
        this.getInitList(this.state.partListDateCurrent,this.state.partListDatePageSize)
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
   handleSubmit =(e)=>{
       e.preventDefault()
    }
   
     getInitList(page,rows){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    url: url+"hsr-role/getRoleList?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        page:page,
                        rows:rows,
                    },
                    success: function(data){
                        if(data.status == 200){
                            data.data.rows.map((v,index)=>{
                                v.key = v.employee_id
                            })
                            _this.setState({
                                partListDate: data.data.rows,
                                partListDateLength:data.data.total
                            })
                        }
                    }
                });
            }
        });
    }

    //删除弹框
    showModalDel = (record) => {
        this.setState({
            visibleDel: true,
            roleId:record.roleId
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false
        });
        //删除角色
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: url + "hsr-role/deleteRoles?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.roleId)]
            }),
            success: function (data) {
                if(data.status == 200 ){
                    message.success(data.msg);
                }else{
                    message.error(data.msg);
                }
                _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize)
            }
        });
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    addPart = () => {
        hashHistory.push('/addPart')
    }
    //编辑角色
    editPart = (record) => {
        var roleId = record.roleId;
        hashHistory.push(`/editPart/${roleId}`)
    }

    //新增角色
    addPart = (record) => {
        hashHistory.push(`/addPart`)
    }
    showTotal(total) {
      return `共 ${total} 条`;
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const _this = this;
        const columns = [ {
            title: '管理员姓名',
            width: '20%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '登录名称',
            width: '20%',
            dataIndex: 'account',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '关联休息室',
            width: '30%',
            dataIndex: 'productName',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '操作',
            width: '30%',
            dataIndex: 'handle',
            render(text,record) {
                return (
                        <div className="order">
                            <span onClick={_this.editPart.bind(_this,record)} className='listRefresh'>编辑</span>
                            <Popconfirm title="确认删除?" onConfirm={() => _this.showModalDel.bind(_this,record)}>
                            <span  style={{marginLeft:4}} className='listCancel'>删除</span>
                            </Popconfirm>
                        </div>
                        )
            }
        }];

       const pagination = {
            total: this.state.partListDateLength,
            size:'small',
            showTotal:this.showTotal ,
            onShowSizeChange(current, pageSize) {
                _this.state.partListDateCurrent = current;
                _this.state.partListDatePageSize = pageSize;
                _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize);
            },
            onChange(current) {
                _this.state.partListDateCurrent = current;
                _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize);
            },

      };

       //客户类型
       const { clientTypeResult } = this.state;
        const clientType = clientTypeResult.map((type) => {
            return <AutoCompleteOption key={type}>{type}</AutoCompleteOption>;
        });

        return (
            <div>

                 <div className="box">
                    
                    <Row>
                        <div className='btn-add' style={{marginLeft:'87%'}} onClick={this.addPart}><span>新增角色</span><img src={require('../../assets/images/add.png')} className='addImg'/></div>
                        <div className="search-result-list" >
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.partListDate}  className="serveTable"/>
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
                
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;