export function convertToPhoneNumber(new_number:string|number): string|undefined{
    let tel: string;
    if (typeof new_number === "number") new_number = String(new_number);

    const regx = /^\(\d\d\d\)-?\d\d\d-?\d\d\d\d$/g;
    const regx2 = /^\d\d\d-?\d\d\d-?\d\d\d\d$/g;

    if (regx.test(new_number) && regx2.test(new_number)) {
        return new_number;
    };

    const regx3 = /^\d\d\d\d\d\d\d\d\d\d$/g;
    if (regx3.test(new_number)) {
        tel = `(${new_number.substring(0, 3)})-${new_number.substring(3, 6)}-${new_number.substring(6)}`;
        return tel;
    }
}

export function capitalize(str: string) {
    const sentence: string[] = str.split(' ');
    const newSentence = sentence.map(word => {
        return `${word.charAt(0).toUpperCase()}${word.substring(1)}`
    });
    return newSentence.reduce((prev, curr) => `${prev} ${curr}`);
}
export function formatDate(date: string | Date | number) {
    const date_ = new Date(date);

    return `${date_.getFullYear()}-${`${date_.getMonth() + 1}`.padStart(2, '0')}-${`${date_.getDate()}`.padStart(2, '0')}`
}
export function checkNumber(num: string|number): number {
    // console.log('checking number...');

    const numberVal = Number(num);
    return isNaN(numberVal) ? 0 : numberVal;
}

export default {
    checkNumber,
    formatDate,
    capitalize,
    convertToPhoneNumber,
}