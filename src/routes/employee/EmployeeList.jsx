import './employee.less'

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
            autoCompleteResult:[],
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
                name:`张${i}`,
                phone:Math.floor(Math.random()*10000000000+13000000000),
                onesSpeed:`杭州${i}`
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    //url: serveUrl+"list",
                    url: serveUrl+"guest-employee/list?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        page:page,
                        rows:rows,
                        name:values.institutionClientName
                        },
                    success: function(data){
                        data.data.rows.map((v,index)=>{
                            v.key = v.employee_id
                        })
                        _this.setState({
                            partListDate: data.data.rows,
                            partListDateLength:data.data.total
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
            employeeId:record.employee_id
        });
    }
    //删除确认
    handleOkDel = () => {
        setTimeout(() => {
            this.setState({
                visibleDel: false
            });
            //删除协议
            const _this = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "guest-employee/delete?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(_this.state.employeeId)]
                }),
                success: function (data) {
                    if(data.status == 200 ){
                        if(data.data != null){
                            message.error(data.data);
                        }else{
                            message.success(data.msg);
                        }
                    }else{
                        message.error(data.msg);
                    }
                    _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize)
                }
            });
        }, 1000);
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    //增加员工
    addEmployeeBtn=()=>{
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
        const { autoCompleteResult } = this.state;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
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
            dataIndex: 'onesSpeed',
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
                            <a onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
                            <a href={`#/updataEmployee/${record.employee_id}`} style={{marginRight:10,color:'#4778c7'}}>编辑</a>
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

      const highSpeedStation = autoCompleteResult.map((station) => {
        return <AutoCompleteOption key={website}>{station}</AutoCompleteOption>;
      });
       
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
                        <Col>
                            <button className="btn" style={{marginTop:10}} onClick={this.addEmployeeBtn}>新增员工</button>
                        </Col>
                        <Col style={{marginTop:-48,marginLeft:200}}>
                            <Form inline horizontal
                                className="ant-advanced-search-form"
                                onSubmit={this.getInitList.bind(this,this.state.partListDateCurrent,this.state.partListDatePageSize)}
                                >
                                <Row>
                                    <FormItem label="员工姓名:" {...formItemLayout} hasFeedback style={{ width:30+'%',marginTop:15}}>
                                        {getFieldDecorator('institutionClientName', {
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.AutoClientList}
                                                placeholder="请输入员工姓名"
                                                style={{width:170}}
                                            />
                                        )}
                                    </FormItem>
                                    <button className='btn-small' onClick={this.handleSearch} style={{marginRight:26,marginLeft:15,marginTop:15}}>查&nbsp;&nbsp;询</button>
                                </Row>
                            </Form>
                        </Col>
                        
                        <div className="search-result-list" >
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.partListDate}  className=" serveTable"/>
                            <p style={{marginTop: 20}}>共搜索到{this.state.partListDateLength}条数据</p>
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
                     onOk={this.handleOkDel}
                     onCancel={this.handleCancelDel}
                 >
                     <div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formI}
                                label={(
                                    <span>员工姓名&nbsp;</span>
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator('employeeName', {
                                    rules: [{ required: true, message: '请输入员工姓名!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入员工姓名" />
                                )}
                           </FormItem>
                           <FormItem
                                {...formI}
                                label="手机号码"
                            >
                                {getFieldDecorator('phone', {
                                    rules: [{ required: true, message: '请输入手机号!', pattern:/^1[3|4|5|7|8][0-9]\d{4,8}$/ }],
                                })(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="所属高铁站"
                            >
                                {getFieldDecorator('website', {
                                    rules: [{ required: true, message: '请输入高铁站!' }],
                                })(
                                    <AutoComplete
                                        dataSource={highSpeedStation}
                                        // onChange={this.handleWebsiteChange}
                                        placeholder="请输入高铁站"
                                    >
                                        <Input />
                                    </AutoComplete>
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