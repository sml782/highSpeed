import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// 引入主路由
import SiderBar from './routes/SiderBar';

// 引入单个页面（包括嵌套的子页面）
import Card from './routes/Card';
import Table from './routes/Table';
import Form from './routes/Form';
import Chart from './routes/Chart';
import Calendar from './routes/Calendar';
import Follow from './routes/Follow';
import Mofang from './routes/Mofang';
import Login from './routes/Login';
import Reg from './routes/Reg';

//订单管理
import Order from './routes/order/Order'
import AddAppointment from './routes/order/AddAppointment'

//服务账单
import ServiceBillings from './routes/serviceBillings/ServiceBillings'

//系统管理


//员工管理
import EmployeeList from './routes/employee/EmployeeList'
import UpdataEmployee from './routes/employee/UpdataEmployee'
import AddEmployee from './routes/employee/AddEmployee'

export default (
    <Router history={hashHistory}>
        <Route path="/" component={SiderBar}>
            <IndexRoute component={Order} />
            <Route path="order" component={Order} />
            <Route path="addAppointment" component={AddAppointment} />
            <Route path="serviceBillings" component={ServiceBillings} />

            <Route path="employeeList" component={EmployeeList} />
            <Route path="updataEmployee(/:id)" component={UpdataEmployee} />
            <Route path="addEmployee(/:id)" component={AddEmployee} />
            
            <Route path="/login" component={Login} />
            <Route path="/reg" component={Reg} />
            <Route path="/mofang" component={Mofang} />
            <Route path="/card" component={Card} />
            <Route path="/table" component={Table} />
            <Route path="/form" component={Form} />
            <Route path="/chart" component={Chart} />
            <Route path="calendar" component={Calendar} />
            <Route path="follow" component={Follow} />
        </Route>
    </Router>
)

