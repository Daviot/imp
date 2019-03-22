import { ImpModule } from '../models/module';
import { Env } from '../models/env';

export class Logger {
    path: string;
    last: Date = null;
    constructor(private jetpack) {
        this.path = `${jetpack.cwd()}/.imp.log`;
        // clear old log file
        jetpack.write(this.path, '');
        console.log(`Log file: ${this.path}`);
        this.jetpack.append(this.path, this.getText('date', 'ctx', 'msg', 'duration'));
        this.last = new Date();
    }

    log(ctx: ImpModule | string | null, message: string | Object) {
        let prefix = '#';
        if (ctx != null) {
            if (typeof ctx == 'string') {
                prefix = ctx;
            } else {
                prefix = ctx.config.command;
            }
        }
        const date = new Date();
        this.jetpack.append(
            this.path,
            this.getText(
                `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                prefix,
                message,
                (date.getTime() - this.last.getTime()) / 1000
            )
        );
    }

    getText(date, ctx, msg, duration) {
        return `(${date}) [${ctx}]\t${typeof msg == 'string' ? msg : JSON.stringify(msg)}\t${duration}\n`;
    }
}
