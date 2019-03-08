export default class Interfaces {
    terminal;
    constructor(terminal) {
        this.terminal = terminal;
    }
    commandList(list, highlight = null) {
        this.terminal('\n');
        for (let i in list) {
            const entry = list[i];
            let output = [`${this.highlight(entry.command, this.terminal.str.bold.green, highlight)}`];
            if (entry.description != null) {
                output.push(
                    `  ${this.highlight(entry.name, this.terminal.str.styleReset, highlight)} ${this.highlight(
                        entry.description,
                        this.terminal.str.dim,
                        highlight
                    )}`
                );
            } else {
                output.push(`  ${this.highlight(entry.name, this.terminal.str.styleReset, highlight)}`);
            }
            output.push('');
            this.terminal(output.join(this.terminal.str.defaultColor('\n')));
        }
        this.terminal('\n');
    }

    highlight(text, styling, highlight = null) {
        if (highlight == null) {
            return styling(text);
        }
        const regex = new RegExp(`${highlight}`, 'gi');
        const split = text.replace(regex, highlight.toLowerCase()).split(highlight);
        if (split.length == 1) {
            return styling(text);
        }
        return split.map(part => styling(part)).join(this.terminal.str.bgCyan.black(highlight));
        //return styling('') + text.replace(regex, `${this.terminal.str.bgGreen.black(highlight)}${styling('')}`);
    }
}
