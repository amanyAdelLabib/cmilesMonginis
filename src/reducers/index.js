import {combineReducers} from 'redux';
import Auth from './authReducer';
import Survey from './surveyReducer';
import GetComment from './getCommentReducer';
export default {
  auth: Auth,
  survey: Survey,
  getComment:GetComment
};
