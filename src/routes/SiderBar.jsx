import React from 'react';
import { hashHistory } from 'react-router';
import { Link} from 'react-router'
import { Menu, Icon, Switch } from 'antd';
import { serveUrl, User, cacheData,getCookie} from '../utils/config';
import $ from 'jquery';
const SubMenu = Menu.SubMenu;

const ACTIVE = { color: 'red' };

class SiderBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '1',
            roleId: '',
            username:undefined,
            status:true,
            siderBar:[],
            totalTitle:'订单管理',
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    componentWillMount() {
        
        // if (User.isLogin()) {
            
        // } else {
        //     hashHistory.push('/login');
        // }
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+"/hsr-role/getMenuByRoleId",
            beforeSend:() => {
                    _this.setState({
                        username:cacheData.get('username'),
                        roleId:cacheData.get('roleId'), 
                    })
                },
            data:{roleId:_this.state.roleId},
            success: function(data){
                _this.setState({
                    siderBar:data.data
                })
            }
        })
    }

    isLogin(){
        return false
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = () => {
        this.setState({
            username: 'renzhao'
        })
    }

    render() {
        return (
            <div>
                <div id="leftMenu">
                    <img src={require('../assets/images/logo.png')} width="50" id="logo"/>
                    <Menu theme="dark"
                        onClick={this.handleClick}
                        style={{ width: 185 }}
                        defaultOpenKeys={['sub1', 'sub2']}
                        defaultSelectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <Menu.Item key="1"><Link to="/order">订单管理</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/serviceBillings">服务账单</Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/system">系统管理</Link></Menu.Item>
                        <Menu.Item key="4"><Link to="/employeeList">员工管理</Link></Menu.Item>
                        <Menu.Item key="5"><Link to="/clientManagement">客户管理</Link></Menu.Item>
                        <Menu.Item key="6"><Link to="/products">产品管理</Link></Menu.Item>
                    </Menu>
                </div>
                <div id="rightWrap">
                    <Menu mode="horizontal">
                        <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>
                            <Menu.Item key="setting:1">退出</Menu.Item>
                        </SubMenu>
                        <SubMenu title={<Link to="/reg">注册</Link>}>
                        </SubMenu>
                        <SubMenu title={<Link to="/login">登录</Link>}>
                        </SubMenu>
                    </Menu>
                    <div className="right-box">
                        { this.props.children }
                    </div>
                </div>
            </div>
        )
    }
}
export default SiderBar;
