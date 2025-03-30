import React, { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
   const [innerHeight, setInnerHeight] = useState(Math.floor(window.innerHeight));
   const [innerWidth, setInnerWidth] = useState(Math.floor(window.innerWidth));
   const [width, setWidth] = useState(Math.floor(window.innerWidth * 0.75))
   
    let resizableProps: ResizableBoxProps;

  useEffect(() => {
    let timer: any;
    const listener = () => {
        if(timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            setInnerHeight(Math.floor(window.innerHeight));
            setInnerWidth(Math.floor(window.innerWidth));
            if (Math.floor(window.innerWidth * 0.75) < width) {
                setWidth(Math.floor(window.innerWidth * 0.75));
            }
        }, 200);
    };

    window.addEventListener('resize', listener);

    return () => {
        window.removeEventListener('resize', listener);
    };
  }, []);

  if (direction === 'horizontal') {
    resizableProps = {
      height: Infinity,
      width: Math.floor(width),
      resizeHandles: ['e'],
      minConstraints: [Math.floor(innerWidth * 0.2), Infinity],
      maxConstraints: [Math.floor(innerWidth * 0.75), Infinity],
      className: 'resize-horizontal',
      onResizeStop: (e, data) => {
        setWidth(Math.floor(data.size.width))
      }
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, Math.floor(innerHeight * 0.9)],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
