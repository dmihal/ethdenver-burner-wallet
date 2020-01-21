import React from 'react';

interface StartButtonProps {
  scrollX: number;
  height: number;
  onClick: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ scrollX, height, onClick }) => {
  return (
    <div style={{cursor:"pointer",position:"absolute",left:scrollX,top:height*1.333,zIndex:999,width:"100%"}} onClick={onClick}>
      <div style={{margin:"0 auto",width:"77%",padding:"5%",backgroundColor:"#EEEEEE",borderRadius:6,borderBottom:"4px solid #9d9d9d"}}>
        <span style={{verticalAlign:"middle",color:"#444444",fontSize:"9vw"}} className="title">
           ⚔️ Start Questing...
        </span>
      </div>
    </div>
  );
};

export default StartButton;
