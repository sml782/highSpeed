import './employee.less'

import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete } from 'antd';
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
            
            menuListDate:[],
            menuIds:[],
            employeeList:[],
            employeeListLength:0,
            employeeCurrent:1,
            employeePageSize:10,
            employeeId:1,
            selectedRowKeys: [],
            visibleDel:false,
            visibleAdd:false,
            employeeId:null,
            highspeedResult:[],
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
                employeeId:i,
                name:['张三','李四'][Math.floor(Math.random()*2)],
                sex:['0','1'][Math.floor(Math.random()*2)],
                phone:Math.floor(Math.random()*18888888888+13000000000),
                stationName:['杭州东站','杭州城站'][Math.floor(Math.random()*2)],
            })
        }
        this.setState({employeeList:data,employeeListLength:data.length})
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">")
        $(".ant-breadcrumb-separator").css({color:'#333'})
        const _this = this
        //获取员工列表
        // $.ajax({
        //     type: "GET",
        //     url: serveUrl+"/hsr-role/getEmployeeById?access_token="+ User.appendAccessToken().access_token,
        //     success: function(data){
        //         var employeeList = []
        //         data.data.employee.map((v,i)=>{
        //             employeeList.push({
        //                 key:i,
        //                 employeeId:v.employeeId,
        //                 name:v.name,
        //                 phone:v.phone,
        //                 stationName:v.stationName,
        //             })
        //         })
        //         _this.setState({
        //             employeeList: employeeList,
        //             employeeListLength:data.data.employee.length,
        //         })
        //     }
        // })
    }

    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    handleSubmit =(e)=>{
        console.log(e)
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              console.log(values);
            }
        });
    }

     getInitList(page,rows){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    //url: serveUrl+"list",
                    url: serveUrl+"/hsr-role/getEmployeeById?access_token="+ User.appendAccessToken().access_token,
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
                            employeeList: data.data.rows,
                            employeeListLength:data.data.total
                        })
                    }
                });
            }
        });
    }

    //匹配高铁站
    handleStationChange(value){
        console.log(value)
    }

    //删除弹框
    showModalDel = (record) => {
        console.log(record.employeeId)
        this.setState({
            visibleDel: true,
            employeeId:record.employeeId
        });
    }
    //删除确认
    handleOkDel = () => {
        // setTimeout(() => {
        //     this.setState({
        //         visibleDel: false
        //     });
        //     const _this = this;
        //     $.ajax({
        //         type: "POST",
        //         contentType: 'application/json;charset=utf-8',
        //         url: serveUrl + "/hsr-role/deleteEmployee?access_token="+User.appendAccessToken().access_token,
        //         data: JSON.stringify({
        //             data: [parseInt(_this.state.employeeId)]
        //         }),
        //         success: function (data) {
        //             if(data.status == 200 ){
        //                 if(data.data != null){
        //                     message.error(data.data);
        //                 }else{
        //                     message.success(data.msg);
        //                 }
        //             }else{
        //                 message.error(data.msg);
        //             }
        //             _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
        //         }
        //     });
        // }, 1000);
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({ visibleDel: false });

    }
    //添加/修改员工
    addEmployeeBtn=(record)=>{
        this.setState({ visibleAdd: true })
        const _this = this
        if(!record.dispatchConfig){
            console.log(record)
            $.ajax({
                type: "GET",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "/hsr-role/deleteEmployee?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(record.employeeId)]
                }),
                success: function (data) {
                    if(data.status == 200 ){
                        if(data.data != null){
                            message.error(data.data);
                        }else{
                            message.success(data.msg);
                            _this.props.form.setFieldsValue(data.param)
                        }
                    }else{
                        message.error(data.msg);
                    }
                }
            });
            
        }
        
    }


    //添加/修改确认
    handleOk(){
        var values = this.form.getFieldsValue()
        console.log(values)
        // setTimeout(() => {
        //     this.setState({ visibleAdd: false })
        //     const _this = this;
        //     $.ajax({
        //         type: "POST",
        //         contentType: 'application/json;charset=utf-8',
        //         url: serveUrl + "/hsr-role/saveOrUpdateEmployee?access_token="+User.appendAccessToken().access_token,
        //         data: JSON.stringify({
        //             data: [values]
        //         }),
        //         success: function (data) {
        //             if(data.status == 200 ){
        //                 if(data.data != null){
        //                     message.error(data.data);
        //                 }else{
        //                     message.success(data.msg);
        //                 }
        //             }else{
        //                 message.error(data.msg);
        //             }
        //             _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
        //         }
        //     });
        // }, 1000);
    }

    //取消添加/修改
    handleCancel(){
        this.setState({visibleAdd:false})
        this.handleReset.call(this)
    }

    handleReset =()=>{
        hashHistory.go('/employeeList');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
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
            dataIndex: 'stationName',
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
                            <a onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>&nbsp;&nbsp;
                            <a onClick={_this.addEmployeeBtn.bind(_this,record)} style={{marginRight:10,color:'#4778c7'}}>编辑</a>
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

      const { highspeedResult } = this.state;
      const highSpeedStation = highspeedResult.map((station) => {
        return <AutoCompleteOption key={station}>{station}</AutoCompleteOption>;
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
                            <button className="btn" ref="addEmployee" onClick={this.addEmployeeBtn}>新增员工</button>
                        </Col>
                        
                        <div className="search-result-list" >
                            <p style={{marginTop: 20}}>共搜索到{this.state.employeeListLength}条数据</p>
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.employeeList}  className="serveTable"/>
                        </div>
                    </Row>
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
                                    <span>员工姓名&nbsp;</span>
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入员工姓名!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入员工姓名" />
                                )}
                           </FormItem>
                           <FormItem
                                label="性别" 
                                {...formI}
                            >
                                {getFieldDecorator('sex', {
                                    rules: [{ required: true, message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="1">男</Option>
                                        <Option value="0">女</Option>
                                    </Select>
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
                                {getFieldDecorator('stationName', {
                                    rules: [{ required: true, message: '请输入高铁站!' }],
                                })(
                                    <AutoComplete
                                        dataSource={highSpeedStation}
                                        onchange={this.handleStationChange}
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
