import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import hardcodedMissions from './hardcodedMissions';
import Mission from './Mission';

interface Options {
  refreshSeconds?: number;
}

export default class MissionPlugin implements Plugin {
  private context?: BurnerPluginContext;
  private url?: string;
  private addedMissions: { [title: string]: boolean } = {};
  private refreshSeconds: number;

  constructor(url?: string, { refreshSeconds = 5 }: Options = {}) {
    this.url = url;
    this.refreshSeconds = refreshSeconds;
  }

  addMission(mission: Mission) {
    if (this.addedMissions[mission.title]) {
      return;
    }

    this.context.addButton(`floor_${mission.floor}`, mission.title, null, {
      description: mission.task,
      logo: mission.image,
      xp: mission.xp,
      xCoord: mission.game_x_coord,
      yCoord: mission.game_y_coord,
      color: mission.color,
    });

    this.addedMissions[mission.title] = true;
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;

    for (const mission of hardcodedMissions) {
      this.addMission(mission);
    }

    this.loadDynamicMissions();

    setInterval(() => this.loadDynamicMissions(), this.refreshSeconds * 1000);
  }

  async loadDynamicMissions() {
    if (this.url) {
      const response = await fetch(this.url);
      const json = await response.json();

      for (const mission of json) {
        this.addMission(mission);
      }
    }
  }
}
