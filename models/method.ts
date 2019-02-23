import { AutoloadModule } from "./config-modules";

export class MethodResult {
    method: Function;
    config: AutoloadModule;

    constructor(method, config) {
        this.method = method;
        this.config = new AutoloadModule(config);
    }
}