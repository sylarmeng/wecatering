// modules/routes.js
import React from 'react'
import { Route, IndexRoute,Redirect} from 'react-router'
// import { connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import App from './App'
import Signin from './Signin'

import Admin from './Admin'
import Sale from './comp/sale'
import Checked from './comp/checked'
import Recipe from './comp/recipe'
// import Report from './comp/report'
import Canteen from './comp/canteen'
import Order from './comp/order'

import RequireAuth from './auth/require_auth';
import reducer from '../reducers/index'
const store = createStore(reducer,applyMiddleware(thunk))


// import Report from './comp/test'
const report = (location, cb) => {
    require.ensure([], require => {
    	cb(null, require('./comp/report').default)
    }, 'report')
}

// return cb(null, require.include('./comp/test').default)
//注意匹配顺序，固定匹配放置在最前
const routes = (
    <Route path="/shop" component={App}>
    	<IndexRoute component={Signin}/>
	    <Route path="/shop/signin" component={Signin}/>
	    
		<Route path="/shop/admin" component={RequireAuth(Admin)}>
			<IndexRoute component={Sale}/>
			<Route path="/shop/admin/checked" component={Checked}/>
	        <Route path="/shop/admin/recipe" component={Recipe}/>
	        <Route path="/shop/admin/canteen" component={Canteen}/>
	        <Route path="/shop/admin/report" getComponent={report}/>
	        <Route path="/shop/admin/order" component={Order}/>
	    </Route>
	    <Redirect from="/shop*" to="/shop/signin"/>
    </Route>
)
export default routes



/*const routes = (
    <Route path="/shop" component={App}>
    	<IndexRoute component={Signin}/>
	    <Route path="/shop/signin" component={Signin}/>
	    
		<Route path="/shop/admin" component={RequireAuth(Admin)}>
			<IndexRoute component={Sale}/>
			<Route path="/shop/admin/checked" component={Checked}/>
	        <Route path="/shop/admin/recipe" component={Recipe}/>
	        <Route path="/shop/admin/canteen" component={Canteen}/>
	        <Route path="/shop/admin/report" component={Report}/>
	    </Route>
	    <Redirect from="/shop*" to="/shop/signin"/>
    </Route>
)
export default routes*/
 