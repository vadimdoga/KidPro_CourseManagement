import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom"
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from "redux"
import lessonReducer from "./redux/reducers/lessonReducer"
import modalReducer from "./redux/reducers/modalReducer"

const allReducers = combineReducers({
    lessons: lessonReducer,
    isModalOpen: modalReducer
})

const store = createStore(allReducers)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

