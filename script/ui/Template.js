function raw(args) {
  return String.raw(...args).trim();
}

export function html(...args) {
  return new DOMParser()
    .parseFromString(raw(args), "text/html")
    .getElementsByTagName('template')[0];
}

export function css(...args) {
  return raw(args);
}

export function url(url, base = import.meta.url) {
  return new URL(url, base).href;
}
