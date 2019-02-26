import { Env } from './env';

export class ImpModuleData {
    name: string;
    command: string;
    func: Function;

    constructor(name = null, command = null) {
        this.name = name;
        this.command = command;
    }
}
export class ImpModuleConfig extends ImpModuleData {
    module: string;
    path: string;
    description: string;
    aliases: string[];
    nodes: ImpModuleConfig[] | ImpModule[];
}
export class ImpModule {
    methods: ImpModuleMethod[];
    constructor(protected config: ImpModuleConfig, protected env: Env) {
        if(this.methods == null) {
            this.methods = [];
        }
    }

    getConfig(key: string) {
        if (key == null || key == '') {
            return null;
        }
        if (this.config == null) {
            return null;
        }
        if (!this.config.hasOwnProperty(key)) {
            return null;
        }
        return this.config[key];
    }
}

export class ImpModuleMethod {
    name: string;
    command: string;
    aliases: string[];
    constructor(data) {
        if(data.name != null) {
            this.name = data.name;
        }
        if(data.aliases != null) {
            this.aliases = data.aliases;
        }
        if(data.command != null) {
            this.command = data.command;
        }
    }
}