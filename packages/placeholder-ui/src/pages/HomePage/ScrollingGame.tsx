import React, { useState, useEffect, useRef, useLayoutEffect, Fragment } from 'react';
import styled from 'styled-components';
import useDimensions from 'react-use-dimensions';

import Layer from './Layer';

import cityFull from "../../images/cityFull.png"
import stars from "../../images/stars.png"
import trees from "../../images/trees.png"

import mountainsFiles from '../../images/mountains';

const MAXWIDTH = 500;//put this *2 in Template.tsx   max-width

const SHOWOWOCKI = false
const SHOWBOUNTIES = false

const SHOWHUD = true

const HEIGHT_TO_EXPLODE_AT = 0.3

const Scrollable = styled.div`
  overflow: scroll;
  flex: 1;
  position: relative;
`;
const Fixed = styled.div`
  margin: 0 auto;
  position: fixed;
  overflow: hidden;
`;

const ButtonBox = styled.div.attrs<{ boxWidth: number }>(({ boxWidth }) => ({
  style: {
    left: boxWidth * 1.1 + 'px',
    height: boxWidth * 0.9 + 'px',
    width:"100%"
  },
}))<{ boxWidth: number }>`
  z-index: 999;
  position: absolute;
  top: 0;
  height: 60%;
  margin-top: 10%;
`;

const Sky = styled.div.attrs<{ topPos: number }>(({ topPos }) => ({
  style: { transform: `translate3d(0, ${topPos}px, 0)` },
}))<{ topPos: number }>`
  background-image: linear-gradient(to bottom, #0a1411 0%,#372e56 20%,#df5089 100%);
  background-color: #FFFFFF;
  width: 100%;
  height: 85vh;
  position: absolute;

  &:after {
    content: '';
    background-image: url('${stars}');
    display: block;
    height: 100%;
  }
`;

const Title = styled.div.attrs<{ topPos: number }>(({ topPos }) => ({
  style: { transform: `translate3d(0, ${topPos}px, 0) scaleY(2) scaleX(0.85)` },
}))<{ topPos: number }>`
  color: #efefef;
  width: 100%;
  position: fixed;
  left: 0;
  overflow: hidden;
  transform-origin: top center;
  font-family: 'Squada One', Impact, Arial, Helvetica, sans-serif;
  line-height: 0.777;
  padding: 4px;
  text-align: center;
  z-index: 100;
`;

const Content = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
  z-index: 110;
