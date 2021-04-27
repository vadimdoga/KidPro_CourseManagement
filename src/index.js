import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom"
import 'semantic-ui-css/semantic.min.css'

//redux
import { Provider } from 'react-redux'
import { createStore, combineReducers } from "redux"
import devToolsEnhancer from 'remote-redux-devtools'
import * as actionCreators from './redux/actions/contentActions'
//reducers
import modalReducer from "./redux/reducers/modalReducer"
import contentReducer from "./redux/reducers/contentReducer"

const allReducers = combineReducers({
    content: contentReducer,
    modal: modalReducer
})

const store = createStore(allReducers, devToolsEnhancer({
    name: 'Course Management app', realtime: true,
    secure: false,
    actionCreators
}))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

