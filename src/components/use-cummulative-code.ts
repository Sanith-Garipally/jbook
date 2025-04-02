import { useTypedSelector } from '../hooks/use-typed-selector';

export const useCummulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;
        const orderedCells = order.map((id) => data[id]);
    
        const showFunc =       `
        import _React from 'react';
        import _ReactDOM from 'react-dom/client';
    
        var show = (value) => {
          const root = document.querySelector('#root');
          if(typeof value === 'object') {
            if(value.$$typeof && value.props) {
              _ReactDOM.createRoot(root).render(value);
            } else {
              root.innerHTML = JSON.stringify(value);
             } 
          } else { 
            root.innerHTML = value
          }
        }
      `;
        const showFuncNoOperation = 'var show = () => {}';
        const priorCodeCells = [];
    
        for (let c of orderedCells) {
          if (c.type === 'code') {
             if (c.id === cellId) {
              priorCodeCells.push(showFunc);
             } else {
              priorCodeCells.push(showFuncNoOperation);
             }
            priorCodeCells.push(c.content);
          };
    
          if (c.id === cellId) {
            break;
          }
        }
    
        return priorCodeCells.join('\n')
    
      })
}