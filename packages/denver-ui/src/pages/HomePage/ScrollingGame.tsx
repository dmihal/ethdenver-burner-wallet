import React, { useState, useEffect, useRef, Fragment } from 'react';
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

import mapFiles from '../../images/map';


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



const ScrollingGame = () => {
  const [scroll, setScroll] = useState([0, 0]);
  let [scrollX, scrollY] = scroll;

  const [coverMax, setCoverMax] = useState(10000);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [exploded, setExploded] = useState(false);

  let [containerRef, { height, width, }] = useDimensions();
  let displayWidth = width
  width = Math.min(MAXWIDTH,width)

  const screenRatio = 7/1
  const rightScrollBarOffset = 15
  let totalHeight = height*screenRatio
  let bottom = height+scrollY

  const overScrollToMakeFloorsAtTheTopShowUpBetter = 1.25

  useEffect(() => {
    console.log("INIT",scrollX,scrollY)
    setTimeout(()=>{
      console.log("LAGGED ACTION")

        console.log("SCROLL AT START IS THIS THE RIGHT WAY? WE NEED TO DETECT IMAGES LOADED")
        console.log("containerRef",containerRef)
        let scrollerThing = document.getElementById("scrollerThing")
        if(scrollerThing){
          if( scrollX==0 && scrollY==0 ){
            scrollerThing.scrollTo({
              top: 250,
              left: 120,
              behavior: 'smooth',
            });
          }
        }

    },500)
  }, []);

  useEffect(()=>{
    //console.log("CHECKING IN ON scrollY",scrollY,height,screenRatio,overScrollToMakeFloorsAtTheTopShowUpBetter)
    if(!height){
      setCoverMax(10000)
    }else{
      let scrollPercent = Math.floor(scrollY / height / screenRatio * 100 * overScrollToMakeFloorsAtTheTopShowUpBetter)//Math.round(scrollY / (totalHeight-height) * 100)
      if(!scrollPercent) scrollPercent = 0
      scrollPercent = Math.max(scrollPercent,0)
      scrollPercent = Math.min(scrollPercent,100)
      let coverMax = rangePercent(scrollPercent, height*0.8, -height);

      setScrollPercent(scrollPercent)
      //console.log("coverMax",coverMax)
      setCoverMax(coverMax)

      if(coverMax < height*HEIGHT_TO_EXPLODE_AT){
        console.log("YEEEESSS")
        setExploded(true)

        let amount = width/2

        setTimeout(()=>{
          window.scrollTo({
            top: 3000,
            left: width*0.777,
            behavior: 'smooth',
          });
        },900)

      }
    }

  },[scrollY])




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

  let denverBackground: React.ReactNode | null = null;

  let fullLayerWidth = rangePercent(scrollPercent,displayWidth*2,displayWidth*1.1)
  fullLayerWidth = Math.min(fullLayerWidth,1200)

  let mountainWidth = rangePercent(scrollPercent,displayWidth*1.6,displayWidth*1.1)
  let mountainsTop = rangePercent(scrollPercent,height*0.2,height*0.01)
  let mountainPerspective = rangePercent(scrollPercent,layerWidth*0.15,layerWidth*0.2)
  const mountainOverOpacity = scrollPercent > 80 ? 0.0 : Math.min(0.7,rangePercent(scrollPercent, 0, 10));
  const mountainDistance = 0.08 - scrollPercent/100 * 0.08
  let foothillsDistance = 0.16 - scrollPercent/100 * 0.16
  let foothillsTop = rangePercent(scrollPercent,height*0.1,-height*0.08)
  let foothillsPerspective = rangePercent(scrollPercent,layerWidth*0.05,layerWidth*0.2)
  let cityDistance = 0.6 - scrollPercent/100 * 0.3
  let cityWidth = fullLayerWidth *1.05
  let cityLeft = rangePercent(scrollPercent,layerWidth*0.08,layerWidth*0.05)
  let cityOffset = rangePercent(scrollPercent,-height*0.1,-height*0.05)
  let cityPerspective = rangePercent(scrollPercent,layerWidth*0.07,layerWidth*0.2)
  let cityTop = rangePercent(scrollPercent,height*0.2,height*0.02)
  let treesDistance = 0.8 - scrollPercent/100 * 0.2
  let treesTop = rangePercent(scrollPercent,height*0.70,height*0.2)
  let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)

  denverBackground = (
    <Fragment>
      <Layer
        index={layerCount++}
        img={mountainsFiles.undermountains}
        width={fullLayerWidth}
        left={-width*0.05-layerLeft - scrollX * mountainDistance}
        top={mountainsTop}
        perspective={mountainPerspective}
        opacity={rangePercent(scrollPercent,0.99,0.00)}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.mountainsFull}
        width={fullLayerWidth}
        left={-width*0.05-layerLeft - scrollX * mountainDistance}
        top={mountainsTop}
        perspective={mountainPerspective}
        opacity={rangePercent(scrollPercent,0.99,0.1)}
      />
      <Layer
        index={layerCount++}
        img={mountainsFiles.overmountains}
        width={fullLayerWidth}
        left={-width*0.05-layerLeft - scrollX * mountainDistance}
        top={mountainsTop}
        perspective={mountainPerspective}
        opacity={mountainOverOpacity}
      />

      <Layer
        index={layerCount++}
        img={mountainsFiles.foothills}
        width={fullLayerWidth*1.1}
        left={-width*0.3-layerLeft - scrollX * foothillsDistance}
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
        width={fullLayerWidth}
        left={rangePercent(scrollPercent, cityOffset-cityLeft-treesDistance*scrollX, -cityLeft)}
        top={treesTop}
        perspective={treesPerspective}
        scaleY={0.88}
        brightness={rangePercent(scrollPercent, 100, 20)}
      />

    </Fragment>
  )

  const sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)

  let scrollOffsetBuilding = -50

  let floors = []

  const STARTSCROLLINGAT = 65;

  if(scrollPercent > STARTSCROLLINGAT){
    let thisScroll = (scrollPercent-STARTSCROLLINGAT)*100/(100-STARTSCROLLINGAT)
    scrollOffsetBuilding += thisScroll*6.2
  }

  let sidewalkDivider = 2;


  const FLOOR_PADDING = 600
  let sidewalkBottom = coverMax
  let lowbound = height*0.4


  const displayMissions = (floor, missions)=>{
    console.log("displayMissions",floor, missions)
    let missionRender = []
    let missionList = []
    for( let m in missions ){
      let mission = missions[m]
      console.log("RENDERING MISSION",mission)
      missionRender.push(
        <div key={"image_"+floor+"_"+m}>
          <img style={{opacity:0.99,maxWidth:175,position:"absolute",right:346+mission.game_x_coord*106-mission.game_y_coord*69,bottom:238+mission.game_x_coord*21+mission.game_y_coord*43}} src={mapFiles[mission.image} />
        </div>
      )
      if(mission[7]){
        missionList.push(
          <div key={"questbutton_"+floor+"_"+m}>
            <QuestButton location={mission.title} color={mission.color} task={mission.task} xp={mission.xp} fn={mission.fn}/>
          </div>
        )
      }else{
        missionList.push(
          <div key={"questinfo_"+floor+"_"+m}>
            <QuestInfo location={mission.title color={mission.color} task={mission.task} xp={mission.xp} />
          </div>
        )
      }

    }
    return (
      <div>
        <div style={{position:"absolute",right:-width*0.9,bottom:400-missions.length*30,width:width*1.5}}>
          {missionList}
        </div>
        {missionRender}
      </div>
    )
  }

    const castleOffset = 0.2

  if(exploded){

    sidewalkBottom = rangePercent(scrollPercent,height*0.5333,height*0.7)
    sidewalkDivider = 1


    const MAP_JSON_LOADED_BY_USER_ADDRESS = [
      [
        {
          image:"fortmatic",
          title:"Fortmatic",
          color:"#6951ff",
          task:"Login with Fortmatic to claim BuffiDAI!",
          xp:"50",
          game_x_coord:2,
          game_y_coord:3,
          button:true,
          fn:()=>{alert("this is a function but here is an alert with some link haha https://dashboard.fortmatic.com/login")
        },
        {
          image:"npcscan",
          title:"Scan In",
          color:"#57877b",
          task:"Scan your badge for first XP!",
          xp:"25",
          game_x_coord:1,
          game_y_coord:2,
          button: false,
        },
        {
          image:"frontdesk",
          title:"Front Desk",
          color:"#577b87",
          task:"Get your badge and swag bag!",
          xp:"0",
          game_x_coord:1,
          game_y_coord:1,
          button: false,
        },
      ],
      [
        {
          image:"owocki",
          title:"Bullrun Owocki",
          color:"#ff0000",
          task:"Talk OSS with Owocki!",
          xp:"50",
          game_x_coord:3,
          game_y_coord:3,
          button: false,
        },
      ],
      [],//floor 3
      [],//floor 4
      [],//floor 5
      [],//floor 6
    ]


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
          {displayMissions(f, MAP_JSON_LOADED_BY_USER_ADDRESS[f-1])}
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
          left=[0}
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


  const castleScroll = scrollX*(0.9 - scrollPercent/100 * 0.1)

  let sky: React.ReactNode | null = null;
  sky = (
    <Sky topPos={rangePercent(scrollPercent, -height * 0.3, 0.05)} />
  )

//  <PegaBufficorn scale={Math.max(0.8,0.8*(displayWidth-width)/300)}  />
  return (
    <Fragment>
      <Title topPos={height * 0.12 - scrollY / 10}>
        <div style={{ fontSize: "30pt" }}>B<span style={{ fontSize: "28pt" }}>UFFI</span>DAO</div>
        <div style={{lineHeight: "7pt", color:"#adadad",fontSize:"12pt"}}>ETHDENVER 2020</div>
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



          <PegaBufficorn2 right={0-(displayWidth-width)/2+scrollX/7} top={rangePercent(scrollPercent, height * 0.2, -height * 0.5)}/>


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
              {floors}

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
        id={"scrollerThing"}
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

      {SHOWHUD?<HUD />:""}
    </Fragment>
  );
};

export default ScrollingGame;
