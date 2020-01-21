import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';

import cityFull from "../../images/cityFull.png"
import stars from "../../images/stars.png"
import trees from "../../images/trees.png"
import qrscan from "../../images/qrscan.png"
import profile from "../../images/profile.png"
import xpmeter from "../../images/xpmeter.png"
import valuehud from "../../images/valuehud.png"

import mountainsFiles from '../../images/mountains';
import castleFiles from '../../images/castle';

import QuestButton from './QuestButton';
import Layer from './Layer';
import StartButton from './StartButton';
import PegaBufficorn from './PegaBufficorn';

const STARTLOGGEDIN = false
const SHOWOWOCKI = false
const SHOWBOUNTIES = false

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        // @ts-ignore
        Math.min(900, window.clientWidth || window.innerWidth),
        // @ts-ignore
        window.clientHeight || window.innerHeight
      ]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const ButtonBox = styled.div.attrs<{ boxWidth: number }>({
  style: ({ boxWidth }) => ({
    left: boxWidth * 1.1 + 'px',
    height: boxWidth * 0.9 + 'px',
  }),
})<{ boxWidth: number }>`
  zIndex: 999;
  position: absolute;
  top: 0;
  height: 60%;
  marginTop: 10%;
`;

const HomePage: React.FC = () => {
  const [openedBuilding, setOpenedBuilding] = useState(STARTLOGGEDIN);
  const [loggedIn, setLoggedIn] = useState(STARTLOGGEDIN);

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const listener = e => {
    setScrollY(window.scrollY)
    setScrollX(window.scrollX)
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  const [width, height] = useWindowSize();

  const screenRatio = 7/1
  const rightScrollBarOffset = 15
  let adjustedHeight = height*screenRatio
  let bottom = height+scrollY
  let scrollPercent = Math.round(scrollY / (adjustedHeight-height) * 100)
  if(!scrollPercent) scrollPercent = 0
  scrollPercent = Math.max(scrollPercent,0)
  scrollPercent = Math.min(scrollPercent,100)
  //console.log("scrollPercent",scrollPercent)

  let layers = []

  const rangePercent = (percent,finish,start) => {
    return ((start-finish)*(percent/100))+finish
  }

  let layerWidth = rangePercent(scrollPercent,width*2,width*1.1)


  let layerLeft = rangePercent(scrollPercent,layerWidth*0.2,layerWidth*0.05)


  let mountainWidth = rangePercent(scrollPercent,width*1.6,width*1.1)
  let mountainsTop = rangePercent(scrollPercent,height*0.35,height*0.01)
  let mountainPerspective = rangePercent(scrollPercent,layerWidth*0.15,layerWidth*0.2)

  let layerCount = 1
  const setLayerCount = (amt: number) => {
    layerCount = amt;
    return null;
  }

  const mountainOverOpacity = scrollPercent > 80 ? 0.0 : Math.min(0.7,rangePercent(scrollPercent, 0, 10));
  const mountainDistance = 0.08 - scrollPercent/100 * 0.08

  let foothillsDistance = 0.16 - scrollPercent/100 * 0.16

  let foothillsTop = rangePercent(scrollPercent,height*0.24,-height*0.08)
  let foothillsPerspective = rangePercent(scrollPercent,layerWidth*0.05,layerWidth*0.2)

  let cityDistance = 0.6 - scrollPercent/100 * 0.3

  let cityWidth = layerWidth

  let cityLeft = rangePercent(scrollPercent,layerWidth*0.08,layerWidth*0.05)
  let cityOffset = rangePercent(scrollPercent,-height*0.1,-height*0.05)

  let cityPerspective = rangePercent(scrollPercent,layerWidth*0.09,layerWidth*0.2)
  let cityTop = rangePercent(scrollPercent,height*0.3,height*0.02)

  let treesDistance = 0.8 - scrollPercent/100 * 0.2

  let treesTop = rangePercent(scrollPercent,height*0.75,height*0.2)
  let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)

  const sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)

  let scrollOffsetBuilding = -50

  const STARTSCROLLINGAT = 65;

  if(scrollPercent > STARTSCROLLINGAT){
    let thisScroll = (scrollPercent-STARTSCROLLINGAT)*100/(100-STARTSCROLLINGAT)
    scrollOffsetBuilding += thisScroll*6.2
  }

  let sidewalkDivider = 2;
  let exploded = false;

  let coverMax = rangePercent(scrollPercent,height*0.8,-height)
  let sidewalkBottom = coverMax
  let lowbound = height*0.4

  if(loggedIn && sidewalkBottom < height*0.5){
    exploded = true
    sidewalkBottom = rangePercent(scrollPercent,height*0.5333,height*0.7)
    sidewalkDivider = 1
  }

  layerLeft += scrollX


  let castleBackTop = coverMax+scrollOffsetBuilding/2+15 // Math.max(height*0.2,coverMax+scrollOffsetBuilding/2+15)

  const buildingLayerSpread = 0.22

  let layer1Bottom = coverMax < height * 0.5
    ? Math.max(height*0.6,rangePercent(scrollPercent,height*0.82,-height*0.5))
    : coverMax;

  if(exploded){
    layer1Bottom -= 3*screenRatio
  }else{
    layer1Bottom += 7*screenRatio
  }

  const stickPointLayer2 = layer1Bottom - height * buildingLayerSpread;
  const stickPointLayer3 = (coverMax < stickPointLayer2 * 0.8 ? stickPointLayer2 : coverMax) - height * buildingLayerSpread*1.2;
  const stickPointLayer4 = (coverMax < stickPointLayer3 ? stickPointLayer3 : coverMax) - height * buildingLayerSpread;
  const stickPointLayer5 = (coverMax < stickPointLayer4 ? stickPointLayer4 : coverMax) - height * buildingLayerSpread;
  const stickPointLayer6 = (coverMax < stickPointLayer5 ? stickPointLayer5 : coverMax) - height * buildingLayerSpread;

  return (
    <div style={{width:"100%",textAlign:"center",backgroundColor:"#000000"}}>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:15,right:0}}>
        <img src={profile} style={{maxWidth:180}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:69,right:0}}>
        <img src={xpmeter} style={{maxWidth:130}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:10,left:0}}>
        <img src={valuehud} style={{maxWidth:130}}></img>
      </div>

      <div style={{margin:"0 auto",height:!loggedIn?height*1.9:height*screenRatio,width:(width-1)*1.8,overflow:"hidden"}}>

        <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",bottom:-20,right:"15%",width:100,height:100,background:"linear-gradient(#b75fac, #a24c97)",borderRadius:80}}>
          <img src={qrscan} style={{width:"80%",height:"80%",marginTop:5}}></img>
        </div>

        <div style={{
          backgroundColor:"#FFFFFF",
          width:width,
          height:height*0.85,
          position:"fixed",
          transform: `translate3d(0, ${rangePercent(scrollPercent,-height*0.2,0)}px, 0)`,
        }}>
          <img src={stars} style={{minWidth:width}} />
        </div>

        <div style={{
          position: "fixed",
          transform: `translate3d(0, ${height * 0.09 - scrollY / 3}px, 0)`,
          width,
          height,
          overflow: 'hidden',
        }}>
          <div style={{color:"#efefef",fontSize:"30pt"}}>B<span style={{color:"#efefef",fontSize:"28pt"}}>UFFI</span>DAO</div>
          <div style={{color:"#adadad",fontSize:"12pt"}}>ETHDENVER 2020</div>
        </div>


        {!loggedIn && (
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
        )}



        <div style={{position:"fixed",top:height*0.1,width:width,height:height*screenRatio}}>

          <Layer
            index={layerCount++}
            img={mountainsFiles.undermountains}
            width={mountainWidth}
            left={-layerLeft - scrollX * mountainDistance}
            top={mountainsTop}
            perspective={mountainPerspective}
            opacity={rangePercent(scrollPercent,0.99,0)}
          />
          <Layer
            index={layerCount++}
            img={mountainsFiles.mountainsFull}
            width={mountainWidth}
            left={-layerLeft - scrollX * mountainDistance}
            top={mountainsTop}
            perspective={mountainPerspective}
            opacity={rangePercent(scrollPercent,0.99,0)}
          />
          <Layer
            index={layerCount++}
            img={mountainsFiles.overmountains}
            width={mountainWidth}
            left={-layerLeft - scrollX * mountainDistance}
            top={mountainsTop}
            perspective={mountainPerspective}
            opacity={mountainOverOpacity}
          />

          <Layer
            index={layerCount++}
            img={mountainsFiles.foothills}
            width={layerWidth}
            left={-layerLeft - scrollX * foothillsDistance}
            top={foothillsTop}
            perspective={foothillsPerspective}
            brightness={rangePercent(scrollPercent,100,50)}
          />

          {setLayerCount(10)}

          <Layer
            index={layerCount++}
            img={cityFull}
            width={cityWidth}
            left={rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft)}
            top={cityTop}
            perspective={cityPerspective}
            scaleY={rangePercent(scrollPercent,1.2,0.8)}
            brightness={rangePercent(scrollPercent,100,70)}
          />

          <Layer
            index={layerCount++}
            img={trees}
            width={layerWidth}
            left={rangePercent(scrollPercent, cityOffset-cityLeft-treesDistance*scrollX, -cityLeft)}
            top={treesTop}
            perspective={treesPerspective}
            scaleY={0.88}
            brightness={rangePercent(scrollPercent, 100, 20)}
          />

          <Layer
            index={layerCount++}
            img={castleFiles.castleBack}
            width={layerWidth}
            left={-layerLeft}
            top={castleBackTop}
            perspective={sidewalkPerspective}
          />

          {setLayerCount(50)}

          <Layer
            index={layerCount++}
            img={castleFiles._sidewalk_1}
            width={layerWidth}
            left={-layerLeft}
            top={6 + sidewalkBottom + scrollOffsetBuilding / sidewalkDivider}
            perspective={sidewalkPerspective}
          />

          {!openedBuilding || !exploded ? (
            <Layer
              index={layerCount++}
              img={castleFiles.floor1_preview}
              width={layerWidth}
              left={-layerLeft}
              top={layer1Bottom + scrollOffsetBuilding}
              perspective={sidewalkPerspective}
            />
          ) : (
            <Fragment>
              <Layer
                index={layerCount++}
                img={castleFiles.floor1}
                width={layerWidth}
                left={-layerLeft}
                top={layer1Bottom + scrollOffsetBuilding}
                perspective={sidewalkPerspective}
              >
                <ButtonBox boxWidth={width}>
                  <QuestButton location="Front Desk" color="#575b87" task="Check in to venue" xp={50} />
                  <QuestButton location="Art Gallery" color="#cfa286" task="Bid on artwork" xp={100} />
                  <QuestButton location="Coat Check" color="#57877b" task="Check Coat" xp={25} />
                </ButtonBox>
              </Layer>

              <Layer
                index={layerCount++}
                img={SHOWOWOCKI ? castleFiles.floor2_owocki : castleFiles.floor2}
                width={layerWidth}
                left={-layerLeft}
                top={stickPointLayer2 + scrollOffsetBuilding}
                perspective={sidewalkPerspective}
              >
                <ButtonBox boxWidth={width}>
                  {SHOWOWOCKI && (
                    <QuestButton location="Owacki Sacki" color="#7381b5" task="Talk OSS" xp={75} />
                  )}
                </ButtonBox>
              </Layer>

              {coverMax < stickPointLayer3 && (
                <Layer
                  index={layerCount++}
                  img={castleFiles.floor3}
                  width={layerWidth}
                  left={-layerLeft}
                  top={stickPointLayer3 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                />
              )}

              {coverMax < stickPointLayer4 && (
                <Layer
                  index={layerCount++}
                  img={castleFiles.floor4}
                  width={layerWidth}
                  left={-layerLeft}
                  top={stickPointLayer4 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                />
              )}

              {coverMax < stickPointLayer5 && (
                <Layer
                  index={layerCount++}
                  img={SHOWBOUNTIES ? castleFiles.floor5 : castleFiles.floor5_wtf}
                  width={layerWidth}
                  left={-layerLeft}
                  top={stickPointLayer5 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                >
                  <ButtonBox boxWidth={width}>
                    {SHOWBOUNTIES && (
                      <QuestButton location="Bounties Network" color="#f1c673" task="Mimosas with Simona" xp={95} />
                    )}
                  </ButtonBox>
                </Layer>
              )}

              {coverMax < stickPointLayer6 && (
                <Layer
                  index={layerCount++}
                  img={castleFiles.floor6}
                  width={layerWidth}
                  left={-layerLeft}
                  top={stickPointLayer6 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                />
              )}
            </Fragment>
          )}

          <Layer
            index={layerCount++}
            img={castleFiles.castleFull}
            width={layerWidth}
            left={-layerLeft}
            top={coverMax + scrollOffsetBuilding/2}
            perspective={sidewalkPerspective}
          />
          <PegaBufficorn rightPos={scrollX/2} topPos={rangePercent(scrollPercent, 0, -height * 0.8)} />
        </div>

        <div style={{position:"relative",width:width,height:adjustedHeight,overflow:"hidden"}}>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
