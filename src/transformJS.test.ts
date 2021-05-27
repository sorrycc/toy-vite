import { transformJS } from './transformJS';

const { code } = transformJS({
  appRoot: '/private/tmp/sorrycc-RgKRFo/vite-project',
  path: '/src/main.tsx',
  code: `
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
  `,
});

console.log(code);
