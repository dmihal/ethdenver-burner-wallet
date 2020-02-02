import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import hardcodedMissions from './hardcodedMissions';

export default class MissionPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    for (const mission of hardcodedMissions) {
      pluginContext.addButton(`floor_${mission.floor}`, mission.title, null, {
        description: mission.task,
        logo: mission.image,
        xp: mission.xp,
        xCoord: mission.game_x_coord,
        yCoord: mission.game_y_coord,
      });
    }
  } 
}
