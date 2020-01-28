import React from 'react';
import xpmeter from "../../images/xpmeter.png"

const OverlayXP: React.FC = () => {
  return (
    <div style={{fontSize:13,color:"#DDDDDD",letterSpacing:-0.1,fontFamily:"'Squada One', Impact, Arial, Helvetica, sans-serif"}}>
      <img src={xpmeter} style={{maxWidth:130,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1}}></img>
      <div style={{position:"absolute",top:28,right:38,textAlign:"right",fontSize:14}}>
        345615
      </div>
    </div>
  );
};

export default OverlayXP;
