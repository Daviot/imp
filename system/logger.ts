import { ImpModule } from '../models/module';
import { getType, DataTypes, getDate } from './helper';

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
                (date.getTime() - this.last.getTime())
            )
        );
        this.last = new Date();
    }

    getText(date, ctx, msg, duration) {
        return `(${date}) [${ctx}]\t${this.convertTextToLogText(msg)}\t${duration}\n`;
    }

    convertTextToLogText(data, level = 0) {
        const type = getType(data);
        if(level > 2) {
            return `"<data-type-${type}>"`;
        }
        switch (type) {
            case DataTypes.Boolean:
                return `"${(<Boolean>data).toString()}"`;
            case DataTypes.String:
            case DataTypes.Number:
                return (<String | Number>data).toString();
            case DataTypes.Date:
                return `"${getDate(<Date>data)}"`;
            case DataTypes.Array:
                const arrData = data.map((entry)=> {
                    return this.convertTextToLogText(entry, level+1);
                });
                return `[${arrData.join(',')}]`;
            case DataTypes.Object:
                const keys = Object.keys(data);
                let output = [];
                keys.map((key)=> {
                    if(output.length != 0) {
                        output.push(',');
                    }
                    output.push(`${key}:${this.convertTextToLogText(data[key], level+1)}`);
                });
                return `{${output.join('')}}`;
                //return `{${arrData.join(',')}}`;
            case DataTypes.Function:
                const result = (data + '').match(/^(.*)\(.*$/);
                if (result == null || result.length < 2) {
                    return '';
                }
                const name = result[1].replace('function ', '').trim();
                return `"<function ${name}>"`;
            case DataTypes.Null:
                return 'null';
        }
        return '-';
    }

    
}
