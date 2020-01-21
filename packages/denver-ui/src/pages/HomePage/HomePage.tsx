import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';

import profile from "../../images/profile.png"
import xpmeter from "../../images/xpmeter.png"
import valuehud from "../../images/valuehud.png"
import qrscan from "../../images/qrscan.png";

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

const Container = styled.div`
  background-color: #000000;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const UIBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  z-index: 999;
`;

const ScanButton = styled.button`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  box-shadow: 0px 0px 4px #222222;
  background-image: url(${qrscan}), linear-gradient(#b75fac, #a24c97);
  margin: 0 auto;
  display: block;
  background-size: 90%;
  background-position: center;
`;

const HomePage: React.FC = () => {
  return (
    <Container>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"absolute",top:15,right:0}}>
        <img src={profile} style={{maxWidth:180}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"absolute",top:69,right:0}}>
        <img src={xpmeter} style={{maxWidth:130}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"absolute",top:10,left:0}}>
        <img src={valuehud} style={{maxWidth:130}}></img>
      </div>

      <UIBar>
        <ScanButton />
      </UIBar>

      <ScrollingGame />
    </Container>
  );
}

export default HomePage;
