import { Env } from '../models/env';
import { Command } from '../models/method';
import { ImpModule, ImpModuleDataNode, ImpModuleDataNodeType, ImpModuleConfig } from '../models/module';
import { clone, getDateTime } from './helper';

export default class Menu {
    menu: ImpModuleDataNode[] = null;
    env: Env = null;

    constructor(env: Env) {
        if (this.menu == null) {
            this.menu = [];
        }
        if (env != null) {
            this.env = env;
        }
    }

    add(name, module) {
        const config: ImpModuleDataNode = this.getConfigOfModule(module);
        this.env.logger.log('menu', `module ${config.name} ${config.command}`);
        this.menu.push(config);
        // load the methods of the module
        if (module.methods != null && module.methods.length > 0) {
            for (const methodIndex in module.methods) {
                const origMethod = module.methods[methodIndex];
                if (origMethod.command != null && origMethod.command != 'default') {
                    let method: ImpModuleDataNode = clone(origMethod);
                    // build the command
                    method.command = this.combineChildWithParentKey(config.command, method.command);
                    // the function itself
                    method.func = module[origMethod.command];
                    // the context for the function
                    method.context = module;
                    method.type = ImpModuleDataNodeType.Method;
                    // to call the function the context must be applied
                    // method.func.apply(module);
                    this.menu.push(method);
                    this.env.logger.log('menu', `method ${method.name} ${method.command}`);
                }
            }
        }
    }

    getList(): string[] {
        return this.menu.filter(me => me != null && me.context != null).map(me => me.command);
    }
    getListConfig() {
        return this.menu
            .filter(me => me != null && me.context != null)
            .map(me => {
                if (me != null && me.func != null) {
                    delete me.func;
                }
                if (me != null && me.context != null) {
                    delete me.context;
                }
                return me;
            });
    }

    findCommand(input: string): ImpModuleDataNode | null {
        let result = this.getByCommand(input);
        if (result == null) {
            result = this.getByCommandAlias(input);
        }
        return result;
    }
    getByCommand(command: string) {
        if (command == null || this.menu == null || this.menu.length == 0) {
            return null;
        }
        return this.menu.find(me => me.command == command);
    }
    getByCommandAlias(command: string) {
        if (command == null || this.menu == null || this.menu.length == 0) {
            return null;
        }
        return this.menu.find(me => {
            //console.log(me)
            // find the first menu with the command as alias
            if ((<any>me).aliases == null || (<any>me).aliases.length == 0) {
                return false;
            }
            const result = (<any>me).aliases.find(alias => alias === command);
            return result != null && result.length > 0;
        });
    }
    find(search: string): ImpModuleDataNode[] | null {
        if (search == null || this.menu == null || this.menu.length == 0) {
            return null;
        }
        const fuzzy = this.menu.filter(me => {
            return (
                me.command.toLowerCase().indexOf(search) >= 0 ||
                me.name.toLowerCase().indexOf(search) >= 0 ||
                (me.description != null && me.description.toLowerCase().indexOf(search) >= 0)
            );
        });
        return fuzzy;
    }

    getConfigOfModule(module: ImpModule): ImpModuleDataNode {
        if (module == null) {
            return null;
        }
        let config = <any>module.getConfigAll();
        config.context = module;
        if ((<any>module).default != null) {
            config.func = (<any>module).default;
        }
        config.type = ImpModuleDataNodeType.Module;
        return config;
    }

    combineChildWithParentKey(parent: string, child: string) {
        return `${parent}:${child}`;
    }

    allNames() {
        return this.menu.filter(m => m.name != null && m.name != '').map(m => m.name);
    }

    execute(command: ImpModuleDataNode) {
        if (command == null || command.func == null || command.context == null) {
            this.env.logger.log('menu/execute', `somethings empty ${JSON.stringify(command)}`);
            return;
        }
        this.env.logger.log('menu/execute', `${command.command}(${command.type})`);
        let result = null;
        const args = [
            () => {
                this.final(`${command.command}(type:${command.type})`);
            }
        ];
        try {
            switch (command.type) {
                case ImpModuleDataNodeType.Module:
                    return command.func.apply(command.context, args);
                    break;
                case ImpModuleDataNodeType.Method:
                    return command.func.apply(command.context, args);
                    break;
                default:
                    throw `Unknown node type ${command.type} of ${command.name}`;
            }
        } catch (e) {
            console.log(e);
            this.quit();
        }
    }

    final(msg: string) {
        this.env.logger.log('menu/final', '');
        this.env.event.emit('imp:module:executed', msg);
        this.quit();
        // @todo allow restart of the app
        /*if (!this.env.config.restartImp) {
            this.quit();
        }
        this.env.config.restartImp = false;
        this.env.event.emit('imp:restart');*/
    }
    quit() {
        this.env.logger.log('menu/quit', '');
        this.env.logger.log('app', `stopped ${getDateTime(new Date())}`);
        this.env.logger.log('app', `running ${new Date().getTime() - this.env.config.runningSince.getTime()}`);
        setTimeout(() => {
            process.exit();
        }, 10);
    }
}
