import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import Leaderboard from './ui/Leaderboard';

export default class ThreeBoxEditProfilePlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/leaderboard', Leaderboard);
    pluginContext.addButton('apps', 'Leaderboard', '/leaderboard');
  } 
}
