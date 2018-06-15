// modules/routes.js
import React from 'react'

// import { Route} from 'react-router'
import Route from 'react-router/lib/Route';

import { connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import App from './App'
import Home from './Home'
import reducer from '../reducers/index'

const store = createStore(reducer,applyMiddleware(thunk))
//注意匹配顺序，固定匹配放置在最前
const routes = (
    <Route path="/p" component={App}>
	    <Route path="/p/:id/:t" component={Home}/>
    </Route>
)
export default routes
