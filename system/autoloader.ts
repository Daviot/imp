import { Env } from '../models/env';
import { ImpModule, ImpModuleConfig } from '../models/module';
export default class Autoloader {
    modules: ImpModule[] = [];
    env: Env;
    modulesToLoad: number = 0;
    config: any;
    jetpack: any;
    constructor(jetpack, config, env: Env) {
        const cwd = jetpack.cwd();
        this.env = env;

        if (config == null) {
            env.echo('dead', 'No module configuration available');
        }
        if (!config.hasOwnProperty('load')) {
            env.echo('dead', 'No modules in module configuration available');
        }
        this.config = config;
        if (config.load.length == 0) {
            env.echo('dead', 'No modules in module configuration that should be loaded');
        }
        this.modulesToLoad = config.load.length;

        if (jetpack == null) {
            this.env.echo('dead', 'Missing jetpack module');
            process.exit();
        }
        this.jetpack = jetpack;
    }

    init() {
        this.config.load.map(m => this.load(m));
    }

    private async load(name: string): Promise<ImpModule> {
        this.env.event.emit('imp:module:load:before', name);
        if (this.jetpack == null) {
            this.env.echo('shocked', 'Missing module name');
            return null;
        }
        let config = new ImpModuleConfig();
        const modName = name.toLowerCase().split('/');
        if (modName.length == 0) {
            this.env.echo('shocked', `Wrong module name "${this.env.terminal.str.red(name)}"`);
            return null;
        }
        // set basic config values
        config.name = modName[modName.length - 1];
        config.module = name;
        config.path = `${this.jetpack.cwd()}/modules/${name}/index`;

        let moduleClass = null;
        // load and call the module
        if (this.jetpack.exists(config.path + '.ts') == 'file' || this.jetpack.exists(config.path + '.js') == 'file') {
            // load the module
            const moduleConstructor = await import(config.path);
            // initiate the new "class" with the parameters
            moduleClass = new moduleConstructor.default(config, this.env);
            this.modules.push(moduleClass);
            this.env.event.emit('imp:module:load', name);
        } else {
            this.env.echo(
                'shocked',
                `File for the module to load is missing "${this.env.terminal.str.red(config.path)}"`
            );
            return null;
        }
        this.modulesToLoad--;
        this.env.event.emit('imp:module:load:after', { name, data: moduleClass });
        // final callback
        if (this.modulesToLoad <= 0) {
            this.env.event.emit('imp:module:load:all', this.getModules());
        }
        /*
                        //env.echo('happy', `Load module ${modulePath}`);
                        const moduleConstructor = require(modulePath);
                        //console.log(moduleConstructor);
                        if (moduleConstructor && moduleConstructor.hasOwnProperty('default')) {
                            modules[module.module] = moduleConstructor.default;
                            modules[module.module](config, env);
                            env.event.emit('imp:module:loaded', module.module);
                        } else {
                            env.echo(
                                'confused',
                                `No default export available for the module ${module.name} -> ${modulePath}`
                            );
                        }
                    } else {
                        env.echo('confused', `Can't find file ${modulePath} for the module ${module.name}`);
                    }
                    */
    }

    getModules() {
        return this.modules;
    }
}
