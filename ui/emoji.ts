export default class Emoji {
    static data = {
        normal: '(°-°)',
        confused: '(°~°)',
        shocked: '(°O°)',
        amused: '(^^-^^)',
        happy: '(^^ᴗ^^)',
        sad: '(ᴗ_ᴗ)',
        dead: '(×_×)'
    };

    get(name: string, raw: boolean = false) {
        let val = Emoji.data.normal;
        if (name != null) {
            if (Emoji.data.hasOwnProperty(name)) {
                val = Emoji.data[name];
            }
        }
        if(raw) {
            val = val.replace(/\^\^/g, '^');
        }
        return val;
    }

    keys() {
        return Object.keys(Emoji.data);
    }

    normal() {
        return this.get('normal');
    }
    confused() {
        return this.get('confused');
    }
    shocked() {
        return this.get('shocked');
    }
    amused() {
        return this.get('amused');
    }
    happy() {
        return this.get('happy');
    }
    sad() {
        return this.get('sad');
    }
    dead() {
        return this.get('dead');
    }
}
