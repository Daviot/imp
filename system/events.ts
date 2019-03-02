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
            console.log('before', name);
        });
        this.env.event.on('imp:module:load', name => {
            console.log('load', name);
        });
        this.env.event.on('imp:module:load:after', name => {
            console.log('after', name);
        });
        this.env.event.on('imp:module:load:all', modules => {
            console.log('all loaded');
            //console.log(Object.keys(modules[0]));
            console.log(modules[0]['methods']);
        });
    }

    menu(menu: Menu) {
        // bind events
        this.env.event.on('imp:module:loaded', data => {
            //console.log(data);
        });
        this.env.event.on('imp:module:load:after', data => {
            // build the menu entry for the new loaded module
            //console.log('menu', data);
            if(data != null) {
                if(data.name != null && data.data != null) {
                    menu.add(data.name, data.data);
                } else {
                    console.error('wrong data in menu callback', data);
                }
            } else {
                console.error('empty menu callback, somethings gone terrible wrong');
            }
        });
    }

    autoComplete(autoComplete: AutoComplete) {
        this.env.event.on('imp:auto-complete:start', () => {
            this.env.echo('amused', 'What can I do for you?');
            autoComplete.build();
        });
        this.env.event.on('imp:module:load:all', modules => {
            this.env.event.emit('imp:auto-complete:start');
        });
    }
}
