import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import './code-cell.css';
interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cummulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const priorCodeCells = [
      `
        const show = (value) => {
          const root = document.querySelector('#root');
          if(typeof value === 'object') {
            if(value.$$typeof && value.props) {
              ReactDOM.createRoot(root).render(value);
            } else {
              root.innerHTML = JSON.stringify(value);
             } 
          } else { 
            root.innerHTML = value
          }
        }
      `
    ];

    for (let c of orderedCells) {
      if (c.type === 'code') {
        priorCodeCells.push(c.content);
      };

      if (c.id === cell.id) {
        break;
      }
    }

    return priorCodeCells

  })

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cummulativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(() => {
      createBundle(cell.id, cummulativeCode.join('\n'));
    }, 750);

    // Continuos calling of useEffect will return
    // clearTimeout();
    return () => {
      clearTimeout(timer);
    };
  }, [cummulativeCode.join('\n'), cell.id, createBundle]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {/* <div>
                <button onClick={onClick}>Submit</button>
            </div> */}

        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
