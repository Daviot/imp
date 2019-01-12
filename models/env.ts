import { EventEmitter } from "events";

export class Env {
    event: EventEmitter;
    echo: any;
    package: any;
    constructor(event, echo, pack) {
        this.event = event;
        this.echo = echo;
        this.package = pack;
    }
}
