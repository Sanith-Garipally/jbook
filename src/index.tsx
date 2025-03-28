import ReactDOM from "react-dom/client";
import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from "./plugins/fetch-plugin";
const el = document.getElementById("root");

const root = ReactDOM.createRoot(el!);

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const ref = useRef<any>();
  const iframeRef = useRef<any>();

  useEffect(() => {
    startService();
  }, []);

  const startService = async() => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  }

  const onClick = async() => {
    if (!ref.current) {
      return;
    }
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015'
    // });
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'window'
      }
    });
    // setCode(result.outputFiles[0].text);
    // Emitting the Event with postMessage to iframe
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (e) => {
              eval(e.data);
            }, false);
        </script>
      </body>
    </html>
  `

  return <div>
    <textarea value={input} onChange={(e) => {
      setInput(e.target.value);
    }}/>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
    <iframe sandbox='allow-scripts' ref={iframeRef} srcDoc={html}/>
  </div>;
};

root.render(<App />);
