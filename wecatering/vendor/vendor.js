

// index.js
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import reducer from './reducers/index'
// import reducer from './reducers'
import routes from './modules/routes'

//Grab the state from a global variable injected into the server-generated HTML
/*const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__*/


const store = createStore(reducer,applyMiddleware(thunk))

render(
  <Provider store={store}>
	<Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
)
