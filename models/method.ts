import { AutoloadModule } from "./config-modules";
import { ImpModuleConfig } from "./module";

export class MethodResult {
    method: Function;
    config: AutoloadModule;
    bestMatches: string[];

    constructor(method, config, bestMatches: string[] = null) {
        this.method = method;
        this.config = new AutoloadModule(config);
        this.bestMatches = bestMatches;
    }
}

export class Command {
    name: string;
    aliases: string[];
    method: Function;
    
    constructor(name, method, aliases:string[] = null) {
        this.name = name;
        this.method = method;
        this.aliases = aliases;
    }
}