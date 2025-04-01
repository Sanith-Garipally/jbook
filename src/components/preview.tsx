import React, { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  err: string
}

const html = `
<html>
  <head>
    <style>html{background-color: white}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
        const handleError = (err) => {
        const rootEle = document.querySelector('#root');
            rootEle.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>';
        }

        // Uncaught Errors
        window.addEventListener('error', (e) => {
        handleError(e.error);
        }
        )

        window.addEventListener('message', (e) => {
          try{
            eval(e.data);
          } catch(err){
            handleError(err);
          }
        }, false);
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<any>();

  // useEffect(() => {
  //   // iframeRef.current.srcdoc = html;
  // }, [code]);

  const loadHandler = () => {
    // Emitting the Event with postMessage to iframe
    iframeRef.current.contentWindow.postMessage(code, '*');
  };

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        sandbox='allow-scripts'
        ref={iframeRef}
        srcDoc={html}
        onLoad={loadHandler}
      />
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default React.memo(Preview);
