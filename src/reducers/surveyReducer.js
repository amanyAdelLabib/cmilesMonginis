import {
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  COMMENT_SURVEY_CHANGED,
  POST_SURVEY_SUCCESS,
  POST_SURVEY_FAIL,
  INITIAL_SCREEN,
  FULLNAME_CHANGED,
  NUMBER_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
  getQuestions: {},
  loadingGetQuestions: false,
  comment: '',
  failPostSurvey: false,
  successPostSurvey: false,
  loadingEnterComment:false,
  fullName:'',
  number:'',
  loadingEnterFullName:false,
  loadingEnterNumber:false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_QUESTIONS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        getQuestions: action.payload.data,
        loadingGetQuestions: true,
      };
    case GET_QUESTIONS_FAIL:
      return {...state, loadingGetQuestions: true};
      case FULLNAME_CHANGED: {
        return {...state, fullName: action.payload,loadingEnterFullName:true};
      }
      case NUMBER_CHANGED: {
        return {...state, number: action.payload,loadingEnterNumber:true};
      }
    case COMMENT_SURVEY_CHANGED: {
      return {...state, comment: action.payload,loadingEnterComment:true};
    }
    case POST_SURVEY_SUCCESS: {
      return {...state, successPostSurvey: true,loadingEnterComment:false,loadingEnterNumber:false,loadingEnterFullName:false,comment:''};
    }
    case POST_SURVEY_FAIL: {
      return {...state, failPostSurvey: true,loadingEnterComment:false,loadingEnterNumber:false,loadingEnterFullName:false,comment:''};
    }
    default:
      return state;
  }
};
