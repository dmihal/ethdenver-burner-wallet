import styled, { keyframes } from 'styled-components';
import pegabuff from '../../images/pegabuff-sprite.png';

const buffiAnimate = keyframes`
  0% { background-position-x: 0px; }
  100% { background-position-x: -576px; }
`

const PegaBufficorn = styled.div.attrs<{ topPos: number, rightPos: number }>({
  style: ({ topPos }) => ({
    transform: `translate3d(0, ${topPos}px, 0)`,
  }),
})<{ topPos: number, rightPos: number }>`
  z-index: 255;
  position: absolute;
  right: ${props => props.rightPos}px;
  width: 350px;
  padding-bottom: 66.66%;
  background-image: url(${pegabuff});
  background-repeat: no-repeat;
  animation: ${buffiAnimate} 0.25s steps(2) infinite;
`;

export default PegaBufficorn;
