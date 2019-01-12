export default class Emoji {
    static data = {
        normal: '(°-°)',
        confused: '(°~°)',
        shocked: '(°O°)',
        amused: '(^-^)',
        happy: '(^ᴗ^)',
        sad: '(ᴗ_ᴗ)',
        dead: '(×_×)'
    };

    get(name: string) {
        if (name != null) {
            if (Emoji.data.hasOwnProperty(name)) {
                return Emoji.data[name];
            }
        }
        return Emoji.data.normal;
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
