import { Env } from './env';

export class ImpModuleData {
    // name of the module
    name: string;
    // the value of the command to enter
    command: string;
    // the method when calling the module direct
    func: Function;

    constructor(name = null, command = null) {
        this.name = name;
        if (command == null) {
            this.command = name;
        } else {
            this.command = command;
        }
    }
}

export class ImpModuleDataNode extends ImpModuleData {
    context: Object;
    type: ImpModuleDataNodeType;
    description: string;
}
export class ImpModuleConfig extends ImpModuleData {
    // the module name this should be the unique identifier
    module: string;
    // the path to the main file to load the module, but without extension because of ts and js files
    path: string;
    // the description when help or some text is needed
    description: string;
    // aliases when calling the method, to handle typos or shortcuts
    aliases: string[];
    // the methods/function for this module
    nodes: ImpModuleConfig[];
}
export class ImpModule {
    // contains the whiole configuration of the module
    config: ImpModuleConfig;
    // the methods to call for this module
    methods: ImpModuleMethod[];
    constructor(config: ImpModuleConfig, protected env: Env) {
        if (this.methods == null) {
            this.methods = [];
        }
        if (config != null) {
            this.config = config;
        }
    }

    /**
     * returns the value for the given key in the config
     * @param key the key of the module config to get the value from
     */
    getConfig(key: string) {
        if (key == null || key == '' || this.config == null || !this.config.hasOwnProperty(key)) {
            return null;
        }
        return this.config[key];
    }

    getConfigAll() {
        return this.config;
    }

    /**
     * Sets the given key of the config with the value
     * @param key the key of the config value
     * @param value the new config value for the key
     */
    protected setConfig(key: string, value: any) {
        if (key == null || key == '' || this.config == null) {
            return false;
        }
        this.config[key] = value;
        return true;
    }

    /**
     * Validate the configuration and fill values that can be filled from existing values, to handle the default behaviour
     */
    protected validateConfig() {
        if (this.config == null) {
            return false;
        }
        // set command based on name
        if (this.config.name != null && this.config.command == null) {
            this.config.command = this.config.name.toLowerCase().trim();
        }
        // set module based on name
        if (this.config.name != null && this.config.module == null) {
            this.config.module = this.config.name.toLowerCase().trim();
        }
    }

    log(message: string | Object)  {
        this.env.logger.log(this, message);
    }
}

export class ImpModuleMethod {
    // name of the method
    name: string;
    // the command for this method
    command: string;
    // the aliases for this method
    aliases: string[];
    // the module name this should be the unique identifier
    module: string;
    constructor(data) {
        if (data.name != null) {
            this.name = data.name;
        } else {
            throw `Missing name for method\n${JSON.stringify(data)}`;
        }
        if (data.aliases != null) {
            this.aliases = data.aliases;
        }
        if (data.module != null) {
            this.module = data.module;
        } else {
            this.module = this.name.toLowerCase();
        }
        if (data.command != null) {
            this.command = data.command;
        } else {
            this.command = this.module;
        }
    }
}

export enum ImpModuleDataNodeType {
    Module,
    Method
}
