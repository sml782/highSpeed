import './employee.less'

import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuListDate:[],
            menuIds:[],
            employeeList:[],
            employeeListLength:0,
            employeeCurrent:1,
            employeePageSize:10,
            employeeId:1,
            selectedEm:{},
            selectedRowKeys: [],
            visibleDel:false,
            addKey:0,
            visibleAdd:false,
            trainStationResult:[],
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
        //             employeeList: data.data,
        //             employeeListLength:data.data.length,
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
                    url: serveUrl+"/hsr-role/getEmployeeById?access_token="+ User.appendAccessToken().access_token,
                    contentType: 'application/json;charset=utf-8',
                    data:JSON.stringify({
                            page:page,
                            rows:rows,
                            name:values.institutionClientName
                        }),
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

    //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            setTimeout(() => {
                getTrainStation(value,(station) => {
                    console.log(station)
                    const trainStation = station.map((s) => {
                        return <AutoCompleteOption key={s.value}>{s.value}</AutoCompleteOption>;
                    })
                    _this.setState({ trainStation: trainStation})
                })
                

                
            },300)
        }
    }

    //删除弹框
    showModalDel = (record) => {
        console.log(record.employeeId)
        this.setState({
            visibleDel: true,
            employeeId:record.employee_id
        });
    }
    //删除确认
    handleOkDel = () => {
        const _this = this
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "/hsr-role/deleteEmployee?access_token="+User.appendAccessToken().access_token,
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
                _this.setState({
                    visibleDel: false
                });
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
            }
        });
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({ visibleDel: false });

    }
    //添加/修改员工
    addEmployeeBtn=(record)=>{
        this.setState({ visibleAdd: true,addKey:Math.random() * Math.random() })
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
                            _this.setState({ selectedEm: data.data})
                            _this.props.form.setFieldsValue({
                                name:data.data.name,
                                phone:data.data.phone,
                                sex:data.data.sex,
                                stationName:data.data.stationName,
                            })

                        }
                    }else{
                        message.error(data.msg);
                    }
                }
            });
            
        }else{
            this.setState({ selectedEm: {} })
        }
        
    }


    //添加/修改确认
    handleOk(){
        const dtd = $.Deferred()
        const _this = this;
        var employeeList, arr = [], selectedEm
        this.props.form.validateFields((err, values) => {
            if(!err){
                const setData = (dtd) => {
                        console.log(values)
                        employeeList = this.state.employeeList
                        selectedEm = this.state.selectedEm
                        arr = Object.keys(selectedEm)
                        trainStation.map((v,i) => {
                            if(v.value == values.trainStation){
                                values.trainStationId = v.trainStationId
                            }
                        }) 
                        selectedEm = $.extend(selectedEm,values)
                        console.log(selectedEm)
                        dtd.reject()
                        return dtd
                }
                $.when(setData(dtd)).
                    done(
                        $.ajax({
                            type: "POST",
                            contentType: 'application/json;charset=utf-8',
                            url: serveUrl + "/hsr-role/saveOrUpdateEmployee?access_token="+User.appendAccessToken().access_token,
                            beforeSend:() => {
                                console.log(arr)
                            },
                            data: JSON.stringify({
                                    data:arr.length?product:values
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
                                _this.setState({ visibleAdd: false })
                                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize)
                                }
                            })
                    )
                    
                }
            
        })

    }

    //取消添加/修改
    handleCancel(){
        this.setState({visibleAdd:false})
        this.props.form.resetFields()
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
            total: this.state.employeeListLength,
            onShowSizeChange(current, pageSize) {
                _this.state.employeeCurrent = current;
                _this.state.employeePageSize = pageSize;
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize);
            },
            onChange(current) {
                _this.state.employeeCurrent = current;
                _this.getInitList(_this.state.employeeCurrent,_this.state.employeePageSize);
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
                     key={this.state.addKey}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOk.bind(this)}
                     onCancel={this.handleCancel.bind(this)}
                 >
                     <div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                label='员工姓名'
                                {...formI}
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
                                        dataSource={this.state.trainStation}
                                        onChange={this.handleStationChange}
                                        placeholder="请输入高铁站"
                                    >
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