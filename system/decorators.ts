import { ImpModuleMethod } from "../models/module";

//https://blog.wizardsoftheweb.pro/typescript-decorators-introduction/

// indicates that the method with the decorator is callable as command
export function imp(data:any = null) {
    if(data == null) {
        data = {};
    }
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (target.methods == null) {
            target.methods = [];
        }
        let name = propertyKey;
        if(data.name != null && data.name != '') {
            name = data.name;
        }
        let module = propertyKey;
        if(data.module != null && data.module != '') {
            module = data.module;
        }
        console.log(module)
        target.methods.push(new ImpModuleMethod({name, module, aliases: data.aliases, command: data.command}));
    };
}
