import { AutoloadModule } from '../models/config-modules';
import { Env } from '../models/env';
import { Command } from '../models/method';

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
        return this.getChild(this.menu, name);
    }

    getChild(parent: any, name: string) {
        if (parent == null) {
            return null;
        }
        return parent.find(item => {
            return item.name == name;
        });
    }

    getList(): Command[] {
        let list = [];
        //console.log('getlist')
        //console.log(this.menu);
        this.menu.map((menuEntry)=> {
            const partial = this.buildList(menuEntry.methods, menuEntry.config.module);
            list.push(...partial);
        });
        return list;
    }

    buildList(parent, parentName): Command[] {
        let partial:Command[] = [];
        if(parent.hasOwnProperty('_')) {
            partial.push(new Command(parentName, parent._));
        }
        const keys = Object.keys(parent);
        keys.filter(key => key != '_').map((key)=> {
            // is a callable function, finish
            if(typeof parent[key] == 'function') {
                partial.push(new Command(this.combineChildWithParentKey(parentName,key), parent[key]))
            }
            if(typeof parent[key] == 'object') {
                const partialChild = this.buildList(parent[key], this.combineChildWithParentKey(parentName,key));
                partial.push(...partialChild);
            }
        });
        return partial;
    }

    combineChildWithParentKey(parent: string, child: string) {
        return `${parent}:${child}`
    }

    allNames() {
        return this.menu.filter(m => m.name != null && m.name != '').map(m => m.name);
    }

    build(menuEntries = null, menu = null, options = null) {
        // when nothing is available try to get menu
        if (menuEntries == null) {
            menuEntries = this.allNames();
        }
        if (menu == null) {
            menu = this.menu;
        }
        // check if something is available
        if (menuEntries == null || menuEntries.length == 0) {
            this.env.echo('dead', 'No menu entries available');
            process.exit();
        }
        // default options
        if (options == null) {
            options = {
                selectedStyle: this.env.terminal.green,
                cancelable: true
            };
        }

        this.env.terminal.singleLineMenu(menuEntries, options, (error, res) => {
            this.selected(error, res, menu);
        });
    }

    selected(error, res, menu) {
        this.env.terminal.clear();
        // error appears
        if (error != null) {
            this.env.terminal.red(error);
        }
        // stop when selection was canceled
        if (res.canceled == true) {
            this.env.echo('dead', `U canceled, bye`);
            process.exit();
        }

        if (menu == null) {
            this.env.echo('dead', `No menu to choose from`);
            process.exit();
        }
        // get the selected module
        const module = this.getChild(menu, res.selectedText);

        if (module != null && module.methods != null) {
            const keys = Object.keys(module.methods);

            // check if default method is available and call it
            if (typeof module.methods == 'function') {
                module.methods(this.env);
            }
            if (keys.indexOf('_') >= 0) {
                module.methods._(this.env);
            }
            //console.log(menu);
            // build the submenu when available
            let subMenuKeys = keys.filter(k => {
                return k != '_';
            });
            const subMenu = subMenuKeys.map(k => {
                let mod = module.methods[k];
                let modName = `${module.config.module}:${k}`;
                let description = mod._description ? mod._description : '';
                let methods = null;
                switch ((typeof mod).toLowerCase()) {
                    case 'function':
                        methods = mod;
                        break;
                    case 'object':
                        // only the default is available
                        if (mod.hasOwnProperty('_')) {
                            methods = mod._;
                        }
                        // all properties starting with a _ are properties of the parent
                        const methodKeys = Object.keys(mod).filter(k => k.indexOf('_') != 0);
                        if (methodKeys.length > 0) {
                            // reset methods
                            methods = {};
                            // set default
                            if (mod.hasOwnProperty('_')) {
                                methods._ = mod._;
                            }
                            // set all other methods
                            methodKeys.map(mk => {
                                methods[mk] = mod[mk];
                            });
                        }
                        break;
                    default:
                        this.env.echo('shocked', `unknown type "${typeof mod}" of "${modName}"`);
                        break;
                }
                const data = {
                    name: k,
                    config: {
                        name: k,
                        description: description,
                        module: modName
                    },
                    methods: methods
                };
                return data;
            });
            // build the menu for the next level
            if (subMenuKeys.length > 0) {
                this.build(subMenuKeys, subMenu);
            } else {
                // when no submenu is available the work is done
                process.exit();
            }
        } else {
            this.env.echo('shocked', `Module ${module.name} has no methods!`);
            process.exit();
        }
    }
}
