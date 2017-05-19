import './products.less'

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
            sortedInfo:{},
            filteredInfo:{},
            loungeCodeResult:[],
            loungeNameResult:[],
            highSpeedStationResult:[],
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
                code:Math.floor(Math.random()*2017),
                name:`休息室${i}`,
                station:['杭州东站','杭州城战'][Math.floor(Math.random())],
                price:Math.floor(Math.random()*1000),
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
        
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    //编辑员工弹窗
    showAdd = (record) => {
        console.log(record)
        this.setState({visibleAdd:true})
    }
    //增加员工
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
        const { autoCompleteResult } = this.state;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const _this = this;
        const columns = [ {
            title: '休息室代码',
            width: '20%',
            dataIndex: 'code',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '休息室名称',
            width: '20%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '所属高铁站',
            width: '25%',
            dataIndex: 'station',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '零售价格',
            width: '15%',
            dataIndex: 'price',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '20%',
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
      //休息室代码
      const { loungeCodeResult } = this.state;
      const loungeCode = loungeCodeResult.map((code) => {
        return <AutoCompleteOption key={code}>{code}</AutoCompleteOption>;
      });
      //休息室名称
      const { loungeNameResult } = this.state;
      const loungeName = loungeNameResult.map((name) => {
        return <AutoCompleteOption key={name}>{name}</AutoCompleteOption>;
      });
      //高铁站
      const { highSpeedStationResult } = this.state;
      const highSpeedStation = highSpeedStationResult.map((station) => {
        return <AutoCompleteOption key={station}>{station}</AutoCompleteOption>;
      });
       
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>休息室管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Row>
                        <Col>
                            <button className="btn" onClick={this.addClientBtn.bind(this)}>添加休息室</button>
                        </Col>
                        <Col style={{marginLeft:200}}>
                            <Form layout={'inline'}
                                className="ant-advanced-search-form"
                                onSubmit={this.getInitList.bind(this,this.state.partListDateCurrent,this.state.partListDatePageSize)}
                                >
                                <Row>
                                    <Col span={10}>
                                        <FormItem label="客户姓名:" hasFeedback>
                                            {getFieldDecorator('institutionClientName', {
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.AutoClientList}
                                                    placeholder="请输入客户姓名"
                                                    style={{width:170}}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        <button className='btn-small' onClick={this.handleSearch}>查&nbsp;&nbsp;询</button>
                                    </Col>
                                </Row>
                            </Form>
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
                                label="休息室代码"
                            >
                                {getFieldDecorator('code', {
                                    rules: [{ message: '请输入休息室代码!' }],
                                })(
                                    <AutoComplete
                                        dataSource={loungeCode}
                                        // onChange={this.handleWebsiteChange}
                                        placeholder="请输入休息室代码"
                                    >
                                        <Input />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="休息室名称"
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ message: '请输入休息室名称!' }],
                                })(
                                    <AutoComplete
                                        dataSource={loungeName}
                                        // onChange={this.handleWebsiteChange}
                                        placeholder="请输入休息室名称"
                                    >
                                        <Input />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="所属高铁站"
                            >
                                {getFieldDecorator('station', {
                                    rules: [{ message: '请输入高铁站!' }],
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
                            <FormItem
                                {...formI}
                                label={(
                                    <span>零售价格&nbsp;</span>
                                )}
                                hasFeedback
                            >
                                {getFieldDecorator('employeeName', {
                                    rules: [{ message: '请输入零售价格!', whitespace: true }],
                                })(
                                    <Input placeholder="请输入员工姓名" />
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