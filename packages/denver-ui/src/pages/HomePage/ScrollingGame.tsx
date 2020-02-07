import React, { useState, useEffect, useRef, useLayoutEffect, Fragment } from 'react';
import styled from 'styled-components';
import useDimensions from 'react-use-dimensions';
import QRCode from 'qrcode.react';
import Blockies from 'react-blockies';

import QuestButton from './QuestButton';
import QuestInfo from './QuestInfo';

import Layer from './Layer';
import Floor from './Floor';
import StartButton from './StartButton';
import PegaBufficorn2 from './PegaBufficorn2';
import Missions from './Missions';
import Tiles from './Tiles';

import HUD from './HUD';

import profile from "../../images/profile.png"
import xpmeter from "../../images/xpmeter.png"
import valuehud from "../../images/valuehud.png"
import cityFull from "../../images/cityFull.png"
import stars from "../../images/stars.png"
import trees from "../../images/trees.png"

import mountainsFiles from '../../images/mountains';
import castleFiles from '../../images/castle';


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

const ButtonBox = styled.div.attrs<{ boxWidth: number }>({
  style: ({ boxWidth }) => ({
    left: boxWidth * 1.1 + 'px',
    height: boxWidth * 0.9 + 'px',
    width:"100%"
  }),
})<{ boxWidth: number }>`
  z-index: 999;
  position: absolute;
  top: 0;
  height: 60%;
  margin-top: 10%;
`;

const Sky = styled.div.attrs<{ topPos: number }>({
  style: ({ topPos }) => ({
    transform: `translate3d(0, ${topPos}px, 0)`,
  }),
})<{ topPos: number }>`
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

const Title = styled.div.attrs<{ topPos: number }>({
  style: ({ topPos }) => ({
    transform: `translate3d(0, ${topPos}px, 0) scaleY(2) scaleX(0.85)`,
  }),
})<{ topPos: number }>`
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

const rangePercent = (percent, finish, start) => ((start - finish) * (percent / 100)) + finish;

