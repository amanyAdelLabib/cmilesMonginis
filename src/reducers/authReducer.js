import {
  BRAND_NAME_CHANGED,
  BRANCH_NAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  INITIAL_SCREEN,
  USER_SAVED,
  USER_NOT_SAVED,
  USER_URL,
} from '../actions/types';

const INITIAL_STATE = {
  branchName: null,
  syncStorageStatus: null,
  brandName: null,
  userData: null,
  password: null,
  errMsg: null,
  loading: null,
  secretKey: null,
  secretUrl: null,
  userDataSaved: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_SAVED: {
      console.log('action branch secret key');
      console.log(action.payload);
      return {...state, secretKey: action.payload};
    }
    case USER_URL: {
      console.log('action url secret key');
      console.log(action.payload);
      return {...state, secretUrl: action.payload};
    }
    case BRANCH_NAME_CHANGED: {
      console.log('action branch');
      console.log(action.payload);
      return {
        ...state,
        branchName: action.payload,
        loading: null,
        errMsg: null,
      };
    }
    case BRAND_NAME_CHANGED: {
      console.log('action brand');
      console.log(action.payload);
      return {...state, brandName: action.payload, loading: null, errMsg: null};
    }
    case PASSWORD_CHANGED: {
      console.log('action password');
      console.log(action.payload);
      return {...state, password: action.payload, loading: null, errMsg: null};
    }
    case LOGIN_USER_SUCCESS:
      console.log('success');
      console.log(action.payload);
      return {
        ...state,
        userData: action.payload.data,
        // secretKey: action.payload.data.secret,
        loading: true,
      };
    case LOGIN_USER_FAILED: {
      console.log(action.payload.msg.errors == 'Wrong password');

      if (action.payload.msg.msg == 'Wrong password') {
        return {
          ...state,
          errMsg: action.payload.msg.msg,
          loading: false,
          branchName: null,
          brandName: null,
          userData: null,
          password: null,
        };
      } else {
        return {
          ...state,
          errMsg: 'all fields are required',
          loading: false,
          branchName: null,
          brandName: null,
          userData: null,
          password: null,
          // errMsg: null,
        };
      }
    }

    default:
      return state;
  }
};