`;

const rangePercent = (percent, finish, start) => ((start - finish) * (percent / 100)) + finish;

const ScrollingGame: React.FC = ({ children }) => {
  const [exploded, setExploded] = useState(false);
  let [containerRef, { height, width, }] = useDimensions();
  height = height || window.innerHeight;
  width = width || window.innerWidth;

  let displayWidth = width
  width = Math.min(MAXWIDTH,width)
  console.log({ height, width });

  const screenRatio = 7/1
  const overScrollToMakeFloorsAtTheTopShowUpBetter = 1.25

  const positionVars = useRef<any>({
    scrollX: 0,
    scrollY: 0,
    scrollPercent: 0,

    coverMax: 10000,
    layerWidth: width * 2,
    layerScale: 2,
    fullLayerWidth: Math.min(displayWidth * 2, 1200),

    bufficornLeft: 0,
    bufficornTop: 0,

    skyPos: -height * 0.3,
    mountainsTop: 0,
    mountainLeft: 0,
    underMountainOpacity: 1,
    mountainFullOpacity: 1,
    mountainOverOpacity: 1,

    foothillsLeft: 0,
    foothillsTop: 0,
    foothillWidth: width,
    cityLeft: 0,
    cityTop: 0,
    cityOffset: 0,
    cityDistance: 0,
    treesLeft: 0,
    treesTop: 0,
  });

  const updatePosition = (scrollX: number, scrollY: number) => {
    positionVars.current.scrollX = scrollX;
    positionVars.current.scrollY = scrollY;

    const scrollPercent = Math.min(Math.max(Math.floor(scrollY / height / screenRatio * 100 * overScrollToMakeFloorsAtTheTopShowUpBetter), 0), 100);
    positionVars.current.scrollPercent = scrollPercent;
    positionVars.current.coverMax = rangePercent(scrollPercent, height*0.8, -height);

    positionVars.current.layerWidth = rangePercent(scrollPercent, width*2, width*1.1);
    positionVars.current.layerScale = rangePercent(scrollPercent, 2, 1.1);
    positionVars.current.fullLayerWidth = Math.min(rangePercent(scrollPercent, displayWidth*2, displayWidth*1.1), 1200);

    positionVars.current.bufficornLeft = 0-(displayWidth - width) / 2 + scrollX / 7;
    positionVars.current.bufficornTop = rangePercent(scrollPercent, height * 0.2, -height * 0.5);
    positionVars.current.titlePos = height * 0.12 - scrollY / 10;

    positionVars.current.skyPos = rangePercent(scrollPercent, -height * 0.3, 0.05);
    positionVars.current.mountainsTop = rangePercent(scrollPercent, height * 0.20, height * 0.01);
    const mountainDistance = 0.08 - scrollPercent/100 * 0.08;
    positionVars.current.mountainLeft = -width*0.05-layerLeft - scrollX * mountainDistance;
    positionVars.current.underMountainOpacity = rangePercent(scrollPercent, 0.99, 0.00);
    positionVars.current.mountainFullOpacity = rangePercent(scrollPercent,0.99,0.1);
    positionVars.current.mountainOverOpacity = scrollPercent > 80 ? 0.0 : Math.min(0.7,rangePercent(scrollPercent, 0, 10));

    const foothillsDistance = 0.16 - scrollPercent/100 * 0.16
    positionVars.current.foothillsLeft = -width*0.05-layerLeft - scrollX * foothillsDistance;
    positionVars.current.foothillsTop = rangePercent(scrollPercent, height*0.1, -height*0.08);
    positionVars.current.foothillWidth = positionVars.current.fullLayerWidth * 1.25;

    positionVars.current.cityLeft = rangePercent(scrollPercent, positionVars.current.layerWidth*0.08, positionVars.current.layerWidth*0.05);
    positionVars.current.cityTop = rangePercent(scrollPercent, height*0.2, height*0.02);
    positionVars.current.cityOffset = rangePercent(scrollPercent,-height*0.1,-height*0.05);
    positionVars.current.cityDistance = 0.6 - scrollPercent/100 * 0.3;

    const treesDistance = 0.8 - scrollPercent/100 * 0.2
    positionVars.current.treesLeft = rangePercent(scrollPercent, positionVars.current.cityOffset - positionVars.current.cityLeft - treesDistance * scrollX, -positionVars.current.cityLeft)
    positionVars.current.treesTop = rangePercent(scrollPercent, height*0.7, height*0.2);


    const castleOffset = 0.2;
    const castleScroll = scrollX*(0.9 - scrollPercent/100 * 0.1)
    positionVars.current.castleLeft = -width * castleOffset - castleScroll;



    let scrollOffsetBuilding = -50;
    const STARTSCROLLINGAT = 65;
    if(scrollPercent > STARTSCROLLINGAT){
      const thisScroll = (scrollPercent - STARTSCROLLINGAT) * 100 / (100 - STARTSCROLLINGAT);
      scrollOffsetBuilding += thisScroll * 6.2;
    }
    positionVars.current.scrollOffsetBuilding = scrollOffsetBuilding;


    positionVars.current.castleBackTop = positionVars.current.coverMax + scrollOffsetBuilding/2+15 // Math.max(height*0.2,coverMax+scrollOffsetBuilding/2+15)


    positionVars.current.layer1Bottom = coverMax < height * 0.3
      ? Math.max(height*0.6,rangePercent(scrollPercent,height*0.82,-height*0.5))
      : coverMax;

    let sidewalkDivider = 2;
    let sidewalkBottom = coverMax;
    positionVars.current.showingPreExplosion = false;

    if (exploded || sidewalkBottom < height*0.5) {
      sidewalkBottom = rangePercent(scrollPercent,height*0.5333,height*0.7)
      sidewalkDivider = 1;
    }

    if(sidewalkBottom < height*0.5){
      positionVars.current.showingPreExplosion = true
    }
    if (positionVars.current.showingPreExplosion){
      positionVars.current.layer1Bottom -= 3 * screenRatio
    } else {
      positionVars.current.layer1Bottom += 7 * screenRatio
    }

    positionVars.current.sidewalkTop = 6 + sidewalkBottom + scrollOffsetBuilding / sidewalkDivider;
    positionVars.current.sidewalkBottom = sidewalkBottom;
    positionVars.current.sidewalkDivider = sidewalkDivider;
  };


  // Layer refs
  const bufficorn = useRef();
  const title = useRef();
  const sky = useRef();
  const undermountains = useRef();
  const mountainsFull = useRef();
  const overmountains = useRef();
  const foothills = useRef();
  const city = useRef();
  const treesRef = useRef();

  const castleBack = useRef();
  const sidewalk = useRef();
  const floor1Preview = useRef();
  const floor1 = useRef();
  const castleFull = useRef();

  const drawPositions = () => {
    const setStyle = (ref: React.RefObject<HTMLElement>, prop: string, val: any) => {
      if (ref.current) {
        ref.current.style[prop] = val;
      }
    };
    const setTransform = (ref: React.RefObject<HTMLElement>, x: number, y: number, scale: number = 1) =>
      setStyle(ref, 'transform', `translate3d(${x}px, ${y}px, 0) scale(${scale})`);
    const setLayerWidth = (ref: React.RefObject<HTMLElement>, width: number) => {
      if (ref.current) {
        ref.current.querySelector('img').style.width = `${width}px`;
      }
    }

    const {
      mountainsTop, mountainLeft, foothillsLeft, foothillsTop, cityLeft, cityTop, cityOffset, cityDistance,
      scrollX, underMountainOpacity, mountainFullOpacity, mountainOverOpacity, treesLeft, treesTop,
      bufficornLeft, bufficornTop, coverMax, titlePos, castleBackTop, castleLeft, fullLayerWidth,
      layer1Bottom, scrollOffsetBuilding, sidewalkDivider, sidewalkBottom, exploding, foothillWidth,
      layerScale
    } = positionVars.current;

    setTransform(bufficorn, bufficornLeft, bufficornTop);
    setStyle(title, 'transform', `translate3d(0, ${titlePos}px, 0) scaleY(2) scaleX(0.85)`);
    setTransform(undermountains, mountainLeft, mountainsTop, layerScale);
    setStyle(undermountains, 'opacity', underMountainOpacity);
    setTransform(mountainsFull, mountainLeft, mountainsTop, layerScale);
    setStyle(mountainsFull, 'opacity', mountainFullOpacity);
    setTransform(overmountains, mountainLeft, mountainsTop, layerScale);
    setStyle(overmountains, 'opacity', mountainOverOpacity);
    setTransform(foothills, foothillsLeft, foothillsTop, layerScale * 1.25);
    setTransform(city, rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft), cityTop, layerScale);
    setTransform(treesRef, treesLeft, treesTop, layerScale);

    setTransform(castleBack, castleLeft, castleBackTop);
    setTransform(sidewalk, castleLeft, castleBackTop);
    setTransform(floor1Preview, castleLeft, layer1Bottom + scrollOffsetBuilding);
    setTransform(floor1, castleLeft, -12 + sidewalkBottom + scrollOffsetBuilding / sidewalkDivider);
    setTransform(castleFull, castleLeft, coverMax + (scrollOffsetBuilding / 2));
  };

  const {
    scrollPercent, coverMax, mountainsTop, layerWidth, cityTop, cityLeft, cityOffset, cityDistance,
    fullLayerWidth, scrollOffsetBuilding, layer1Bottom, showingPreExplosion, sidewalkTop, sidewalkBottom,
    sidewalkDivider, foothillWidth
  } = positionVars.current;


  useEffect(() => {
    setTimeout(()=>{
      console.log("LAGGED ACTION")

        console.log("SCROLL AT START IS THIS THE RIGHT WAY? WE NEED TO DETECT IMAGES LOADED")
        if(containerRef.current){
          const { scaleX, scrollY } = positionVars.current;
          if( scrollX==0 && scrollY==0 ){
            containerRef.current.scrollTo({
              top: 250,
              left: 120,
              behavior: 'smooth',
            });
          }
        }

    },500);
  }, []);

  useLayoutEffect(() => {
    if (!height || !width) {
      setExploded(exploded);
    }
    updatePosition(positionVars.current.scrollX, positionVars.current.scrollY);
    drawPositions();
  }, [exploded, height, width]);

  //console.log({ height, width, x: scrollX, y: scrollY, scrollPercent });


  let layerLeft = 0//rangePercent(scrollPercent,layerWidth*0.2,layerWidth*0.05)


  let layerCount = 1
  const setLayerCount = (amt: number) => {
    layerCount = amt;
    return null;
  }

  let denverBackground: React.ReactNode | null = null;

  let mountainWidth = rangePercent(scrollPercent,displayWidth*1.6,displayWidth*1.1)
  let mountainPerspective = rangePercent(scrollPercent,layerWidth*0.15,layerWidth*0.2)
  const mountainOverOpacity = scrollPercent > 80 ? 0.0 : Math.min(0.7,rangePercent(scrollPercent, 0, 10));
  const mountainDistance = 0.08 - scrollPercent/100 * 0.08
  let foothillsPerspective = rangePercent(scrollPercent,layerWidth*0.05,layerWidth*0.2)
  let cityPerspective = rangePercent(scrollPercent,layerWidth*0.07,layerWidth*0.2)
  let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)

  denverBackground = (
    <Fragment>
      <Layer
        index={layerCount++}
        img={mountainsFiles.undermountains}
        width={width}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        scale={positionVars.current.layerScale}
        opacity={positionVars.current.underMountainOpacity}
        ref={undermountains}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.mountainsFull}
        width={width}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        scale={positionVars.current.layerScale}
        opacity={positionVars.current.mountainFullOpacity}
        ref={mountainsFull}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.overmountains}
        width={width}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        scale={positionVars.current.layerScale}
        opacity={positionVars.current.mountainOverOpacity}
        ref={overmountains}
      />

      <Layer
        index={layerCount++}
        img={mountainsFiles.foothills}
        width={width}
        left={positionVars.current.foothillsLeft}
        top={positionVars.current.foothillsTop}
        perspective={foothillsPerspective}
        scale={positionVars.current.layerScale * 1.25}
        brightness={rangePercent(scrollPercent,100,50)}
        ref={foothills}
      />

      {setLayerCount(10)}

      <Layer
        index={layerCount++}
        img={cityFull}
        width={width}
        left={rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft)}
        top={positionVars.current.cityTop}
        perspective={cityPerspective}
        scale={positionVars.current.layerScale}
        scaleY={rangePercent(scrollPercent,1.2,0.8)}
        brightness={rangePercent(scrollPercent,100,70)}
        ref={city}
      />

      <Layer
        index={layerCount++}
        img={trees}
        width={width}
        left={positionVars.current.treesLeft}
        top={positionVars.current.treesTop}
        perspective={treesPerspective}
        scaleY={0.88}
        scale={positionVars.current.layerScale}
        brightness={rangePercent(scrollPercent, 100, 20)}
        ref={treesRef}
      />
    </Fragment>
  )

  const sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)


  const FLOOR_PADDING = 600
  let lowbound = height*0.4


  const scrollListener = (e: any) => {
    const [x, y] = [e.target.scrollLeft, e.target.scrollTop];
    updatePosition(x, y);
    drawPositions();
  }

  return (
    <Fragment>
      <Title ref={title} topPos={positionVars.current.titlePos}>
        <div style={{ fontSize: "30pt" }}>B<span style={{ fontSize: "28pt" }}>UFFI</span>DAO</div>
        <div style={{lineHeight: "7pt", color:"#adadad",fontSize:"12pt"}}>ETHDENVER 2020</div>
      </Title>

      <Fixed style={{
        height: (height*screenRatio)-scrollY,
        width: Math.min(displayWidth,(width-1)*1.8),
      }}>
        <Sky topPos={positionVars.current.skyPos} ref={sky} />

        <div style={{
          position:"absolute",
          top:height*0.1,
          width:width,
          height:height*screenRatio,
        }}>

          {denverBackground}
        </div>
      </Fixed>

      <Content>
        {children}
      </Content>

      <Scrollable ref={containerRef} onScroll={scrollListener}>
        <div style={{
          zIndex:100,
          position:"absolute",
          width:width*2,
          overflow:"hidden",
          height: (height*screenRatio),
        }}>
        </div>
      </Scrollable>
    </Fragment>
  );
};

export default ScrollingGame;
