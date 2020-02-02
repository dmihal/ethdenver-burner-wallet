import React from 'react';

interface QuestButtonProps {
  location: string;
  color: string;
  task: string;
  xp: number;
}

const QuestButton: React.FC<QuestButtonProps> = ({ location, color, task, xp, fn }) => {
  return (
    <div style={{zIndex:1,cursor:"pointer",width:"100%",height:60}} onClick={fn}>

      <div style={{whiteSpace:"nowrap",height:60,fontSize:26,margin:6,zIndex:1,padding:6,backgroundColor:color,borderRadius:8,borderBottom:"8px solid #9d9d9d"}}>
        <span style={{paddingLeft:10,verticalAlign:"middle",color:"#EEEEEE",fontSize:"26"}} className={"title"}>
          {task}
          <span style={{paddingLeft:10,opacity:0.5}}>+{xp} XP</span>
        </span>
      </div>

    </div>
  );
};

export default QuestButton;
