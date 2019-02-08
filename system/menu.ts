import { AutoloadModule } from "../models/config-modules";

export default class Menu {
    menu: any = null;

    constructor() {
        if (this.menu == null) {
            this.menu = [];
        }
    }

    add(config, data) {
        const conf = new AutoloadModule(config);
        this.menu.push({ name: conf.name, config: conf, data: data });
    }

    get(name: string) {
        return this.menu.find(item => {
            return item.data.module == name;
        });
    }

    allNames() {
        return this.menu.filter(m => m.name != null && m.name != '').map(m => m.name);
    }
}
