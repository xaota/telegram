const {of, merge, fromEvent} = rxjs;
const {map} = rxjs.operators;

export function formatDate(_date, short) {
    const date = new Date(Number(_date));
    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (short) {
        return `${monthNames[monthIndex]} ${day}`;
    }
    return `${monthNames[monthIndex]} ${day}, ${year} at ${hours}:${minutes}`;
}

export function dateDay(date = new Date()) {
    date = new Date(Number(date));
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function(...args) {
        function later() {
            timeout = null;
            if (!immediate) func.apply(this, args);
        }
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

export function buildInput$(inputNode) {
    return merge(of(""), fromEvent(inputNode, 'input')).pipe(map(R.pathOr("", ['detail', 'value'])));
}

export const wrapAsObjWithKey = R.pipe(
  R.lensProp,
  R.partialRight(R.set, [R.__, {}])
);
