import { Env } from '../models/env';
import Menu from './menu';
import { timingSafeEqual } from 'crypto';
import AutoComplete from './auto-complete';
import Autoloader from './autoloader';
import { on } from 'cluster';

export default class Events {
    env: Env;
    constructor(env: Env) {
        this.env = env;
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
        this.env.event.on('imp:module:load:all', modules => {
            // create auto complete
            const commandList = menu.getList();
            const autoComplete = new AutoComplete(this.env, commandList, menu);
            this.autoComplete(autoComplete);
        });
    }

    autoComplete(autoComplete: AutoComplete) {
        this.env.event.on('imp:auto-complete:start', () => {
            this.env.echo('amused', 'What can I do for you?');
            autoComplete.build();
        });
        this.env.event.emit('imp:auto-complete:start');
    }
}
