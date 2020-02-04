import React from 'react';

interface QuestInfoProps {
  location: string;
  color: string;
  task: string;
  xp: number;
}

const QuestInfo: React.FC<QuestInfoProps> = ({ location, color, task, xp }) => {
  return (
    <div style={{zIndex:1,width:"100%"}}>

      <div style={{margin:4,zIndex:1,padding:6,backgroundColor:"#EEEEEE"}}>
        <span style={{verticalAlign:"middle",color:"#444444",fontSize:"26"}} className={"title"}>
        <span style={{paddingRight:10,opacity:0.5}}>+{xp} XP</span>
        <span style={{color:color}}>{location}: </span> {task}</span>
      </div>

    </div>
  );
};

export default QuestInfo;
