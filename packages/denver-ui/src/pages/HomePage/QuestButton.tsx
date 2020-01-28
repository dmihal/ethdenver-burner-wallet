import React from 'react';

interface QuestButtonProps {
  location: string;
  color: string;
  task: string;
  xp: number;
}

const QuestButton: React.FC<QuestButtonProps> = ({ location, color, task, xp }) => {
  return (
    <div style={{zIndex:1,cursor:"pointer",width:"80%"}} onClick={()=>{
        alert("click")
    }}>

      <div style={{margin:4,zIndex:1,padding:6,backgroundColor:"#EEEEEE",borderRadius:6,borderBottom:"4px solid #9d9d9d"}}>
        <span style={{verticalAlign:"middle",color:"#444444",fontSize:"26"}} className={"title"}>
        <span style={{paddingRight:10,opacity:0.5}}>+{xp} XP</span>
        <span style={{color:color}}>{location}: </span> {task}</span>
      </div>

    </div>
  );
};

export default QuestButton;
