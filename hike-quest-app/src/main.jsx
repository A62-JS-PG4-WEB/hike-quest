import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * The entry point of the React application.
 * This file is responsible for rendering the root component (`App`) into the DOM.
 * 
 * @function
 * @description
 * Creates a root React element and renders the `App` component inside the `root` DOM element.
 * The `React.StrictMode` component is used to highlight potential problems in the application.
 * 
 * @returns {void}
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
