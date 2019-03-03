import { Env } from '../models/env';
import { Command } from '../models/method';
import { ImpModule, ImpModuleDataNode, ImpModuleDataNodeType } from '../models/module';
import { clone } from './helper';

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

    add(name, module) {
        const config: ImpModuleDataNode = this.getConfigOfModule(module);
        console.log(`[menu] module ${config.name} ${config.command}`);
        this.menu.push(config);
        // load the methods of the module
        if (module.methods != null && module.methods.length > 0) {
            for (const methodIndex in module.methods) {
                const origMethod = module.methods[methodIndex];
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
                console.log(`[menu] method ${method.name} ${method.command}`);
            }
        }
    }

    getList(): string[] {
        return this.menu.filter(me => me != null && me.context != null).map(me => me.command);
    }

    getByCommand(command: string) {
        if (command == null || this.menu == null || this.menu.length == 0) {
            return null;
        }
        return this.menu.find(me => me.command == command);
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
}
