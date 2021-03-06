import './client.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,Message,Radio,AutoComplete } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '是否删除?';

class UpdateClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           dataSource:null
        }
    }

     componentWillMount() {
        if(User.isLogin()){
        } else{
            hashHistory.push('login');
        }
        
        
    }

    componentDidMount () {
        $(".ant-modal-footer").eq(1).remove();
        $(".ant-col-5").removeClass("ant-col-5").addClass("ant-col-7");
        $(".ant-col-19").removeClass("ant-col-19").addClass("ant-col-16");
        $(".ant-modal").css({top:'50%',marginTop:'-168px'});
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "hsr-client/clientView?access_token=" + User.appendAccessToken().access_token,
            data: {
                clientId:_this.props.clientId
            },
            success: function (data) {
                if (data.status == 200) {
                    if(data.data){
                        _this.props.form.setFieldsValue({
                            name:data.data.name,
                            type:data.data.type,
                            isCheckStr:data.data.isCheckStr,
                            isChargeStr:data.data.isChargeStr
                        })
                    }
                }
            }
        });
    }
    
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.handleCancel()

    }

    render() {
        const _this = this
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        return (
            <div>
                 <div className="box">
                   <Form onSubmit={this.handleEditSubmit}>
                            <FormItem {...formItemLayout} label='客户名称' hasFeedback>
                                {getFieldDecorator('name', {
                                    rules: [{ required:true ,message: '请输入客户名称!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入客户名称" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="客户类型">
                                {getFieldDecorator('type', {})(
                                    <Input placeholder="请输入客户类型" />
                                )}
                            </FormItem>
                            <FormItem label="是否验证卡号" {...formItemLayout}>
                                {getFieldDecorator('isCheckStr', {})(
                                    <Select placeholder="请选择">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    )}
                            </FormItem>
                            <FormItem label="是否收费" {...formItemLayout}>
                                {getFieldDecorator('isChargeStr', {
                                    rules: [{ required:true ,message: '请选择!' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Form>
                        <Row>
                            <Col span={24} style={{ textAlign: 'left' }}>
                                <div className="ant-modal-footer">
                                    <button type="button" className="ant-btn ant-btn-lg" onClick={_this.handleCancel.bind(_this)}><span>取 消</span></button>
                                    <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={(data)=>{
                                            this.props.form.validateFields((err, values) => {
                                                if (!err) {
                                                    //保存表单
                                                    const _this = this;
                                                    const formatData = {
                                                        data: [{
                                                            clientId: _this.props.clientId,
                                                            name: _this.props.form.getFieldValue('name'),
                                                            type: _this.props.form.getFieldValue('type'),
                                                            isCheck:parseInt(_this.props.form.getFieldValue('isCheckStr')),
                                                            isCharge:parseInt(_this.props.form.getFieldValue('isChargeStr'))
                                                        }]
                                                    };
                                                    $.ajax({
                                                        type: "POST",
                                                        url: serveUrl + "hsr-client/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                                                        contentType: 'application/json;charset=utf-8',
                                                        data: JSON.stringify(formatData),
                                                        success: function (data) {
                                                            if (data.status == 200) {
                                                                Message.success(data.msg);
                                                                _this.props.handleEditClick();
                                                                _this.props.form.resetFields();
                                                            }else if(data.status == 200){
                                                                Message.error(data.msg);
                                                            }else{
                                                                Message.error(data.msg);
                                                            }
                                                        }
                                                    });
                                                }
                                            })
                                        }}><span>确 定</span></button>
                                </div>
                            </Col>
                        </Row>
                 </div>
            </div>
        )
    }
}

UpdateClient = Form.create()(UpdateClient);

export default UpdateClient;

