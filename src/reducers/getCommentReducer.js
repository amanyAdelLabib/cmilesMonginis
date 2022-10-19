import {
    GET_COMMENT_SUCCESS,
    GET_COMMENT_FAIL
  } from '../actions/types';
  
  const INITIAL_STATE = {
    getCommentReducer: {},
    loadingGetComment: false,

  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_COMMENT_SUCCESS:
          {
              console.log('in reducer comment')
              console.log(action.payload)
        return {
          getCommentReducer: action.payload.data.comment,
          loadingGetComment: true,
        };}
      case GET_COMMENT_FAIL:
        return {...state, loadingGetComment: false};
      default:
        return state;
    }
  };
  