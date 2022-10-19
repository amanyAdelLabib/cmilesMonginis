import {
  BRANCH_NAME_CHANGED,
  BRAND_NAME_CHANGED,
  COMMENT_SURVEY_CHANGED,
  GET_QUESTIONS_FAIL,
  GET_QUESTIONS_SUCCESS,
  LOGIN_USER_FAILED,
  LOGIN_USER_SUCCESS,
  PASSWORD_CHANGED,
  POST_SURVEY_SUCCESS,
  USER_SAVED,
  USER_URL,
  GET_COMMENT_SUCCESS ,
  GET_COMMENT_FAIL,
  FULLNAME_CHANGED ,
  NUMBER_CHANGED

} from './types';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import UserApi from '../service/userServices';

export const userApiObj = new UserApi();

export const savedSecert = (text) => {
  console.log('in action storage secret key action  ' + text);
  return {
    type: USER_SAVED,
    payload: text,
  };
};

export const savedUrl = (text) => {
  console.log('in action storage url action  ' + text);
  return {
    type: USER_URL,
    payload: text,
  };
};
export const brandNameChanged = (text) => {
  return {
    type: BRAND_NAME_CHANGED,
    payload: text,
  };
};

export const branchNameChanged = (text) => {
  return {
    type: BRANCH_NAME_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};
export const fullNameChanged = (text) => {
  return {
    type: FULLNAME_CHANGED,
    payload: text,
  };
};

export const numberChanged = (text) => {
  return {
    type: NUMBER_CHANGED,
    payload: text,
  };
};
export const commentChanged = (text) => {
  return {
    type: COMMENT_SURVEY_CHANGED,
    payload: text,
  };
};

export const complaintReasonsChanged = (text) => {
  return {
    type: COMPLAINT_SURVEY_CHANGED,
    payload: text,
  };
};
('');

// ************************** login ********************************
export const loginUser = (data) => {
  return (dispatch) => {
    console.log('data in login action');
    console.log(data);
    userApiObj
      .login(data)
      .then((res) => {
        console.log('1');
        console.log(res);
        console.log(' before action');
        if (res.success) {
          dispatch({type: LOGIN_USER_SUCCESS, payload: res});
        } else {
          dispatch({type: LOGIN_USER_FAILED, payload: res});
        }
      })
      .catch((err) => {
        Alert.alert('Warning', 'Check your connection!');
        console.log('in action login catch');
        console.log(err);
      });
  };
};

// ************************** get questions ********************************
export const getQuestions = (data) => {
  return (dispatch) => {
    // console.log('data in login action');
    // console.log(data);
    userApiObj
      .GetQuestions(data)
      .then((res) => {
        // console.log('1');
        // console.log(res.success);
        if (res.success) {
          //    userApiObj.storeData(data.brand_name,data.branch_name,data.password)
          dispatch({type: GET_QUESTIONS_SUCCESS, payload: res});
        } else {
          dispatch({type: GET_QUESTIONS_FAIL});
        }
      })
      .catch((err) => {
        dispatch({type: GET_QUESTIONS_FAIL});
        Alert.alert('Warning', 'Check your connection!');
        console.log('in action login catch');
        console.log(err);
      });
  };
};

// ************************** get comments ********************************
export const getCommentFromServer = (data) => {
  return (dispatch) => {
    // console.log('data in login action');
    // console.log(data);
    userApiObj
      .GetComment(data)
      .then((res) => {
        if (res.success) {
          console.log('in success comment')
          dispatch({type: GET_COMMENT_SUCCESS, payload: res});
        } else {
          console.log('in fail comment')

          dispatch({type: GET_COMMENT_FAIL});
        }
      })
      .catch((err) => {
        console.log('in catch comment')
        dispatch({type: GET_COMMENT_FAIL});
        Alert.alert('Warning', 'Check your connection!');
        console.log('in action login catch');
        console.log(err);
      });
  };
};
// ************************** post survey ********************************
export const postSurvey = (data) => {
  return (dispatch) => {
    // console.log('data in login action');
    // console.log('___________________', data);

    userApiObj
      .PostSurvey(data)
      .then(async (res) => {
        // console.log('1');
        // console.log(res.success);
        if (res.success) {
          //    userApiObj.storeData(data.brand_name,data.branch_name,data.password)
          dispatch({type: POST_SURVEY_SUCCESS});
        } else {
          const getHistory = await AsyncStorage.getItem('@API_QUEUE');
          // console.log('getHistory<<<<<<<<<<', getHistory);
          try {
            if (getHistory) {
              console.log('************* UPDATE History ********************');
              const historyObj = JSON.parse(getHistory);
              historyObj.push(data);
              const historyStr = JSON.stringify(historyObj);
              await AsyncStorage.setItem('@API_QUEUE', historyStr);
              // console.log(historyObj);
            } else {
              console.log('************* CREATE History ********************');
              const history = [];
              history.push(data);
              const historyStr = JSON.stringify(history);
              await AsyncStorage.setItem('@API_QUEUE', historyStr);
            }
            dispatch({type: POST_SURVEY_SUCCESS});
          } catch (err) {
            console.log('@API_QUEUE_________err', err);
          }

          // dispatch({type: POST_SURVEY_FAIL});
        }
      })
      .catch(async (err) => {
        Alert.alert('Something went wrong');
        // Alert.alert('Warning', 'Check your connection!');
        // console.log('in action post survey')
        // console.log(err)
      });
  };
};
