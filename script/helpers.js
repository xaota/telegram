export function formatDate(_date, short) {
    const date = new Date(+_date);
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
    date = new Date(+date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
