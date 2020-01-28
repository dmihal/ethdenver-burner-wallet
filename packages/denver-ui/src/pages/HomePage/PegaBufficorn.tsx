import styled, { keyframes } from 'styled-components';
import pegabuff from '../../images/pegabuff-sprite.png';

const buffiAnimate = keyframes`
  0% { background-position-x: 0px; }
  100% { background-position-x: -576px; }
`

const PegaBufficorn = styled.div.attrs<{ topPos: number, rightPos: number , scale: number}>({
  style: ({ topPos, scale }) => ({
    transform: `translate3d(0, ${topPos}px, 0) scale( ${scale} )`,
  }),
})<{ topPos: number, rightPos: number }>`
  z-index: 255;
  position: absolute;
  right: ${props => props.rightPos}px;
  width:  340px;
  height: 340px;
  padding-bottom: 66.66%;
  background-image: url(${pegabuff});
  background-repeat: no-repeat;
  animation: ${buffiAnimate} 0.15s steps(2) infinite;
`;


export default PegaBufficorn;
