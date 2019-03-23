export function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
export function getType(obj: any) {
    const objectName = Object.prototype.toString.call(obj).trim();
    const result = objectName.match(/^\[object (\w+)\]$/);
    if(result != null) {
        const index = DataTypes[result[1]];
        if(index != null) {
            return index;
        }
        // unknown type
        return DataTypes.Null;
    }
    return DataTypes.Null;
}
export function getDateTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
export function getDateDay(date: Date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
export function getDate(date: Date) {
    return `${this.getDateDay(date)} ${this.getDateTime(date)}`;
}

export enum DataTypes {
    Null,
    Boolean,
    String,
    Number,
    Array,
    Date,
    Object,
    Function
}