import React from 'react';

interface LayerProps {
  index: number;
  img: string;
  width: number;
  left: number;
  top: number;
  perspective?: number;
  opacity?: number;
  scaleY?: number;
  brightness?: number;
  ref?: React.Ref<HTMLDivElement>;
}

const Layer: React.FC<LayerProps> = React.forwardRef(({
  index, img, width, left, top, perspective=0, opacity = 0.99, scaleY = 1.0, brightness = 100, children
}, ref) => {
  const _opacity = opacity >= 1 ? 0.99 : opacity;

  const transform = `perspective( ${perspective}px ) rotateX( -5deg ) scaleY( ${scaleY} ) `;

  return (
    <div ref={ref} style={{
      zIndex: index,
      position: 'absolute',
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: _opacity,
    }}>
      <img
        src={img}
        style={{
          filter: `brightness(${brightness}%)`,
          transform,
          WebkitTransform: transform,
          width: Math.floor(width)
        }}
      />
      {children}
    </div>
  );
});

export default Layer
