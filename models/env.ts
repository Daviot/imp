import { EventEmitter } from "events";

export class Env {
    event: EventEmitter;
    echo: any;
    packageJson: any;
    terminal: any;
    workingDir: string;
    homeDir: string;
    logger: any;
    constructor(event, echo, packageJson, terminal, workingDir, homeDir, logger) {
        this.event = event;
        this.echo = echo;
        this.packageJson = packageJson;
        this.terminal = terminal;
        this.workingDir = workingDir;
        this.homeDir = homeDir;
        this.logger = logger;
    }
}
