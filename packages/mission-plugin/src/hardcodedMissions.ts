import Mission from './Mission';
import fortmatic from './images/fortmatic.png';
import npcscan from './images/npcscan.png';
import frontdesk from './images/frontdesk.png';
import owocki from './images/owocki.png';

const missions: Mission[] = [
  {
    image: fortmatic,
    title:"Fortmatic",
    color:"#6951ff",
    task:"Login with Fortmatic to claim BuffiDAI!",
    xp:"50",
    game_x_coord:2,
    game_y_coord:3,
    button:true,
    floor: 1,
  },

  {
    image: npcscan,
    title:"Scan In",
    color:"#57877b",
    task:"Scan your badge for first XP!",
    xp:"25",
    game_x_coord:1,
    game_y_coord:2,
    button: false,
    floor: 1,
  },

  {
    image: frontdesk,
    title:"Front Desk",
    color:"#577b87",
    task:"Get your badge and swag bag!",
    xp:"0",
    game_x_coord:1,
    game_y_coord:1,
    button: false,
    floor: 1,
  },

  {
    image: owocki,
    title:"Bullrun Owocki",
    color:"#ff0000",
    task:"Talk OSS with Owocki!",
    xp:"50",
    game_x_coord:3,
    game_y_coord:3,
    button: false,
    floor: 2,
  },
];

export default missions;
