
export function randomInt(min :number, max :number){
    let random = Math.random();
    while(random === 1) random = Math.random();
    return Math.floor(random * (max - min + 1)) + min;
}