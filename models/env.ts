import { EventEmitter } from 'events';

export class Env {
    event: EventEmitter;
    echo: any;
    packageJson: any;
    config: EnvConfig;
    terminal: any;
    workingDir: string;
    homeDir: string;
    logger: any;
    jetpack: any;
    constructor(event, echo, packageJson, config, terminal, workingDir, homeDir, logger, jetpack) {
        this.event = event;
        this.echo = echo;
        this.packageJson = packageJson;
        this.config = config;
        this.terminal = terminal;
        this.workingDir = workingDir;
        this.homeDir = homeDir;
        this.logger = logger;
        this.jetpack = jetpack;
    }
}
export class EnvConfig {
    restartImp: boolean = false;
}
