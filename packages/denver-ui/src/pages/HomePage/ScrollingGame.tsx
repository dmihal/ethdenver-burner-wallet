import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import useDimensions from 'react-use-dimensions';

import QuestButton from './QuestButton';
import Layer from './Layer';
import StartButton from './StartButton';
import PegaBufficorn from './PegaBufficorn';

import profile from "../../images/profile.png"
import xpmeter from "../../images/xpmeter.png"
import valuehud from "../../images/valuehud.png"
import qrscan from "../../images/qrscan.png";
import cityFull from "../../images/cityFull.png"
import stars from "../../images/stars.png"
import trees from "../../images/trees.png"

import mountainsFiles from '../../images/mountains';
import castleFiles from '../../images/castle';

import lofiTitle from '../../images/lofi_title.png';
import lofiBack from '../../images/lofi_back.png';

const MAXWIDTH = 500;//put this *2 in Template.tsx   max-width
const LOFI = false;

const SHOWOWOCKI = false
const SHOWBOUNTIES = false

const UIBar = styled.div`
  position: fixed;
  right: -5px;
  bottom: -5px;
  z-index: 999;
`;

const ScanButton = styled.button`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  box-shadow: 0px 0px 4px #222222;
  background-image: url(${qrscan}), linear-gradient(#b75fac, #a24c97);
  margin: 0 auto;
  display: block;
  background-size: 90%;
  background-position: center;
`;
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
    width:"95%"
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



