// 应用入口
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App'

ReactDOM.render(React.createElement(App), document.getElementById('root'));

// @ts-ignore
// if (module.hot) {
//   // @ts-ignore
//   module.hot.accept(() => {});
// }