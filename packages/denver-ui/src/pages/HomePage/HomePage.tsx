import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';

import ScrollingGame from './ScrollingGame';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        // @ts-ignore
        Math.min(900, window.clientWidth || window.innerWidth),
        // @ts-ignore
        window.clientHeight || window.innerHeight
      ]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}


const HomePage: React.FC = () => {
  return (
    <ScrollingGame />
  );
}

export default HomePage;
