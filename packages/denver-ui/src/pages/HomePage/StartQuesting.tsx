import React, { useRef, useEffect } from 'react';
import startquesting from "../../images/startquesting.png"
import startquesting2 from "../../images/startquesting2.png"

const SPEED = 10;

const StartQuesting: React.FC<{ opacity: number }> = ({ opacity }) => {
  const imgRef = useRef();
  const stepCount = useRef(0);

  useEffect(() => {
    let animationRequest;
    const step = () => {
      stepCount.current += 1;
      if (stepCount.current % SPEED === 0 && imgRef.current) {
        // @ts-ignore
        imgRef.current.src = imgRef.current.src === startquesting ? startquesting2 : startquesting;
      }
      animationRequest = window.requestAnimationFrame(step);
    };
    animationRequest = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationRequest);
    };
  }, []);

  return (
    <div style={{ opacity, width:"100%",position:"fixed",bottom:0,left:0,fontSize:13,color:"#DDDDDD",letterSpacing:-1,fontFamily:"'Squada One', Impact, Arial, Helvetica, sans-serif"}}>
      <img
        src={startquesting}
        style={{width:"100%",filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1}}
        ref={imgRef}
      />
      <div style={{position:"absolute",width:"100%",bottom:14,textAlign:"center",fontSize:16}}>
        START QUESTING
      </div>
    </div>
  )
}

export default StartQuesting;