import { AutoloadModule } from './../models/config-modules';
import Emoji from '../ui/emoji';
export default class Autoloader {
    constructor(jetpack, config_modules, env) {
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
                        env.echo('happy', `Load module ${modulePath}`);
                        const moduleConstructor = require(modulePath);
                        console.log(moduleConstructor);
                        if (moduleConstructor && moduleConstructor.hasOwnProperty('default')) {
                            modules[module.module] = moduleConstructor.default;
                            modules[module.module](config, env);
                        } else {
                            env.echo(
                                'confused',
                                `No default export available for the module ${module.name} -> ${modulePath}`
                            );
                        }
                    } else {
                        env.echo('confused', `Can't find file ${modulePath} for the module ${module.name}`);
                    }
                    //let demo = new About();
                    //import * as modules[module] from `./modules/${module.toLowerCase()}/index.ts`;
                });
            }
        }
        return modules;
    }
}
