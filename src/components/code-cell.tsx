import { useEffect, useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [err, setErr] = useState('')
  const [code, setCode] = useState('');

  useEffect(() => {
    let timer:any;
    if (input) {
        timer = setTimeout(async () => {
        const bundledCode = await bundle(input);
        setCode(bundledCode.code);
        setErr(bundledCode.err);
      }, 1000);
    };

    // Continuos calling of useEffect will return
    // clearTimeout();
    return() => {
        clearTimeout(timer);
    }
  }, [input]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='console.log("hi")'
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        {/* <div>
                <button onClick={onClick}>Submit</button>
            </div> */}
        <Preview code={code} err={err}/>
      </div>
    </Resizable>
  );
};

export default CodeCell;
