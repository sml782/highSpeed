import './client.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
            serveTypeData:[],
            partListDate: [],
            partListDateLength:null,
            partListDateCurrent:1,
            partListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            visibleAdd:false,
            employeeId:null,
            clientTypeResult:[],
        }
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        this.getInitList(this.state.partListDateCurrent,this.state.partListDatePageSize)
        var data = []
        for(var i = 0;i < 100;i++){
            data.push({
                key:i,
                name:['龙腾卡','商旅卡'][Math.floor(Math.random())],
                type:['a','b','c'][Math.floor(Math.random()*2)],
                verify:['是','否'][Math.floor(Math.random())],
                chargeOrNot:['是','否'][Math.floor(Math.random())]
            })
        }
        this.setState({partListDate:data})
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
   handleSubmit =(e)=>{
       console.log(e)
       e.preventDefault()
    }
   
     getInitList(page,rows){
        const data = [];
        const _this = this;
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         $.ajax({
        //             type: "GET",
        //             //url: serveUrl+"list",
        //             url: serveUrl+"guest-employee/list?access_token="+ User.appendAccessToken().access_token,
        //             data:{
        //                 page:page,
        //                 rows:rows,
        //                 name:values.institutionClientName
        //                 },
        //             success: function(data){
        //                 data.data.rows.map((v,index)=>{
        //                     v.key = v.employee_id
        //                 })
        //                 _this.setState({
        //                     partListDate: data.data.rows,
        //                     partListDateLength:data.data.total
        //                 })
        //             }
        //         });
        //     }
        // });
    }

    //删除弹框
    showModalDel = (record) => {
        this.setState({
            visibleDel: true,
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false
        });
        // setTimeout(() => {
        //     this.setState({
        //         visibleDel: false
        //     });
        //     //删除协议
        //     const _this = this;
        //     // $.ajax({
        //     //     type: "POST",
        //     //     contentType: 'application/json;charset=utf-8',
        //     //     url: serveUrl + "guest-employee/delete?access_token="+User.appendAccessToken().access_token,
        //     //     data: JSON.stringify({
        //     //         data: [parseInt(_this.state.employeeId)]
        //     //     }),
        //     //     success: function (data) {
        //     //         if(data.status == 200 ){
        //     //             if(data.data != null){
        //     //                 message.error(data.data);
        //     //             }else{
        //     //                 message.success(data.msg);
        //     //             }
        //     //         }else{
        //     //             message.error(data.msg);
        //     //         }
        //     //         _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize)
        //     //     }
        //     // });
        // }, 1000);
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    //编辑客户弹窗
    showAdd = (record) => {
        console.log(record)
        this.setState({visibleAdd:true})
    }
    //增加客户
    addClientBtn = (record) => {
        this.setState({visibleAdd:true})
    }

    //添加/修改
    handleOk(){
        this.setState({visibleAdd:false})
    }

    //取消添加/修改
    handleCancel(){
        this.setState({visibleAdd:false})
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
            dataIndex: 'verify',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '是否收费',
            width: '15%',
            dataIndex: 'chargeOrNot',
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
                            <a onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>&nbsp;&nbsp;
                            <a onClick={_this.showAdd.bind(_this,record)} style={{marginRight:10,color:'#4778c7'}}>编辑</a>
                        </div>
                        )
            }
        }];

       const pagination = {
            total: this.state.partListDateLength,
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
                        <Col>
                            <button className="btn" onClick={this.addClientBtn.bind(this)}>新增客户</button>
                        </Col>
        
                        <div className="search-result-list" >
                            <p style={{marginTop: 20}}>共搜索到{this.state.partListDateLength}条数据</p>
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
                 <Modal title="添加/编辑"
                     key={Math.random() * Math.random()}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOk.bind(this)}
                     onCancel={this.handleCancel.bind(this)}
                 >
                     <div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formI}
                                label={(
                                    <span>客户姓名&nbsp;</span>
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator('clientName', {
                                    rules: [{  message: '请输入客户姓名!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入客户姓名" />
                                )}
                           </FormItem>
                           <FormItem
                                {...formI}
                                label="客户类型"
                            >
                                {getFieldDecorator('clientType', {
                                    rules: [{  message: '请输入客户类型!' }],
                                })(
                                    <AutoComplete
                                        dataSource={clientType}
                                        // onChange={this.handleWebsiteChange}
                                        placeholder="请输入客户类型"
                                    >
                                        <Input />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem
                                label="是否需要验证卡号" 
                                {...formI}
                            >
                                {getFieldDecorator('verifyCard', {
                                    rules: [{ message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="是">是</Option>
                                        <Option value="否">否</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="是否收费" 
                                {...formI}
                            >
                                {getFieldDecorator('chargeOrNot', {
                                    rules: [{ message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="是">是</Option>
                                        <Option value="否">否</Option>
                                    </Select>
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