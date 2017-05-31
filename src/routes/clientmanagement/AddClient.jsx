import './client.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,AutoComplete } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '是否删除?';
const url = 'http://192.168.0.147:8888/';

class AddClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

     componentWillMount() {
        //   if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        
    }

    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        $(".ant-col-5").removeClass("ant-col-5").addClass("ant-col-7");
        $(".ant-col-19").removeClass("ant-col-19").addClass("ant-col-16");
        $(".ant-modal").css({top:'50%',marginTop:'-168px'});
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        return (
            <div>
                 <div className="box">
                    <Form onSubmit={this.handleAddSubmit}>
                            <FormItem {...formItemLayout} label={(<span>客户姓名&nbsp;</span>)} hasFeedback>
                                {getFieldDecorator('name', {
                                    rules: [{ message: '请输入客户姓名!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入客户姓名" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="客户类型">
                                {getFieldDecorator('type', {
                                    rules: [{ message: '请输入客户类型!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="类型1">类型1</Option>
                                        <Option value="类型2">类型2</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem label="是否验证卡号" {...formItemLayout}>
                                {getFieldDecorator('ifCheckStr', {
                                    rules: [{ message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem label="是否收费" {...formItemLayout} >
                                {getFieldDecorator('ifChargeStr', {
                                    rules: [{ message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    )}
                            </FormItem>

                            <Row>
                                <Col span={24} style={{ textAlign: 'left' }} offset={10}>
                                    <button className="btn-small" onClick={
                                        (data)=>{
                                            this.props.form.validateFields((err, values) => {
                                                if (!err) {
                                                    //保存表单
                                                    const _this = this;
                                                    const formatData = {
                                                        data: [{
                                                            name: _this.props.form.getFieldValue('name'),
                                                            type: _this.props.form.getFieldValue('type'),
                                                            ifCheck:parseInt(_this.props.form.getFieldValue('ifCheckStr')),
                                                            ifCharge:parseInt(_this.props.form.getFieldValue('ifChargeStr'))
                                                        }]
                                                    };
                                                    $.ajax({
                                                        type: "POST",
                                                        url: url + "hsr-client/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                                                        contentType: 'application/json;charset=utf-8',
                                                        data: JSON.stringify(formatData),
                                                        success: function (data) {
                                                            if (data.status == 200) {
                                                                message.success(data.msg);
                                                                _this.props.handleAddClick();
                                                                _this.props.form.resetFields();
                                                            }
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    }>保&nbsp;&nbsp;存</button>
                                </Col>
                            </Row>
                        </Form>
                 </div>
            </div>
        )
    }
}

AddClient = Form.create()(AddClient);

export default AddClient;

