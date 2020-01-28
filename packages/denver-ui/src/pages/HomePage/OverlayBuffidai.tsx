import React from 'react';
import valuehud from "../../images/valuehud.png"

const OverlayBuffidai = () => {
  return (
    <div style={{fontSize:13,color:"#DDDDDD",letterSpacing:-0.1,fontFamily:"'Squada One', Impact, Arial, Helvetica, sans-serif"}}>
      <img src={valuehud} style={{maxWidth:130,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1}}></img>
      <div style={{position:"absolute",top:15,right:72,textAlign:"right",fontSize:16}}>
        $100.00
      </div>
    </div>
  )
}

export default OverlayBuffidai;