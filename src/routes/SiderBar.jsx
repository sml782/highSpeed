import React from 'react';
import { hashHistory } from 'react-router';
import { Link} from 'react-router'
import { Menu, Icon, Switch } from 'antd';
import { serveUrl, User, cacheData,getCookie,access_token} from '../utils/config';
import $ from 'jquery';
const SubMenu = Menu.SubMenu;

const ACTIVE = { color: 'red' };

class SiderBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '1',
            roleId: 1,
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
            url: serveUrl+"/hsr-role/getMenuByRoleId?access_token="+ User.appendAccessToken().access_token,
            data:{roleId:'1'},
            success: function(data){
                _this.setState({
                    siderBar:data.data
                })
            }
        })
    }

    componentDidMount(){
        
    }

    isLogin(){
        return false
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = () => {
        this.setState({
            username: '宣灵杰'
        })
    }

    render() {
        const MenuOption=this.state.siderBar.map((v,index)=>{
            return(<Menu.Item key={index}><Link to={v.url}><img src={require('../assets/images/'+v.type+'')} className='imgList'/><span style={{marginTop:-5}}>{v.name}</span></Link></Menu.Item>)
        })
        return (
            <div>
                <div id="leftMenu">
                    <div id='leftMenu-top'>
                        <img src={require('../assets/images/logo.png')} width="50" height="50" id="logo"/>
                    </div>
                    <Menu theme="dark"
                        onClick={this.handleClick}
                        style={{ width: 185 }}
                        defaultOpenKeys={['sub1', 'sub2']}
                        defaultSelectedKeys={[this.state.current]}
                        mode="inline"
                    >
                       {MenuOption}
                    </Menu>
                </div>
                <div id="rightWrap">
                    <Menu mode="horizontal">
                        <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>
                            <Menu.Item key="setting:1" id='logout'><img className='logoutList' src={require('../assets/images/logout.png')}/><span id='logoutWord'>退出登录</span></Menu.Item>
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