const ScrollingGame = () => {
  const [scroll, setScroll] = useState([0, 0]);
  let [scrollX, scrollY] = scroll;

  let [containerRef, { height, width, }] = useDimensions();
  let displayWidth = width
  width = Math.min(MAXWIDTH,width)
  //console.log("displayWidth",displayWidth,"width",width)
  let showLOFI
  if(displayWidth>height){
    showLOFI = true
  }else{
    showLOFI = LOFI
  }

  const screenRatio = 7/1
  const rightScrollBarOffset = 15
  let totalHeight = height*screenRatio
  let bottom = height+scrollY

  const overScrollToMakeFloorsAtTheTopShowUpBetter = 1.25

  let scrollPercent = Math.floor(scrollY / height / screenRatio * 100 * overScrollToMakeFloorsAtTheTopShowUpBetter)//Math.round(scrollY / (totalHeight-height) * 100)
  if(!scrollPercent) scrollPercent = 0
  scrollPercent = Math.max(scrollPercent,0)
  scrollPercent = Math.min(scrollPercent,100)
  //console.log({ height, width, x: scrollX, y: scrollY, scrollPercent });

  const rangePercent = (percent,finish,start) => {
    return ((start-finish)*(percent/100))+finish
  }

  let layerWidth = rangePercent(scrollPercent,width*2,width*1.1)


  let layerLeft = 0//rangePercent(scrollPercent,layerWidth*0.2,layerWidth*0.05)


  let layerCount = 1
  const setLayerCount = (amt: number) => {
    layerCount = amt;
    return null;
  }



  let denverBackground = ""
  if(showLOFI){

    //console.log("LOFI WIDTH",width)

    denverBackground = (
      <Fragment>
      <Layer
        index={layerCount++}
        img={lofiTitle}
        width={displayWidth}
        left={0}
        top={-80}
        opacity={scrollPercent<50?1:0}
      />
      <Layer
        index={layerCount++}
        img={lofiBack}
        width={displayWidth}
        left={0}
        top={-80}
        opacity={scrollPercent>=50?1:0}
      />
      {setLayerCount(10)}
      </Fragment>
    )
  }else{
    let fullLayerWidth = rangePercent(scrollPercent,displayWidth*2,displayWidth*1.1)
    fullLayerWidth = Math.min(fullLayerWidth,1200)

    let mountainWidth = rangePercent(scrollPercent,displayWidth*1.6,displayWidth*1.1)
    let mountainsTop = rangePercent(scrollPercent,height*0.30,height*0.01)
    let mountainPerspective = rangePercent(scrollPercent,layerWidth*0.15,layerWidth*0.2)
    const mountainOverOpacity = scrollPercent > 80 ? 0.0 : Math.min(0.7,rangePercent(scrollPercent, 0, 10));
    const mountainDistance = 0.08 - scrollPercent/100 * 0.08
    let foothillsDistance = 0.16 - scrollPercent/100 * 0.16
    let foothillsTop = rangePercent(scrollPercent,height*0.16,-height*0.08)
    let foothillsPerspective = rangePercent(scrollPercent,layerWidth*0.05,layerWidth*0.2)
    let cityDistance = 0.6 - scrollPercent/100 * 0.3
    let cityWidth = layerWidth
    let cityLeft = rangePercent(scrollPercent,layerWidth*0.08,layerWidth*0.05)
    let cityOffset = rangePercent(scrollPercent,-height*0.1,-height*0.05)
    let cityPerspective = rangePercent(scrollPercent,layerWidth*0.09,layerWidth*0.2)
    let cityTop = rangePercent(scrollPercent,height*0.2,height*0.02)
    let treesDistance = 0.8 - scrollPercent/100 * 0.2
    let treesTop = rangePercent(scrollPercent,height*0.75,height*0.2)
    let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)





    denverBackground = (
      <Fragment>
        <Layer
          index={layerCount++}
          img={mountainsFiles.undermountains}
          width={mountainWidth}
          left={-width*0.05-layerLeft - scrollX * mountainDistance}
          top={mountainsTop}
          perspective={mountainPerspective}
          opacity={rangePercent(scrollPercent,0.99,0.00)}
        />
        <Layer
          index={layerCount++}
          img={mountainsFiles.mountainsFull}
          width={mountainWidth}
          left={-width*0.05-layerLeft - scrollX * mountainDistance}
          top={mountainsTop}
          perspective={mountainPerspective}
          opacity={rangePercent(scrollPercent,0.99,0.1)}
        />
        <Layer
          index={layerCount++}
          img={mountainsFiles.overmountains}
          width={mountainWidth}
          left={-width*0.05-layerLeft - scrollX * mountainDistance}
          top={mountainsTop}
          perspective={mountainPerspective}
          opacity={mountainOverOpacity}
        />

        <Layer
          index={layerCount++}
          img={mountainsFiles.foothills}
          width={fullLayerWidth}
          left={-width*0.05-layerLeft - scrollX * foothillsDistance}
          top={foothillsTop}
          perspective={foothillsPerspective}
          brightness={rangePercent(scrollPercent,100,50)}
        />

        {setLayerCount(10)}

        <Layer
          index={layerCount++}
          img={cityFull}
          width={fullLayerWidth}
          left={rangePercent(scrollPercent, cityOffset-cityLeft-cityDistance*scrollX, -cityLeft)}
          top={cityTop}
          perspective={cityPerspective}
          scaleY={rangePercent(scrollPercent,1.2,0.8)}
          brightness={rangePercent(scrollPercent,100,70)}
        />

        <Layer
          index={layerCount++}
          img={trees}
          width={fullLayerWidth}
          left={rangePercent(scrollPercent, cityOffset-cityLeft-treesDistance*scrollX, -cityLeft)}
          top={treesTop}
          perspective={treesPerspective}
          scaleY={0.88}
          brightness={rangePercent(scrollPercent, 100, 20)}
        />

      </Fragment>
    )
  }

  const sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)

  let scrollOffsetBuilding = -50

  const STARTSCROLLINGAT = 65;

  if(scrollPercent > STARTSCROLLINGAT){
    let thisScroll = (scrollPercent-STARTSCROLLINGAT)*100/(100-STARTSCROLLINGAT)
    scrollOffsetBuilding += thisScroll*6.2
  }

  let sidewalkDivider = 2;
  let exploded = false;

  let coverMax = rangePercent(scrollPercent, height*0.8, -height);
  let sidewalkBottom = coverMax
  let lowbound = height*0.4



  if(sidewalkBottom < height*0.3){
    exploded = true
    sidewalkBottom = rangePercent(scrollPercent,height*0.5333,height*0.7)
    sidewalkDivider = 1
  }

  //layerLeft += scrollX


  let castleBackTop = coverMax+scrollOffsetBuilding/2+15 // Math.max(height*0.2,coverMax+scrollOffsetBuilding/2+15)

  const buildingLayerSpread = 0.22

  let layer1Bottom = coverMax < height * 0.3
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

  //console.log("scrollX",scrollX)

  const castleOffset = 0.2
  const castleScroll = scrollX*(0.9 - scrollPercent/100 * 0.1)


  let sky = ""
  if(showLOFI){

  }else{
    sky = (
      <Sky topPos={rangePercent(scrollPercent, -height * 0.2, 0)} />
    )
  }

  return (
    <Fragment>
      <Title topPos={height * 0.09 - scrollY / 3}>
        <div style={{ fontSize: "30pt" }}>B<span style={{ fontSize: "28pt" }}>UFFI</span>DAO</div>
        <div style={{lineHeight: "15pt", color:"#adadad",fontSize:"12pt"}}>ETHDENVER 2020</div>
      </Title>

      <Fixed style={{
        height: (height*screenRatio)-scrollY,
        width: Math.min(displayWidth,(width-1)*1.8),
      }}>
        {sky}

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

          {denverBackground}

          <Layer
            index={layerCount++}
            img={castleFiles.castleBack}
            width={layerWidth}
            left={-width*castleOffset-castleScroll}
            top={castleBackTop}
            perspective={sidewalkPerspective}
          />

          {setLayerCount(50)}

          <Layer
            index={layerCount++}
            img={castleFiles._sidewalk_1}
            width={layerWidth}
            left={-width*castleOffset-castleScroll}
            top={6 + sidewalkBottom + scrollOffsetBuilding / sidewalkDivider}
            perspective={sidewalkPerspective}
          />

          {!exploded ? (
            <Layer
              index={layerCount++}
              img={castleFiles.floor1_preview}
              width={layerWidth}
              left={-width*castleOffset-castleScroll}
              top={layer1Bottom + scrollOffsetBuilding}
              perspective={sidewalkPerspective}
            />
          ) : (
            <Fragment>
              <Layer
                index={layerCount++}
                img={castleFiles.floor1}
                width={layerWidth}
                left={-width*castleOffset-castleScroll}
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
                left={-width*castleOffset-castleScroll}
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
                  left={-width*castleOffset-castleScroll}
                  top={stickPointLayer3 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                />
              )}

              {coverMax < stickPointLayer4 && (
                <Layer
                  index={layerCount++}
                  img={castleFiles.floor4}
                  width={layerWidth}
                  left={-width*castleOffset-castleScroll}
                  top={stickPointLayer4 + scrollOffsetBuilding}
                  perspective={sidewalkPerspective}
                />
              )}

              {coverMax < stickPointLayer5 && (
                <Layer
                  index={layerCount++}
                  img={!SHOWBOUNTIES ? castleFiles.floor5 : castleFiles.floor5_wtf}
                  width={layerWidth}
                  left={-width*castleOffset-castleScroll}
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
                  left={-width*castleOffset-castleScroll}
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
            left={-width*castleOffset-castleScroll}
            top={coverMax + scrollOffsetBuilding/2}
            perspective={sidewalkPerspective}
          />

        </div>
      </Fixed>

      <Scrollable
        ref={containerRef}
        onScroll={(e: any) => setScroll([e.target.scrollLeft, e.target.scrollTop])}
      >
        <div style={{
          zIndex:100,
          position:"absolute",
          width:width*2,
          overflow:"hidden",
          height: (height*screenRatio),
        }}>
        </div>
      </Scrollable>

      <img src={profile} style={{maxWidth:180,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1,position:"fixed",top:15,right:0}}></img>
      <img src={xpmeter} style={{maxWidth:130,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1,position:"fixed",top:69,right:0}}></img>
      <img src={valuehud} style={{maxWidth:130,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1,position:"fixed",top:10,left:0}}></img>

      <UIBar>
        <ScanButton />
      </UIBar>
    </Fragment>
  );
};

export default ScrollingGame;
