import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
//import config from '../../config/config';

export default class UserApi {
  constructor() {
    this.apiUrl = 'https://cmiles.app';
  }

  init(urlInit) {
    console.log('url  >>>>>>>>' + urlInit);
    this.headers = {'Content-Type': 'application/json'};
    this.client = axios.create({
      baseUrl: urlInit,
      //timeout:31000
      headers: this.headers,
    });
    return this.client;
  }

  /*********************** login function  **************************************************/
  login(data) {
    // console.log('in login return service');
    // console.log('date login');
    // console.log(data);
    return this.init()
      .post(`${this.apiUrl}/api/mapping`, data)
      .then((res) => {
        // console.log('in then login class');
        // console.log(res.data)
        console.log(res);

        return res.data;
      })
      .catch((err) => {
        console.log('in login class catch err');
        console.log(err);

        console.log(err.response.data);
        return err;
      });
  }

  /*********************** store in asynStorage function  **************************************************/

  storeData = async (brand, branch, pass) => {
    this.USER = {
      brand_name: brand,
      branch_name: branch,
      password: pass,
    };
    try {
      await AsyncStorage.setItem('USER', JSON.stringify(this.USER));
      console.log('success storage');
      //   this.props.navigation.navigate('Home');
    } catch (e) {
      console.log('err');
      console.log(e);
    }
  };
  /*********************** get questions function  **************************************************/
  GetQuestions(data) {
    // console.log('in c;ass get question test');
    // console.log(data);
    // console.log(data.url);
    return (
      this.init(data.url)
        .post(`${data.url}/getQuestions`, data)
        //return this.init().post("/users/login",data).

        .then((res) => {
          // console.log('in then get question');
          return res.data;
        })
        .catch((err) => {
          console.log('in get question');
          console.log(err);
          return err;
        })
    );
  }

  /*********************** Post Survey  **************************************************/
  PostSurvey(data) {
    return this.init(data.url)
      .post(`${data.url}/addSurvey`, data)
      .then((res) => {
        // console.log('in then get question');
        return res.data;
      })
      .catch((err) => {
        // console.log('in get question');
        console.log(err);
        return err;
      });
  }
    /*********************** get comment function  **************************************************/
    GetComment(data) {
      console.log('in get comment')
      return (
        this.init(data.url)
          .post(`${data.url}/getCommenttxt`, data)  
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            console.log('in get comment');
            console.log(err);
            return err;
          })
      );
    }
}
