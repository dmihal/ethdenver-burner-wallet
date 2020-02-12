import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import hardcodedMissions from './hardcodedMissions';
import Mission from './Mission';

interface Options {
  refreshSeconds?: number;
}

export default class MissionPlugin implements Plugin {
  private context?: BurnerPluginContext;
  private url?: string;
  private dynamicRemoval: Array<() => void> = [];
  private refreshSeconds: number;

  constructor(url?: string, { refreshSeconds = 5 }: Options = {}) {
    this.url = url;
    this.refreshSeconds = refreshSeconds;
  }

  addMission(mission: Mission) {
    return this.context.addButton(`floor_${mission.floor}`, mission.title, null, {
      description: mission.task,
      logo: mission.image,
      xp: mission.xp,
      xCoord: mission.game_x_coord,
      yCoord: mission.game_y_coord,
      color: mission.color,
      link: mission.link,
    });
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;

    for (const mission of hardcodedMissions) {
      this.addMission(mission);
    }

    this.loadDynamicMissions();

    const load = () => setTimeout(async () => {
      try {
        await this.loadDynamicMissions();
      } catch (e) {
        console.error(e);
      } finally {
        load();
      }
    }, this.refreshSeconds * 1000);
    load();
  }

  async loadDynamicMissions() {
    if (this.url) {
      const web3 = this.context.getWeb3('100');
      const [account] = await web3.eth.getAccounts();

      const response = await fetch(`${this.url}?account=${account}`);
      const json = await response.json();

      this.reset();
      for (const mission of json) {
        const { remove } = this.addMission(mission);
        this.dynamicRemoval.push(remove);
      }
    }
  }

  reset() {
    for (const remove of this.dynamicRemoval) {
      remove();
    }
    this.dynamicRemoval = [];
  }
}
