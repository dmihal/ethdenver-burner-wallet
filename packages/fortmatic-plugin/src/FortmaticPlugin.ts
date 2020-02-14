import { BurnerPluginContext, Plugin, Actions } from '@burner-wallet/types';
import FortmaticStatusBar from './ui/FortmaticStatusBar';
import FortmaticSettings from './ui/FortmaticSettings';
import tile from '../fortmatic-tile.png';

export default class FortmaticPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', FortmaticStatusBar);
    pluginContext.addElement('advanced', FortmaticSettings);

    // @ts-ignore
    // pluginContext.addButton('floor_1', 'Fortmatic', null, {
    //   description: 'Login with Fortmatic to claim BuffiDAI!',
    //   logo: tile,
    //   xp: 50,
    //   xCoord: 2,
    //   yCoord: 3,
    //   color: "#6951ff",
    //   floor: 1,
    //   onClick: (actions: Actions) => actions.callSigner('enable', 'fortmatic'),
    // });
  } 
}
