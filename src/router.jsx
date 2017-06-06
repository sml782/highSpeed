import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// 引入主路由
import SiderBar from './routes/SiderBar';

//登录模块
import Login from './routes/login/Login'

//订单管理
import OrderList from './routes/order/OrderList'
import AddAppointment from './routes/order/AddAppointment'
import UpdateAppointment from './routes/order/UpdateAppiontment'

//服务账单
import ServiceBillings from './routes/serviceBillings/ServiceBillings'

//系统管理
import System from './routes/system/System'
//角色管理
//import AddPart from './routes/part/AddPart'
import AddPart from './routes/part/Addpart-1'
import EditPart from './routes/part/Editpart'
//菜单管理

//添加订单
import AddMenu from './routes/menu/AddMenu'

//员工管理
import EmployeeList from './routes/employee/EmployeeList'

//客户管理
import Client from './routes/clientmanagement/Client'

//产品管理
import Products from './routes/products/Products'

export default (
    <Router history={hashHistory}>
        <Route path="/" component={SiderBar}>
            <IndexRoute component={OrderList} />
            <Route path="order" component={OrderList} />
            <Route path="addAppointment" component={AddAppointment} />
            <Route path="updateAppointment(/:orderId)" component={UpdateAppointment} />
            <Route path="serviceBillings" component={ServiceBillings} />

            <Route path="system" component={System} />
            <Route path="editPart(/:roleId)" component={EditPart} />
            <Route path="addPart" component={AddPart} />
            <Route path="addMenu" component={AddMenu} />

            <Route path="employeeList" component={EmployeeList} />

            <Route path="clientmanagement" component={Client} />

            <Route path="products" component={Products} />
        </Route>
        <Route path="/login" component={Login} />
    </Router>
)

