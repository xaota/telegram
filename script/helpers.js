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

/**
 * @param {Number} timestamp - timestamp from telegram
 * @return {Date}
 */
export function tgDate(timestamp) {
    return dateDay(timestamp * 1000);
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
const fromPromise = rxjs.from;

/**
 * @param {*} inputFileLocation - telegrams inputFileLocation object
 * @param {Object} options - options that could be passed for downloading
 * @param {Boolean} [cancelable] - allow to cancel downloading
 * @returns {Observable<*>|[Observable<*>, Function]} - stream of downloaded file or tuple with stream anc
 * cancel function
 */
export function downloadFile$(inputFileLocation, options = {}, cancelable) {
  const {promise, cancel} = telegram.download(inputFileLocation, options);
  const promise$ = fromPromise(promise);
  return cancelable ? [promise$, cancel] : promise$;
}

export function createUrl(file) {
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(file);
}
