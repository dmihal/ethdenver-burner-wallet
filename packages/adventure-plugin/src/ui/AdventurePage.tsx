import React from 'react';
import styled from 'styled-components';
import { PluginPageContext } from '@burner-wallet/types';
const controls = require('../../assets/controls.png');
const map = require('../../assets/map.png');
const points = require('../../assets/points.png');

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Points = styled.div`
  background-image: url('${points}');
  background-size: contain;
  background-position: right top;
  background-repeat: no-repeat;

  width: 50vw;
  position: absolute;
  top: 10px;
  right: 10px;
  height: 8vh;
`;

const Controls = styled.div`
  background-image: url('${controls}');
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;

  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MapContainer = styled.div`
  overflow-y: scroll;
  height: 100%;
`;

const Map = styled.img`
  height: 100%;
`;

const Back = styled.div`
  top: 20px;
  left: 20px;
  font-size: 24px;
  position: absolute;
`;


const AdventurePage: React.FC<PluginPageContext> = ({ actions }) => {
  return (
    <Container>
      <MapContainer>
        <Map src={map} />
      </MapContainer>
      <Back onClick={() => actions.navigateTo('/')}>{'\u2B05'}</Back>
      <Points />
      <Controls />
    </Container>
  );
};

export default AdventurePage;
