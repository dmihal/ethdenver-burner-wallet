import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import AchievementsPage from './ui/AchievementsPage';

export interface Achievement {
  title: string;
  description: string;
}

export default class BuilderPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/achievements', AchievementsPage);
  }

  async getAchievements(account: string) {
    return [
      { title: 'Show up', description: 'Congrats. You got here' },
      { title: 'Buy food', description: 'I guess you were hungry' },
    ];
  }
}
