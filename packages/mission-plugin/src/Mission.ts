export default interface Mission {
  image?: string;
  title: string;
  color: string;
  task: string;
  xp: string | number;
  game_x_coord: number;
  game_y_coord: number;
  button: boolean;
  floor: number;
  link?: string;
}
