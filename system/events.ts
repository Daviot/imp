import { Env } from '../models/env';
import Menu from './menu';
import { timingSafeEqual } from 'crypto';
import AutoComplete from './auto-complete';
import Autoloader from './autoloader';
import { on } from 'cluster';
import Params from './params';

export default class Events {
    env: Env;
    constructor(env: Env) {
        this.env = env;

        this.env.event.on('imp:quit', () => {
            this.env.event.emit('imp:menu:quit');
        });

        this.env.event.on('imp:restart', () => {
            this.env.event.emit('imp:auto-complete:start', false);
        });
    }

    autoloader(autoloader: Autoloader) {
        this.env.event.on('imp:module:load:before', name => {
            console.log(`[autoloader] before ${name}`);
        });
        this.env.event.on('imp:module:load', name => {
            console.log(`[autoloader] load ${name}`);
        });
        this.env.event.on('imp:module:load:after', module => {
            console.log(`[autoloader] after ${module.name}`);
        });
        this.env.event.on('imp:module:load:all', modules => {
            console.log(`[autoloader] ${modules.length} modules loaded`);
        });
    }

    menu(menu: Menu) {
        // bind events for the menu
        this.env.event.on('imp:module:load:after', data => {
            // build the menu entry for the new loaded module
            //console.log('menu', data);
            if (data != null) {
                if (data.name != null && data.data != null) {
                    menu.add(data.name, data.data);
                } else {
                    console.error('wrong data in menu callback', data);
                }
            } else {
                console.error('empty menu callback, somethings gone terrible wrong');
            }
        });
        this.env.event.on('imp:module:load:all', async modules => {
            // create auto complete
            const commandList = menu.getList();
            const autoComplete = new AutoComplete(this.env, commandList, menu);
            const params = new Params(this.env, menu, autoComplete);
            // console.log(process.argv);
            await params.execute();
            // process.exit();
            this.autoComplete(autoComplete);
        });
        this.env.event.on('imp:module:all', (callback: Function) => {
            if (callback != null && typeof callback == 'function') {
                callback(menu.getListConfig());
            }
        });

        this.env.event.on('imp:menu:quit', () => {
            menu.quit();
        });
    }

    autoComplete(autoComplete: AutoComplete) {
        this.env.event.on('imp:auto-complete:init', (firstCall: boolean) => {});
        this.env.event.on('imp:auto-complete:start', (firstCall: boolean) => {
            autoComplete.build(null, null, firstCall);
        });
        this.env.event.emit('imp:auto-complete:start', true);
    }
}
