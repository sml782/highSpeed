import './employee.less'

import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,Message,Table,Checkbox,Modal,AutoComplete } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该员工吗?';

class UpdateEmployee extends React.Component {
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
            trainStation:[],
            returnData:null,
        }
    }

    componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
    }
    componentDidMount(){
        
        $('.ant-modal-footer').eq(1).remove()
        const handleData = this.props.handleData
        this.props.form.setFieldsValue({
            name:handleData.name,
            phone:handleData.phone,
            sex:handleData.sex.toString(),
            trainStationName:handleData.trainStationName,
        })
        this.setState({returnData:handleData})
    }


    handleSubmit =(e)=>{
        
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              
            }
        });
    }


    //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            getTrainStation(value,(station) => {
                const trainStation = station.map((s) => {
                     const key = s.no +'&'+s.value
                    return <AutoCompleteOption key={key}>{s.value}</AutoCompleteOption>;
                })
                _this.setState({ trainStation: trainStation})
            })
        }
    }


    //添加/修改确认
    handleOk(){
        const _this = this;
        var employeeList, arr = [], returnData;
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(values.trainStationName == _this.props.handleData.trainStationName){
                    values.trainStationName = _this.props.handleData.trainStationName
                    values.trainStationId = _this.props.handleData.trainStationId
                }else{
                    let arr = values.trainStationName.split('&')
                    if(arr.length > 1){
                        values.trainStationName = arr[1]
                        values.trainStationId = arr[0]
                    }else{
                        Message.error('请输入正确的高铁站');
                    }
                }
                values.sex = parseInt(values.sex)
                values.employeeId = _this.props.handleData.employee_id
                $.ajax({
                    type: "POST",
                    contentType: 'application/json;charset=utf-8',
                    url: serveUrl + "hsr-role/saveOrUpdateEmployee?access_token=" + User.appendAccessToken().access_token,
                    data: JSON.stringify({
                            data:values
                        }),      
                    success: function (data) {
                        if(data.status == 200 ){
                            if(data.data != null){
                                Message.error(data.data);
                            }else{
                                Message.success(data.msg);
                                _this.props.handleOk()  
                            }
                        }else{
                            Message.error(data.msg);
                        }
                    }
                })
            }
        })

    }

    //取消添加/修改
    handleCancel(){
        this.props.form.resetFields()
        this.props.handleCancel()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const _this = this;
    
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
                        {getFieldDecorator('trainStationName', {
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
                <div className="ant-modal-footer">
                    <button type="button" className="ant-btn ant-btn-lg" onClick={_this.handleCancel.bind(_this)}><span>取 消</span></button>
                    <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={_this.handleOk.bind(_this)}><span>确 定</span></button>
                </div>
            </div>
        )
    }
}

UpdateEmployee = Form.create()(UpdateEmployee);

export default UpdateEmployee;