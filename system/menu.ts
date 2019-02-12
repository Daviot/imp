import { AutoloadModule } from "../models/config-modules";
import { Env } from "../models/env";

export default class Menu {
    menu: any = null;
    env: Env = null;

    constructor(env: Env) {
        if (this.menu == null) {
            this.menu = [];
        }
        if (env != null) {
            this.env = env;
        }
    }

    add(config, data) {
        const conf = new AutoloadModule(config);
        this.menu.push({ name: conf.name, config: conf, methods: data });
    }

    get(name: string) {
        return this.menu.find(item => {
            return item.name == name;
        });
    }

    allNames() {
        return this.menu.filter(m => m.name != null && m.name != '').map(m => m.name);
    }

    build() {
        const menuEntries = this.allNames(),
        term = require('terminal-kit').terminal,
        options = {
            selectedStyle: term.green,
            cancelable: true
        };

        term.singleLineMenu(menuEntries, options, (error, res) => {
            console.error('error', error)
            if(error != null && error.canceled == true) {
                term('end');
            }
            //term.clear();
            console.log(res);
            const module = this.get(res.selectedText);
            if(module != null && module.methods != null) {
                const keys = Object.keys(module.methods);
                console.log(keys);
            } else {
                this.env.echo('confused', `Module ${module.name} has no methods!`);
            }
            process.exit();
        });
    }
}
