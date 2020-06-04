export const apiErrorCode = {
  seeOther: 303,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  notAcceptable: 406,
  flood: 420,
  internal: 500
};

/** {ApiError} Ошибки при работе с Telegram Api @class @export @default
  *
  */
  export default class ApiError extends Error {
  /** {ApiError} @constructor
    * @param {string} message
    * @param {number} code
    * @param {any} data
    */
    constructor(message, code, data = undefined) {
      super(message);
      // Error.captureStackTrace(this, ApiError)
      this.code = code;
      this.data = data;
      this.mode = ApiError.mode(this.code);
      this[this.mode] = true;
    }

  /** @return {string} */
    get text() {
      const data = this.data ? ` (${this.data})` : '';
      return `${this.code} / ${this.mode}: ${this.message}` + data;
    }

  /** 303: SEE_OTHER / seeOther @static */
    static seeOther(errorMessage) {
      const code = apiErrorCode.seeOther;
      const index = errorMessage.lastIndexOf('_');
      const message = errorMessage.substr(0, index - 1).replace(/_/g, ' ').trim();
      const data = errorMessage.substr(index);
      return new ApiError(message, code, data);
    }

  /** / @static */
    static badRequest(errorMessage) {
      const code = apiErrorCode.badRequest;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** / @static */
    static unauthorized(errorMessage) {
      const code = apiErrorCode.unauthorized;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** / @static */
    static forbidden(errorMessage) {
      const code = apiErrorCode.forbidden;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** / @static */
    static notFound(errorMessage) {
      const code = apiErrorCode.notFound;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** / @static */
    static notAcceptable(errorMessage) {
      const code = apiErrorCode.notAcceptable;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** 420: FLOOD / flood @static */
    static flood(errorMessage) {
      const message = 'FLOOD_WAIT';
      const code = apiErrorCode.flood;
      const data = parseInt(errorMessage.substr(11), 10);
      return new ApiError(message, code, data);
    }

  /** 500: INTERNAL / internal @static */
    static internal(errorMessage) {
      const code = apiErrorCode.internal;
      const message = errorMessage;
      return new ApiError(message, code);
    }

  /** @endsection {constructor} */
  /** / from @static */
    static from({errorCode, errorMessage}) {
      const mode = ApiError.mode(errorCode);
      return apiErrorCode[mode]
        ? ApiError[mode](errorMessage)
        : new ApiError(errorMessage, errorCode);
    }

  /** */
    static mode(code) {
      return Object
        .entries(apiErrorCode)
        .filter(([key, value]) => value === code)
        .map(([key, value]) => key)[0];
    }
  }
