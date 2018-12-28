const c = require('ansi-colors');

export default class Logo {
    static data:string[] = [
        '',
        ' ██▓ ███▄ ▄███▓ ██▓███',
        '▓██▒▓██▒▀█▀ ██▒▓██░  ██▒',
        '▒██▒▓██    ▓██░▓██░ ██▓▒',
        '░██░▒██    ▒██ ▒██▄█▓▒ ▒',
        '░██░▒██▒   ░██▒▒██▒ ░  ░',
        '░▓  ░ ▒░   ░  ░▒▓▒░ ░  ░',
        ' ▒ ░░  ░      ░░▒ ░',
        ' ▒ ░░      ░   ░░',
        ' ░         ░',
        ''
    ];

    write() {
        Logo.data.map((row) => {
            console.log(c.green(row));
        });
    }
}