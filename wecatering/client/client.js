// client.js
import React from 'react'
import { render } from 'react-dom'

// import { Router, browserHistory } from 'react-router'
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import reducer from './reducers/index'
// import reducer from './reducers'
import routes from './modules/routes'



const store = createStore(reducer,applyMiddleware(thunk))

render(
  <Provider store={store}>
	<Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
)