const ScrollingGame = () => {
  const [exploded, setExploded] = useState(false);
  let [containerRef, { height, width }, containerNode] = useDimensions();
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
    fullLayerWidth: Math.min(displayWidth * 2, 1200),

    exploding: false,



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

    castleLeft: 0,
    scrollOffsetBuilding: 0,
    sidewalkTop: 0,
    sidewalkBottom: 0,
    sidewalkLeft: 0,
    showingPreExplosion: false,
  });

  const updatePosition = (scrollX: number, scrollY: number) => {
    positionVars.current.scrollX = scrollX;
    positionVars.current.scrollY = scrollY;

    const scrollPercent = Math.min(Math.max(Math.floor(scrollY / height / screenRatio * 100 * overScrollToMakeFloorsAtTheTopShowUpBetter), 0), 100);
    positionVars.current.scrollPercent = scrollPercent;
    positionVars.current.coverMax = rangePercent(scrollPercent, height*0.8, -height);

    positionVars.current.layerWidth = rangePercent(scrollPercent, width*2, width*1.1);
    positionVars.current.fullLayerWidth = Math.min(rangePercent(scrollPercent, displayWidth*2, displayWidth*1.1), 1200);

    positionVars.current.bufficornLeft = -20 - scrollX / 3;
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
    positionVars.current.foothillsLeft = -width*0.4-layerLeft - scrollX * foothillsDistance;
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
    positionVars.current.sidewalkLeft = 0
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
    const setTransform = (ref: React.RefObject<HTMLElement>, x: number, y: number) =>
      setStyle(ref, 'transform', `translate3d(${x}px, ${y}px, 0)`);
    const setLayerWidth = (ref: React.RefObject<HTMLElement>, width: number) => {
      if (ref.current) {
        ref.current.querySelector('img').style.width = `${width}px`;
      }
    }

    const {
      mountainsTop, mountainLeft, foothillsLeft, foothillsTop, cityLeft, cityTop, cityOffset, cityDistance,
      scrollX, underMountainOpacity, mountainFullOpacity, mountainOverOpacity, treesLeft, treesTop,
      bufficornLeft, bufficornTop, coverMax, titlePos, castleBackTop, castleLeft, fullLayerWidth,
      layer1Bottom, scrollOffsetBuilding, sidewalkDivider, sidewalkBottom, exploding, foothillWidth
    } = positionVars.current;

    setTransform(bufficorn, bufficornLeft, bufficornTop);

    setStyle(title, 'transform', `translate3d(0, ${titlePos}px, 0) scaleY(2) scaleX(0.85)`);
    setTransform(undermountains, mountainLeft, mountainsTop);
    setStyle(undermountains, 'opacity', underMountainOpacity);
    setLayerWidth(undermountains, fullLayerWidth);
    setTransform(mountainsFull, mountainLeft, mountainsTop);
    setStyle(mountainsFull, 'opacity', mountainFullOpacity);
    setLayerWidth(mountainsFull, fullLayerWidth);
    setTransform(overmountains, mountainLeft, mountainsTop);
    setStyle(overmountains, 'opacity', mountainOverOpacity);
    setLayerWidth(overmountains, fullLayerWidth);
    setTransform(foothills, foothillsLeft, foothillsTop);
    setLayerWidth(foothills, foothillWidth);
    setTransform(city, rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft), cityTop);
    setLayerWidth(city, fullLayerWidth);
    setTransform(treesRef, treesLeft, treesTop);
    setLayerWidth(treesRef, fullLayerWidth);

    setTransform(castleBack, castleLeft, castleBackTop);
    setTransform(sidewalk, castleLeft, castleBackTop);
    setTransform(floor1Preview, castleLeft, layer1Bottom + scrollOffsetBuilding);
    setTransform(floor1, castleLeft, -12 + sidewalkBottom + scrollOffsetBuilding / sidewalkDivider);
    setTransform(castleFull, castleLeft, coverMax + (scrollOffsetBuilding / 2));

    if(!exploding && coverMax < (height * HEIGHT_TO_EXPLODE_AT)){
      positionVars.current.exploding = true;
      setExploded(true);

      setTimeout(() => {
        window.scrollTo({
          top: 3000,
          left: width * 0.777,
          behavior: 'smooth',
        });
        positionVars.current.exploding = false;
      }, 900);
    }
  };

  const {
    scrollPercent, coverMax, mountainsTop, layerWidth, cityTop, cityLeft, cityOffset, cityDistance,
    fullLayerWidth, scrollOffsetBuilding, layer1Bottom, showingPreExplosion, sidewalkTop, sidewalkLeft, sidewalkBottom,
    sidewalkDivider, foothillWidth
  } = positionVars.current;


  useLayoutEffect(() => {
    setTimeout(()=>{
      if(containerNode){
        const { scaleX, scrollY } = positionVars.current;
        if(scrollX === 0 && scrollY === 0){
          containerNode.scrollTo({
            top: 250,
            left: 120,
            behavior: 'smooth',
          });
        }
      }
    }, 500);
  }, [containerNode]);

  useLayoutEffect(() => {
    if (!height || !width) {
      setExploded(exploded);
    }
    updatePosition(positionVars.current.scrollX, positionVars.current.scrollY);
    drawPositions();
  }, [exploded, height, width]);

  ///////adding this so we can catch the scroll back up and show the intro screen
  useLayoutEffect(() => {
    const handleScroll = () => {
      if(!positionVars.current.exploding && exploded && window.scrollY < 10){
        positionVars.current.exploding = true;
        setExploded(false);
        console.log('deplode');
        if(containerNode){
          containerNode.scrollTo({
            top: width*HEIGHT_TO_EXPLODE_AT*0.95,
            left: 120,
          });
        }

        setTimeout(()=>{
          if(containerNode){
            containerNode.scrollTo({
              top: width*HEIGHT_TO_EXPLODE_AT,
              left: 120,
            });
          }
          positionVars.current.exploding = false;
          updatePosition(120, width * HEIGHT_TO_EXPLODE_AT);
          drawPositions();
        }, 1000);
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [exploded]);

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
  let cityWidth = fullLayerWidth *1.05
  let cityPerspective = rangePercent(scrollPercent,layerWidth*0.07,layerWidth*0.2)
  let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)

  denverBackground = (
    <Fragment>
      <Layer
        index={layerCount++}
        img={mountainsFiles.undermountains}
        width={fullLayerWidth}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        opacity={positionVars.current.underMountainOpacity}
        ref={undermountains}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.mountainsFull}
        width={fullLayerWidth}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        opacity={positionVars.current.mountainFullOpacity}
        ref={mountainsFull}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.overmountains}
        width={fullLayerWidth}
        left={positionVars.current.mountainLeft}
        top={positionVars.current.mountainsTop}
        perspective={mountainPerspective}
        opacity={positionVars.current.mountainOverOpacity}
        ref={overmountains}
      />

      <Layer
        index={layerCount++}
        img={mountainsFiles.foothills}
        width={foothillWidth}
        left={positionVars.current.foothillsLeft}
        top={positionVars.current.foothillsTop}
        perspective={foothillsPerspective}
        brightness={rangePercent(scrollPercent,100,50)}
        ref={foothills}
      />

      {setLayerCount(10)}

      <Layer
        index={layerCount++}
        img={cityFull}
        width={fullLayerWidth}
        left={rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft)}
        top={positionVars.current.cityTop}
        perspective={cityPerspective}
        scaleY={rangePercent(scrollPercent,1.2,0.8)}
        brightness={rangePercent(scrollPercent,100,70)}
        ref={city}
      />

      <Layer
        index={layerCount++}
        img={trees}
        width={fullLayerWidth}
        left={positionVars.current.treesLeft}
        top={positionVars.current.treesTop}
        perspective={treesPerspective}
        scaleY={0.88}
        brightness={rangePercent(scrollPercent, 100, 20)}
        ref={treesRef}
      />

    </Fragment>
  )

  const sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)


  let floors = []


  const FLOOR_PADDING = 600
  let lowbound = height*0.4



  if(exploded){
    /////////////////////////////////////////////////////////////////////////////// MAP VIEW, TILES ETC

    for(let f=6;f>0;f--){
      console.log("floor"+f)
      let floorLocation = (7-f)*(FLOOR_PADDING)
      floors.push(
        <Floor
          key={"floor"+f}
          index={0}
          img={castleFiles['floor'+f]}
          left={0}
          top={floorLocation}
        >
          <Missions floor={f} />
          <Tiles floor={f} />
        </Floor>
      )
    }



    //bizzaro map world
    return (
      <Fragment>
        <Layer
          index={0}
          img={castleFiles.castleFull}
          width={layerWidth}
          left={0}
          top={0}
          perspective={sidewalkPerspective}
        />

        <div
          style={{transform:"scale(0.5)",position:"absolute",left:0}}
        >
        {floors}
        </div>

        {SHOWHUD?<HUD />:""}


      </Fragment>
    )
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  INTRO MOUNTAIN VIEW:


  const scrollListener = (e: any) => {
    const [x, y] = [e.target.scrollLeft, e.target.scrollTop];
    updatePosition(x, y);
    drawPositions();
  }

//  <PegaBufficorn scale={Math.max(0.8,0.8*(displayWidth-width)/300)}  />
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

        {/*!loggedIn && (
          <StartButton
            scrollX={scrollX}
            height={height}
            onClick={()=>{
              setLoggedIn(true)
              setTimeout(() => {
                window.scrollTo({
                  top: height*1.33,
                  left: width*0.1,
                  behavior: 'smooth',
                });
                setOpenedBuilding(true);
              }, 30);
            }}
          />
        )*/}

        <div style={{
          position:"absolute",
          top:height*0.1,
          width:width,
          height:height*screenRatio,
        }}>


          <PegaBufficorn2 ref={bufficorn} left={positionVars.current.buficornLeft} top={positionVars.current.bufficornTop}/>

          {denverBackground}

          <Layer
            index={layerCount++}
            img={castleFiles.castleBack}
            width={layerWidth}
            left={positionVars.current.castleLeft}
            top={positionVars.current.castleBackTop}
            perspective={sidewalkPerspective}
            ref={castleBack}
          />

          {setLayerCount(50)}

          <Layer
            index={layerCount++}
            img={castleFiles._sidewalk_1}
            width={layerWidth}
            left={positionVars.current.sidewalkLeft}
            top={positionVars.current.sidewalkTop}
            perspective={sidewalkPerspective}
            ref={sidewalk}
          />

          {/*showingPreExplosion ? (
            <Layer
              index={layerCount++}
              img={castleFiles.floor1_preview}
              width={layerWidth}
              left={positionVars.current.castleLeft}
              top={layer1Bottom + scrollOffsetBuilding}
              perspective={sidewalkPerspective}
              ref={floor1Preview}
            />
          )*/}

          <Layer
            index={layerCount++}
            img={castleFiles.castleFull}
            width={layerWidth}
            left={positionVars.current.castleLeft}
            top={coverMax + scrollOffsetBuilding/2}
            perspective={sidewalkPerspective}
            ref={castleFull}
          />

        </div>
      </Fixed>

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

      {SHOWHUD?<HUD />:""}
    </Fragment>
  );
};

export default ScrollingGame;
