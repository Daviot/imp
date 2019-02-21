import { AutoloadModule } from './../models/config-modules';
import Emoji from '../ui/emoji';
import { Env } from '../models/env';
export default class Autoloader {
    constructor(jetpack, config_modules, env: Env) {
        const cwd = jetpack.cwd();
        const modules = {};

        if (config_modules != null) {
            if (config_modules.hasOwnProperty('autoload')) {
                // load all given modules
                config_modules.autoload.map((config: string | AutoloadModule) => {
                    const module = new AutoloadModule(config);
                    const modulePath = `${cwd}/modules/${module.module.toLowerCase()}/index`;
                    // load and call the module
                    if (jetpack.exists(modulePath + '.ts') || jetpack.exists(modulePath + '.js')) {
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
                });
            }
        }
        return modules;
    }
}
