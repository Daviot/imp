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
        target.methods.push(new ImpModuleMethod({name: propertyKey, aliases: data.aliases, command: data.command}));
    };
}
