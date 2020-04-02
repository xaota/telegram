const {dispatch} = store;

import {
  AUTH_SEND_CODE,
  AUTH_SEND_CODE_ERROR,
  AUTH_SEND_CODE_SUCCESS,
  CLEAR_AUTH_STATE,
  SET_AUTHORIZATION_DATA,
  SIGN_UP,
  SIGN_UP_ERROR,
  VERIFY_CODE,
  VERIFY_CODE_ERROR,
  SEND_PASSWORD,
  SET_PASSWORD_ERROR
} from './constants.js';

export const sendAuthCode = R.partial(dispatch, [AUTH_SEND_CODE]);
export const sendAuthCodeError = R.partial(dispatch, [AUTH_SEND_CODE_ERROR]);
export const sendAuthCodeSuccess = R.partial(dispatch, [AUTH_SEND_CODE_SUCCESS]);
export const sendVerifyCode = R.partial(dispatch, [VERIFY_CODE]);
export const sendVerifyCodeError = R.partial(dispatch, [VERIFY_CODE_ERROR]);
export const setAuthorizationData = R.partial(dispatch, [SET_AUTHORIZATION_DATA]);
export const clearAuthState = R.partial(dispatch, [CLEAR_AUTH_STATE]);
export const signUp = R.partial(dispatch, [SIGN_UP]);
export const signUpError = R.partial(dispatch, [SIGN_UP_ERROR]);
export const sendPassword = R.partial(dispatch, [SEND_PASSWORD]);
export const setPasswordError = R.partial(dispatch, [SET_PASSWORD_ERROR]);
