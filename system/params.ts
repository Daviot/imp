import Menu from './menu';
import { ImpModuleDataNode } from '../models/module';
import { Env } from '../models/env';
import AutoComplete from './auto-complete';

/**
 * Handles Cli Arguments aka Parameters and execute them based on the loader modules
 */
export default class Params {
    constructor(private env: Env, private menu: Menu, private autoComplete: AutoComplete) {}

    getParams() {
        if (process.argv.length < 2) {
            console.error('Arguments not valid');
            process.exit();
        }
        // remove the first 2 arguments, first is environment and second is the scriptname
        return process.argv.slice(2).map(arg => {
            // remove the - or -- for the params to get the correct value
            return arg.replace(/^-*(.*)/gi, '$1');
        });
    }

    async execute() {
        const params = this.getParams();
        if (params != null && params.length == 0) {
            return;
        }
        const validParams = params.map(p => this.find(p)).filter(p => this.validate(p));
        console.log('[params]', `Given params "${params.join('", "')}"`);
        console.log('[params]', `Valid params "${validParams.join('", "')}"`);
        if (validParams.length == 0) {
            this.env.echo('sad', `Unknown params ${params.join(', ')}`);
            // try to search if any command can found for the given commands
            params.map(param => {
                this.autoComplete.next(null, param);
            });
            return;
        }

        // @todo bug only the first execution has func and context correct set, all other have empty properties
        const executeParams = validParams.slice(0, 1);
        // execute the commands in the given order
        executeParams.map(command => {
            this.menu.execute(command)
        });
        // execute only this commands and then exit imp
        process.exit();
    }

    find(param: string) {
        const result = this.menu.findCommand(param);
        console.log(result);
        return result;
    }

    validate(data: ImpModuleDataNode) {
        return data != null && data.command != null;
    }
}
