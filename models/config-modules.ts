export class AutoloadModule {
    name: string;
    module: string;
    description: string;

    constructor(config: string| AutoloadModule) {
        if(typeof config == 'string') {
            this.name = config;
            this.module = config.toLowerCase();
            this.description = '';
        } else {
            this.name = config.name;
            this.module = config.module;
            this.description = config.description;
        }
    }
}
export class ModuleConfig {
    autoload: AutoloadModule[];
}