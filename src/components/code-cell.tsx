import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import './code-cell.css';
import { useCummulativeCode } from './use-cummulative-code';
interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cummulativeCode = useCummulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cummulativeCode);
      return;
    }

    const timer = setTimeout(() => {
      createBundle(cell.id, cummulativeCode);
    }, 750);

    // Continuos calling of useEffect will return
    // clearTimeout();
    return () => {
      clearTimeout(timer);
    };
  }, [cummulativeCode, cell.id, createBundle]);

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
