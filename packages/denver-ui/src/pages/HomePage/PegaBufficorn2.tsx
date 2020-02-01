import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import pegabuff from '../../images/pegabufficorn.png';
import pegabuff2 from '../../images/pegabufficorn2.png';

const SPEED = 4;

const BufficornContainer = styled.div.attrs<{ left: number; top: number; }>(({ left, top }) => ({
  style: {
    transform: `translate3d(${left}px, ${top}px, 0)`,
  },
}))<{ left: number; top: number; }>`
  z-index: 25;
  position: absolute;
  right: 0;
`;

const buffiAnimate = keyframes`
  49% { opacity: 0%; }
  50% { opacity: 100%; }
`;

const Image = styled.img.attrs<{ hide?: boolean }>(({ hide }) => ({
  style: {
    opacity: hide ? '0' : '1',
  },
}))<{ hide?: boolean }>`
  z-index: 25;
  position: absolute;
  right: 0;
`;

interface BuffiProps {
  top: number;
  left: number;
  ref: React.Ref<HTMLDivElement>;
}

const PegaBufficorn2: React.FC<BuffiProps> = React.forwardRef(({ top, left }, ref: React.RefObject<HTMLDivElement>) => {
  const img1 = useRef();
  const img2 = useRef();
  const stepNum = useRef(0);

  useEffect(() => {
    let animationRequest;
    const step = () => {
      stepNum.current += 1;
      if (stepNum.current % SPEED !== 0) {
        animationRequest = window.requestAnimationFrame(step);
        return;
      }

      if (img1.current) {
        // @ts-ignore
        // console.log(img1.current.style.opacity, img2.current.style.opacity)
        // @ts-ignore
        img1.current.style.opacity = img1.current.style.opacity == '1' ? 0 : 1;
      }
      if (img2.current) {
        // @ts-ignore
        img2.current.style.opacity = img1.current.style.opacity == '1' ? 0 : 1;
      }
      animationRequest = window.requestAnimationFrame(step);
    };

    animationRequest = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationRequest);
    };
  }, []);

  return (
    <BufficornContainer ref={ref} top={top} left={left}>
      <Image src={pegabuff} ref={img1} />
      <Image src={pegabuff2} ref={img2} hide />
    </BufficornContainer>
  )
});

export default PegaBufficorn2;
