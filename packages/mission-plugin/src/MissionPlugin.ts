import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import hardcodedMissions from './hardcodedMissions';
import Mission from './Mission';

export default class MissionPlugin implements Plugin {
  private url?: string;

  constructor(url?: string) {
    this.url = url;
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    const addMission = (mission: Mission) => pluginContext.addButton(`floor_${mission.floor}`, mission.title, null, {
      description: mission.task,
      logo: mission.image,
      xp: mission.xp,
      xCoord: mission.game_x_coord,
      yCoord: mission.game_y_coord,
      color: mission.color,
    });


    for (const mission of hardcodedMissions) {
      addMission(mission);
    }

    if (this.url) {
      const response = await fetch(this.url);
      const json = await response.json();

      for (const mission of json) {
        addMission(mission);
      }
    }
  }
}
