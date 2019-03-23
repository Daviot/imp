import { EventEmitter } from 'events';
import { Logger } from '../system/logger';

export class Env {
    event: EventEmitter;
    echo: any;
    packageJson: any;
    config: EnvConfig;
    terminal: any;
    workingDir: string;
    homeDir: string;
    logger: Logger;
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
    runningSince = null;
    restartImp: boolean = false;
}
