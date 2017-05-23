import './products.less'

import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData, access_token} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import getTrainStation from '../../utils/station';//引入所属高铁站

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const AutoCompleteOption = AutoComplete.Option;
const msg = '确认删除该产品吗?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productListDate: [],
            productListDateLength:null,
            productListDateCurrent:1,
            productsListDatePageSize:10,
            selectedRowKeys: [],
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            visibleAdd:false,
            addKey:0,
            autoCompleteResult:[],
            sortedInfo:{},
            filteredInfo:{},
            productCodeResult:[],
            nameResult:[],
            trainStation:[],
            handleKey:undefined,
            selectedProduct:{},
        }
    }

     componentWillMount() {
        //  if(User.isLogin()){
        // } else{
        //     hashHistory.push('/login');
        // }
        this.getInitList(this.state.productListDateCurrent,this.state.productsListDatePageSize)
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        //获取产品列表
        // $.ajax({
        //     type: "GET",
        //     //url: serveUrl+"/hsr-product/getProductByHsOrId?access_token="+ User.appendAccessToken().access_token,
        //     url: serveUrl+"/hsr-product/getProductAll?access_token="+ access_token,
        //     success: function(data){
        //         _this.setState({
        //             productListDate: data.data,
        //             productListDateLength:data.data.length,
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
    }
   
     getInitList(page,rows){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    //url: serveUrl+"/hsr-product/getProductAll?access_token="+ User.appendAccessToken().access_token,
                    url: serveUrl+"/hsr-product/getProductAll?access_token="+ access_token,
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
                            productListDate: data.data.rows,
                            productListDateLength:data.data.total
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
        console.log(record)
        this.setState({ visibleDel: true, handleKey: record.productId });
    }
    //删除确认
    handleOkDel = () => {
        const _this = this
        // $.ajax({
        //     type: "POST",
        //     contentType: 'application/json;charset=utf-8',
        //     url: serveUrl + "/hsr-product/deleteProduct?access_token="+User.appendAccessToken().access_token,
        //      data:JSON.stringify({ 
        //          data: {
        //                  productId: _this.state.handleKey
        //              }
        //          }),      
        //     success: function (data) {
        //         if(data.status == 200 ){
        //             if(data.data != null){
        //                 message.error(data.data);
        //             }else{
        //                 message.success(data.msg);
        //                 this.setState({
        //                     visibleDel: false
        //                 });
        //             }
        //         }else{
        //             message.error(data.msg);
        //         }
        //         _this.getInitList(_this.state.productListDateCurrent,_this.state.productsListDatePageSize)
        //     }
        // });
        
        
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    //编辑产品弹窗
    showAdd = (record) => {
        this.setState({ visibleAdd:true })
        if(!record.dispatchConfig){
            console.log(record)
            var product 
            var addKey = this.state.addKey
            this.state.productListDate.map((v,i) => {
                if(v.productId == record.productId){
                    product = v
                }
            })
            this.props.form.setFieldsValue({
                productCode:product.productCode,
                name:product.name,
                trainStation:product.trainStation,
                price:product.price,
            })
            
            console.log(product)
            this.setState({ selectedProduct: product, addKey:++addKey, handleKey: record.productId })
            // $.ajax({
            //     type: "GET",
            //     contentType: 'application/json;charset=utf-8',
            //     url: serveUrl + "/hsr-product/getProductById?access_token="+User.appendAccessToken().access_token,
            //     data:JSON.stringify({
            //             productId: record.productId
            //          }),
            //     success: function (data) {
            //         if(data.status == 200 ){
            //             if(data.data != null){
            //                 message.error(data.msg);
            //             }else{
            //                 message.success(data.msg);
            //                 _this.props.form.setFieldsValue({
            //                      productCode:data.data.productCode,
            //                      name:data.data.name,
            //                      trainStation:data.data.trainStation,
            //                      price:data.data.price,
            //                 })
            //                 this.setState({ selectedProduct: data.data })
            //             }
            //         }else{
            //             message.error(data.msg);
            //         }
            //     }
            // });
        }else{
            this.setState({ selectedProduct: {} })
        }
    }

    //添加/修改确认
    handleOk(){
        const _this = this
        const dtd = $.Deferred()
        var trainStation, arr = [], product
        this.props.form.validateFields((err, values) => {
            if(!err){
                const setData = (dtd) => {
                        console.log(values)
                        trainStation = this.state.trainStation
                        product = this.state.selectedProduct
                        arr = Object.keys(product)
                        trainStation.map((v,i) => {
                            if(v.value == values.trainStation){
                                values.trainStationId = v.trainStationId
                            }
                        }) 
                        product = $.extend(product,values)
                        console.log(product)
                        dtd.reject()
                        return dtd
                }
                $.when(setData(dtd)).
                    done(
                    $.ajax({
                        type: "POST",
                        contentType: 'application/json;charset=utf-8',
                        url: serveUrl + "/hsr-product/updateProduct?access_token="+User.appendAccessToken().access_token,
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
                            _this.getInitList(_this.state.productListDateCurrent,_this.state.productsListDatePageSize)
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
        const { autoCompleteResult } = this.state;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const _this = this;
        const columns = [ {
            title: '休息室代码',
            width: '20%',
            dataIndex: 'productCode',
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
            dataIndex: 'trainStation',
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
            total: this.state.productListDateLength,
            onShowSizeChange(current, pageSize) {
                _this.state.productListDateCurrent = current;
                _this.state.productsListDatePageSize = pageSize;
                _this.getInitList(_this.state.productListDateCurrent,_this.state.productsListDatePageSize);
            },
            onChange(current) {
                _this.state.productListDateCurrent = current;
                _this.getInitList(_this.state.productListDateCurrent,_this.state.productsListDatePageSize);
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
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>休息室管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    
                    <Row>
                        <Col>
                            <button className="btn" onClick={_this.showAdd.bind(_this)}>添加休息室</button>
                        </Col>
                        
                        <div className="search-result-list" >
                            <p style={{marginTop: 20}}>共搜索到{this.state.productListDateLength}条数据</p>
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={this.state.productListDate}  className="serveTable"/>
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
                     key={this.state.addKey}
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
                                {getFieldDecorator('productCode', {
                                    rules: [{ required: true, message: '请输入休息室代码!' }],
                                })(
                                    <Input placeholder="请输入休息室代码" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="休息室名称"
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入休息室名称!' }],
                                })(
                                    <Input placeholder="请输入休息室名称" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formI}
                                label="所属高铁站"
                            >
                                {getFieldDecorator('trainStation', {
                                    rules: [{ required: true, message: '请输入高铁站!' }],
                                })(
                                    <AutoComplete
                                        dataSource={this.state.trainStation}
                                        onChange={this.handleStationChange}
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
                            >
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: '请输入零售价格!', pattern: /\d+/g }],
                                })(
                                    <Input placeholder="请输入零售价格" />
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