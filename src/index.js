import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom"
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore } from "redux"
import lessonReducer from "./redux/reducers/lessonReducer"

const store = createStore(lessonReducer)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

