import { EventEmitter } from "events";

export class Env {
    event: EventEmitter;
    echo: any;
    packageJson: any;
    terminal: any;
    constructor(event, echo, packageJson, terminal) {
        this.event = event;
        this.echo = echo;
        this.packageJson = packageJson;
        this.terminal = terminal;
    }
}
