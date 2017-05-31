import './products.less'
import AddProducts from './AddProducts'
import UpdateProducts from './UpdateProducts'


import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,Message,Table,Checkbox,Modal,AutoComplete} from 'antd';
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
            productListDateLength:0,
            productListDateCurrent:1,
            productsListDatePageSize:10,
            selectedRowKeys: [],
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            visibleAdd:false,
            visibleUpdate:false,
            addKey:0,
            updateKey:10,
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
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    handleSubmit =(e)=>{
       console.log(e)
       e.preventDefault()
    }
   
     getInitList(page,rows,search){
        const data = [];
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                    //url: serveUrl+"/hsr-product/getProductByHsOrId?access_token="+ User.appendAccessToken().access_token,
                    url: 'http://192.168.0.135:8888'+"/hsr-product/getProductByHsOrId?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        page:page,
                        rows:rows,
                        data:search
                        },
                    success: function(data){
                        console.log(data)
                        data.data.rows.map((v,index)=>{
                            v.key = v.productId
                        })
                        _this.setState({
                            productListDate: data.data.rows,
                            productListDateLength:data.data.total,
                        })
                    }
                });
            }
        });
    }

    //搜索
    searchProduct = () => {
        this.props.form.validateFields((err,val) => {
            if(!err){
                this.getInitList(this.state.productListDateCurrent,this.state.productsListDatePageSize,val.search)
            }
        })
    }

    //获取高铁站
    handleStationChange = (value) => {
        const _this = this
        if(value !== ''){
            getTrainStation(value,(station) => {
                console.log(station)
                if(station){
                    const trainStation = station.map((s) => {
                        return <AutoCompleteOption key={s.no+'&'+s.value}>{s.value}</AutoCompleteOption>;
                    })
                    _this.setState({ trainStation: trainStation})
                }
            })
        }
    }


    //删除确认
    handleOkDel = (record) => {
        const _this = this
        $.ajax({
            type: "POST",
            //url: serveUrl + "/hsr-product/deleteProduct?access_token="+User.appendAccessToken().access_token,
            url: 'http://192.168.0.135:8888' + "/hsr-product/deleteProduct?access_token="+User.appendAccessToken().access_token,
            data:{
                    productId: record.productId
                },      
            success: function (data) {
                if(data.status == 200 ){
                    if(data.data != null){
                        Message.error(data.msg);
                    }else{
                        Message.success(data.msg);
                    }
                }else{
                    Message.error(data.msg);
                }
                _this.getInitList(_this.state.productListDateCurrent,_this.state.productsListDatePageSize)
            }
        });
        
        
    }
    //删除取消
    handleCancelDel = () => {
        
    }
    
    
    //添加产品弹窗
    showAdd = (record) => {
        const _this = this
        this.setState({ visibleAdd:true })
        console.log(record)
        var addKey = this.state.addKey
        this.setState({ addKey:++addKey })
    }
    //添加确认
    handleOk(){
        const _this = this
        this.setState({visibleAdd:false})
    }

    //取消添加
    handleCancel(){
        this.setState({visibleAdd:false})
    }

    //修改产品弹窗
    showUpdate = (record) => {
        const _this = this
        this.setState({ visibleUpdate:true })
        if(!record.dispatchConfig){
            console.log(record)
            var updateKey = this.state.updateKey
            this.setState({ updateKey:++updateKey, handleKey: record.productId,selectedProduct:record })
        }else{
            this.setState({ selectedProduct: {},handleKey:undefined })
        }
    }
    //添加确认
    handleUpdateOk(){
        const _this = this
        this.setState({visibleUpdate:false,selectedProduct: {}})
    }

    //取消添加
    handleUpdateCancel(){
        this.setState({visibleUpdate:false,selectedProduct: {}})
    }

    showTotal(total) {
      return `共 ${total} 条`;
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
                            <span onClick={_this.showUpdate.bind(_this,record)} className='listRefresh'>编辑</span>
                            <Popconfirm title="确认删除?" onConfirm={_this.handleOkDel.bind(_this,record)} onCancel={_this.handleCancelDel.bind(_this)}>
                                <span  style={{marginLeft:4}} className='listCancel'>删除</span>
                            </Popconfirm>
                        </div>
                        )
            }
        }];
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
       const pagination = {
            total: this.state.productListDateLength,
            size:'small',
            showTotal:this.showTotal ,
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
                        <div className='btn-add' style={{marginLeft:'87%'}} onClick={_this.showAdd.bind(_this)}><span>添加休息室</span><img src={require('../../assets/images/add.png')} className='addImg'/></div>
                        <div className="pro-search">

                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col span={6}>
                                        <FormItem
                                            {...formI}
                                            label="休息室代码(或高铁站名称)"
                                        >
                                            {getFieldDecorator('search', {})(
                                                <Input placeholder="请输入休息室代码" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <div className='btn-search' onClick={_this.searchProduct.bind(_this)} ><span>搜索</span><img src={require('../../assets/images/search.png')} className='addImg'/></div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="search-result-list" >
                            <Table style={{marginTop:20}} columns={columns} pagination={pagination} dataSource={_this.state.productListDate}  className="serveTable"/>
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
                 <Modal title="添加"
                     key={this.state.addKey}
                     visible={this.state.visibleAdd}
                     onOk={this.handleOk.bind(this)}
                     onCancel={this.handleCancel.bind(this)}
                 >
                     <AddProducts getInitList={_this.getInitList.bind(_this)} handleCancel={_this.handleCancel.bind(_this)} />
                 </Modal>
                 <Modal title="编辑"
                     key={this.state.updateKey}
                     visible={this.state.visibleUpdate}
                     onOk={this.handleUpdateOk.bind(this)}
                     onCancel={this.handleUpdateCancel.bind(this)}
                 >
                     <UpdateProducts getInitList={_this.getInitList.bind(_this)} handleUpdateCancel={_this.handleUpdateCancel.bind(_this)} selectedProduct={_this.state.selectedProduct} />
                 </Modal>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;