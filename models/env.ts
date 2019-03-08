import { EventEmitter } from "events";

export class Env {
    event: EventEmitter;
    echo: any;
    packageJson: any;
    terminal: any;
    logger: any;
    constructor(event, echo, packageJson, terminal, logger) {
        this.event = event;
        this.echo = echo;
        this.packageJson = packageJson;
        this.terminal = terminal;
        this.logger = logger;
    }
}
