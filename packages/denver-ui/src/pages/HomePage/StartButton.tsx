import React from 'react';
import styled from 'styled-components';

const Container = styled.div.attrs<{ leftPos: number, height: number }>({
  style: ({ leftPos }) => ({
    transform: `translate3d(${leftPos}px, 0, 0)`,
  }),
})<{ leftPos: number, height: number }>`
  cursor: pointer;
  position: absolute;
  z-index: 999;
  top: ${({ height }) => height * 1.333}px;
`;

interface StartButtonProps {
  scrollX: number;
  height: number;
  onClick: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ scrollX, height, onClick }) => {
  return (
    <Container leftPos={scrollX} height={height} onClick={onClick}>
      <div style={{margin:"0 auto",width:"77%",padding:"5%",backgroundColor:"#EEEEEE",borderRadius:6,borderBottom:"4px solid #9d9d9d"}}>
        <span style={{verticalAlign:"middle",color:"#444444",fontSize:"9vw"}} className="title">
           ⚔️ Start Questing...
        </span>
      </div>
    </Container>
  );
};

export default StartButton;
