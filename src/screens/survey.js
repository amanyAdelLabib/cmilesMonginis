import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {Component} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import {Input, Button} from 'react-native-elements';
// import { DeviceEventEmitter } from 'react-native'
import IdleTimerManager from 'react-native-idle-timer';
import CodeModal from '../components/CodeModal';

import {
  commentChanged,
  getQuestions,
  postSurvey,
  getCommentFromServer,
  fullNameChanged,
  numberChanged,
} from '../actions';
import Textarea from 'react-native-textarea';
import PhoneModal from '../components/PhoneModal';
import {UserSelection} from './UserSelection';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import {LoadingLottie} from '../components';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

class Survey extends Component {
  constructor(props) {
    super(props);
    this.testArr = [];
    this.interval = null;
    this.state = {
      counter: 0,
      showSubmitBtn: false,
      answers: [],
      commentSurveyState: '',
      counterInterval: 0,
      QuestionsList: [],
      showPhoneModal: false,
      askedPhone: false,
      phone: '',
      doctorData: {},
      itemSelected: [],
      getCommentTextFromServer: '',
      loadingGetCommentTextFromServer: false,
      commentSurveyState: '',
      fullName: '',
      fullNameSubmit: true,
      mobileNumber: '',
      mobileNumberSubmit: true,
      passwordToExit: '',
      showPasswordToExitModal: false,
      counterPasswordToExitInterval: 0,

      // widthScreen:useWindowDimensions().width
    };
  }

  componentDidMount() {
    hideNavigationBar();
    IdleTimerManager.setIdleTimerDisabled(true);
    DeviceEventEmitter.addListener('ON_RECENT_APP_BUTTON_PRESSED', () => {
      hideNavigationBar();
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.log('new url ' + JSON.parse(this.props.secretUrl));
    this.props.getQuestions({
      secret: JSON.parse(this.props.secretKey),
      url: JSON.parse(this.props.secretUrl),
    });
    this.props.getCommentFromServer({
      secret: JSON.parse(this.props.secretKey),
      url: JSON.parse(this.props.secretUrl),
    });
    console.log(this.state.answers);
    clearInterval(this.interval);
    this.setState({
      counterInterval: 0,
    });
  }
  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    navigate('NewScreen');
  };

  handleBackButton = () => {
    console.log('handleBackButton');
    this.setState({
      showPasswordToExitModal: true,
    });

    return true;
  };
  componentWillUnmount() {
    // if(this.interval)
    // clearInterval(this.interval)
    IdleTimerManager.setIdleTimerDisabled(false);
    clearInterval(this.interval);
    this.setState({
      counter: 0,
      showSubmitBtn: false,
      answers: [],
      commentSurveyState: '',
      counterInterval: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log('fail post  mount' + nextProps.failPost);
    // console.log('success post  mount' + nextProps.successPost);
    // this.props.navigation.navigate('Result');
    if (nextProps.getQues !== this.state.QuestionsList) {
      this.setState({
        QuestionsList: nextProps.getQues,
      });
    }

    if (nextProps.loadingEnterComment) {
      this.setState({
        commentSurveyState: nextProps.commentSurvey,
      });
    } else {
      this.setState({
        commentSurveyState: '',
      });
    }

    if (nextProps.loadingGetComment) {
      console.log('in next props get comment');
      console.log(nextProps.getComment);
      this.setState({
        getCommentTextFromServer: nextProps.getComment,
        loadingGetCommentTextFromServer: nextProps.loadingGetComment,
      });
    } else {
      this.setState({
        getCommentTextFromServer: '',
        loadingGetCommentTextFromServer: nextProps.loadingGetComment,
      });
    }
    if (nextProps.loadingEnterFullName) {
      this.setState({
        fullName: nextProps.fullName,
        fullNameSubmit: true,
      });
    } else {
      this.setState({
        fullName: '',
        // fullNameSubmit:false
      });
    }

    if (nextProps.loadingEnterNumber) {
      if (
        isNaN(nextProps.number.replace('.', '')) ||
        nextProps.number.length < 11 ||
        nextProps.number.length > 11
      ) {
        this.setState({
          mobileNumberSubmit: false,
          mobileNumber: nextProps.number,
        });
      } else {
        this.setState({
          mobileNumberSubmit: true,
          mobileNumber: nextProps.number,
        });
      }
      // this.setState({
      //   mobileNumber: nextProps.number,
      //   mobileNumberSubmit:true
      // });
    } else {
      this.setState({
        mobileNumber: '',
        // mobileNumberSubmit:false
      });
    }
  }
  onFullNameChange(text) {
    this.setState({
      counterInterval: 0,
    });
    console.log('set counter interval');

    console.log(this.state.counterInterval);
    this.props.fullNameChanged(text);
  }

  onMobileNumberChange(text) {
    this.setState({
      counterInterval: 0,
    });
    console.log('set counter interval');
    console.log('checl mobile number');
    console.log(isNaN(text.replace('.', '')));
    console.log(this.state.counterInterval);

    this.props.numberChanged(text);
  }
  onCommentChange(text) {
    this.setState({
      counterInterval: 0,
    });
    console.log('set counter interval');

    console.log(this.state.counterInterval);
    this.props.commentChanged(text);
  }

  renderPoweredBy = () => {
    return (
      <View style={styles.poweredByView}>
        <Text style={styles.poweredByText}>Powered by AHT Analytics</Text>
      </View>
    );
  };
  _renderComment() {
    console.log('in render fun');
    console.log(this.state.loadingGetCommentTextFromServer);
    console.log(this.state.getCommentTextFromServer);
    if (
      this.state.loadingGetCommentTextFromServer &&
      this.state.getCommentTextFromServer !== ''
    )
      return (
        <Text style={styles.commentLabel}>
          {this.state.getCommentTextFromServer}
        </Text>
      );
    else {
      return (
        <Text style={styles.commentLabel}>
          Leave your phone number/comment
          <Text style={styles.optionalText}> ( Optional )</Text>
        </Text>
      );
    }
  }
  renderQuestionType(item, index, arrLength) {
    console.log('arrLength item');
    console.log(item);
    console.log(index);

    if (item.type === 'multi-choice') {
      return (
        <View
          style={[
            styles.answersContainer,
            {flexDirection: 'column', marginTop: responsiveHeight(12)},
          ]}>
          {this.state.itemSelected.length > 0 ? (
            <View
              style={{
                flexDirection: 'row-reverse',
                marginBottom: responsiveHeight(4),
              }}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => {
                  this.testArr.push({[item.id]: this.state.itemSelected});
                  if (this.state.counter == arrLength - 1) {
                    this.setState(
                      {
                        showSubmitBtn: true,
                        answers: this.testArr,
                        itemSelected: [],
                        counterInterval: 0,
                      },
                      function () {
                        console.log('end length ');
                        console.log(this.state.answers);
                        // clearInterval(this.interval);
                      },
                    );
                  } else {
                    this.setState({
                      counter: this.state.counter + 1,
                      itemSelected: [],
                    });
                  }
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {/* <Text style={styles.nextText}>التالي </Text>

                  <Text style={styles.nextText}>
                    {' '}
                    <Icon name="angle-double-right" size={30} color="white" />
                  </Text> */}
                  <Text style={styles.nextText}>
                    Next{' '}
                    <Icon name="angle-double-right" size={30} color="white" />
                  </Text>
                </View>
                {/* <Text style={styles.nextText}>
                    التالي <Icon name="angle-double-right" size={30} color="white" /></Text> */}
              </TouchableOpacity>
            </View>
          ) : null}

          <FlatList
            columnWrapperStyle={{justifyContent: 'space-around'}}
            data={item.choices}
            // horizontal={false}
            renderItem={({item, index}) => (
              //  renderItem(item)
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  // alignItems:'center',
                  marginVertical: responsiveHeight(1.5),
                  paddingVertical: responsiveHeight(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.itemSelected.includes(item.id)) {
                      // this.setState({
                      //   itemSelected:[]
                      // },function(){
                      arr = this.state.itemSelected.filter(function (res) {
                        return res !== item.id;
                        // })
                      });
                      this.setState(
                        {
                          itemSelected: arr,
                        },
                        function () {
                          console.log('in selected item filter');
                          console.log(this.state.itemSelected);
                        },
                      );
                    } else {
                      console.log('in not selected item filter');
                      this.setState({
                        itemSelected: this.state.itemSelected.concat([item.id]),
                      });
                      // this.setState({
                      //   itemSelected:[...item]
                      // })
                      // this.state.itemSelected.push(item)
                      console.log(this.state.itemSelected);
                    }
                  }}
                  style={[
                    styles.buttonRate,
                    this.state.itemSelected.includes(item.id)
                      ? {backgroundColor: '#44BC96', color: 'white'}
                      : {backgroundColor: 'white', color: '#44BC96'},
                  ]}>
                  <Text
                    style={[
                      styles.btnTitleRate,
                      this.state.itemSelected.includes(item.id)
                        ? {color: 'white'}
                        : {color: '#44BC96'},
                    ]}>
                    {item.choice}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={5}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    } else if (item.type === 'emoji') {
      return (
        <View style={styles.answersContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log('_______________sad');
              // console.log(arrLength);
              // console.log(this.state.counter);
              // console.log(index);
              this.testArr.push({[item.id]: 'Angry'});
              // this.setState({ showPhoneModal: true });
              if (this.state.counter == arrLength - 1) {
                this.setState(
                  {
                    showSubmitBtn: true,
                    answers: this.testArr,
                    counterInterval: 0,
                  },
                  function () {
                    console.log(this.state.answers);
                    // clearInterval(this.interval);
                  },
                );
              } else {
                this.setState({
                  counter: this.state.counter + 1,
                });
              }
            }}>
            <Image
              style={styles.surveyImg}
              source={require('../assets/icons/sad-6.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(arrLength);
              console.log(this.state.counter);
              console.log(index);
              this.testArr.push({[item.id]: 'Upset'});

              if (this.state.counter == arrLength - 1) {
                this.setState(
                  {
                    showSubmitBtn: true,
                    answers: this.testArr,
                  },
                  function () {
                    console.log(this.state.answers);
                  },
                );
              } else {
                this.setState({
                  counter: this.state.counter + 1,
                });
                console.log('state answer');
                console.log(this.state.answers);
                console.log('testarr');
                console.log(this.testArr);
              }
            }}>
            <Image
              style={styles.surveyImg}
              source={require('../assets/icons/neutral-6.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(arrLength);
              console.log(this.state.counter);
              console.log(index);
              this.testArr.push({[item.id]: 'Satisfied'});

              if (this.state.counter == arrLength - 1) {
                this.setState(
                  {
                    showSubmitBtn: true,
                    answers: this.testArr,
                  },
                  function () {
                    console.log(this.state.answers);
                  },
                );
              } else {
                this.setState({
                  counter: this.state.counter + 1,
                });
                console.log('state answer');
                console.log(this.state.answers);
                console.log('testarr');
                console.log(this.testArr);
              }
            }}>
            <Image
              style={styles.surveyImg}
              source={require('../assets/icons/smile-6.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(arrLength);
              console.log(this.state.counter);
              console.log(index);
              this.testArr.push({[item.id]: 'Happy'});

              if (this.state.counter == arrLength - 1) {
                this.setState(
                  {
                    showSubmitBtn: true,
                    answers: this.testArr,
                  },
                  function () {
                    console.log(this.state.answers);
                  },
                );
              } else {
                this.setState({
                  counter: this.state.counter + 1,
                });
                console.log('state answer');
                console.log(this.state.answers);
                console.log('testarr');
                console.log(this.testArr);
              }
            }}>
            <Image
              style={styles.surveyImg}
              source={require('../assets/icons/grinning-6.png')}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (item.type === 'single-choice') {
      return (
        <View
          style={[
            styles.answersContainer,
            {flexDirection: 'column', marginTop: responsiveHeight(12)},
          ]}>
          <ScrollView>
            <FlatList
              columnWrapperStyle={{justifyContent: 'space-around'}}
              data={item.choices}
              // horizontal={false}
              renderItem={({item, index}) => (
                //  renderItem(item)
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    alignContent: 'space-between',
                    // alignItems:'center',
                    marginVertical: responsiveHeight(1.5),
                    // paddingHorizontal:responsiveWidth(10),
                    // paddingLeft: responsiveWidth(3),
                    paddingVertical: responsiveHeight(1),

                    // marginleft: responsiveWidth(1),
                    // backgroundColor:'red',
                    // width:responsiveWidth(18),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('chosssssssss');
                      console.log(item);
                      this.testArr.push({[item.question_id]: item.id});
                      // this.setState({ showPhoneModal: true });
                      if (this.state.counter == arrLength - 1) {
                        this.setState(
                          {
                            showSubmitBtn: true,
                            answers: this.testArr,
                            counterInterval: 0,
                          },
                          function () {
                            console.log(this.state.answers);
                            // clearInterval(this.interval);
                          },
                        );
                      } else {
                        this.setState({
                          counter: this.state.counter + 1,
                        });
                      }
                    }}
                    style={[styles.buttonRate, {backgroundColor: 'white'}]}>
                    <Text style={styles.btnTitleRate}>{item.choice} </Text>
                  </TouchableOpacity>
                </View>
              )}
              //Setting the number of column
              numColumns={5}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </View>
      );
    }
  }
  renderItem = (item, index, arrLength) => {
    {
      this.splitArr = item.text.split('\r\n');
    }
    console.log('in render question type 2');
    console.log(arrLength);

    return (
      <View>
        {index == this.state.counter ? (
          <View>
            {this.splitArr.length == 1 ? (
              <View>
                <Text style={styles.questionText}>{this.splitArr[0]}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.questionText1}>{this.splitArr[0]}</Text>
                <Text style={styles.questionText2}>{this.splitArr[1]}</Text>
              </View>
            )}

            {/* <HTML source={{ html:  `
                  <h1>This HTML snippet is now rendered with native components !</h1>
                  <h2>Enjoy a webview-free and blazing fast application</h2>

              ` }} /> */}
            {/* <View style={styles.answersContainer}> */}
            {/* <ScrollView > */}

            {this.renderQuestionType(item, index, arrLength)}

            {/* </ScrollView> */}

            {/* </View> */}
          </View>
        ) : null}
      </View>
    );
  };

  content = () => {
    if (this.props.getQues?.length !== 0) {
      return (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss(0);
            }}>
            <View
              style={styles.mainContainer}
              onTouchStart={() => {
                this.setState(
                  {
                    counterInterval: 0,
                  },
                  function () {
                    this.interval = setInterval(() => {
                      console.log(this.state.counterInterval);

                      console.log('This will run every second! in survey');

                      if (this.state.counterInterval > 59) {
                        console.log('grater than 40');
                        console.log(this.state.counterInterval);

                        this.setState({counterInterval: 0}, function () {
                          clearInterval(this.interval);
                          console.log('send data data');
                          console.log(
                            '{' +
                              'secret:' +
                              JSON.parse(this.props.secretKey) +
                              ',' +
                              'comment:' +
                              this.props.commentSurvey +
                              ',' +
                              'phone:' +
                              this.state.phone +
                              ',' +
                              // 'doctorData:' + this.state.doctorData + ',' +
                              'answers:' +
                              this.testArr +
                              ',' +
                              'url:' +
                              JSON.parse(this.props.secretUrl) +
                              ',' +
                              '}',
                          );
                          this.props.postSurvey({
                            secret: JSON.parse(this.props.secretKey),
                            comment: this.state.commentSurveyState,
                            answers: this.testArr,
                            url: JSON.parse(this.props.secretUrl),
                            phone: this.state.mobileNumber,
                            name: this.state.fullName,
                          });
                          clearInterval(this.interval);
                          this.testArr = [];
                          this.setState({
                            counter: 0,
                            showSubmitBtn: false,
                            answers: [],
                            commentSurveyState: '',
                            counterInterval: 0,
                            showPhoneModal: false,
                            askedPhone: false,
                            phone: '',
                            doctorData: {},
                            mobileNumber: '',
                            name: '',
                            mobileNumberSubmit: true,
                            fullNameSubmit: true,
                          });
                          // this.props.getQuestions({
                          //   "secret": JSON.parse(this.props.secretKey),
                          //   "url":JSON.parse(this.props.secretUrl)
                          //
                          // });
                          this.props.navigation.navigate('Result');
                        });
                      } else {
                        this.setState({
                          counterInterval: this.state.counterInterval + 1,
                        });
                      }
                    }, 1000);
                  },
                );
                clearInterval(this.interval);
              }}>
              {this.state.showSubmitBtn ? (
                <View
                  style={{
                    height: responsiveHeight(100),
                  }}>
                  <KeyboardAvoidingView
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                    behavior="height"
                    enabled
                    //  keyboardVerticalOffset={50}
                  >
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
                      <View
                        style={{
                          marginHorizontal: responsiveWidth(5),
                          marginVertical: responsiveHeight(8),
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            // borderWidth:1,
                            // borderColor:'#00A834',
                            height: responsiveHeight(20),
                            //  marginVertical: responsiveHeight(9),
                            alignItems: 'center',
                            width: responsiveWidth(100),
                            // alignItem:'space-between'
                          }}>
                          <Input
                            placeholder="Enter your name here "
                            label="Name "
                            labelStyle={styles.inputLabel}
                            value={this.state.fullName}
                            containerStyle={styles.containerStyleFullName}
                            inputContainerStyle={
                              styles.inputContainerStyleFullName
                            }
                            inputStyle={[
                              styles.inputStyleForm,
                              !this.state.fullNameSubmit
                                ? {borderColor: 'red'}
                                : null,
                            ]}
                            onChangeText={this.onFullNameChange.bind(this)}
                            errorStyle={
                              !this.state.fullNameSubmit
                                ? {
                                    color: 'red',
                                    fontSize: responsiveFontSize(1.5),
                                    marginTop: responsiveHeight(1),
                                  }
                                : null
                            }
                            errorMessage={
                              !this.state.fullNameSubmit
                                ? 'Please enter your name'
                                : null
                            }
                          />
                          <Input
                            placeholder="Enter your number here"
                            label="Mobile Number "
                            keyboardType="numeric"
                            maxLength={11}
                            value={this.state.mobileNumber}
                            labelStyle={styles.inputLabel}
                            containerStyle={styles.containerStyleMobile}
                            inputContainerStyle={
                              styles.inputContainerStyleMobile
                            }
                            inputStyle={[
                              styles.inputStyleForm,
                              !this.state.mobileNumberSubmit
                                ? {borderColor: 'red'}
                                : null,
                            ]}
                            onChangeText={this.onMobileNumberChange.bind(this)}
                            errorStyle={
                              !this.state.mobileNumberSubmit
                                ? {
                                    color: 'red',
                                    fontSize: responsiveFontSize(1.5),
                                    marginTop: responsiveHeight(1),
                                  }
                                : null
                            }
                            errorMessage={
                              !this.state.mobileNumberSubmit
                                ? 'Please enter a valid number '
                                : null
                            }
                          />

                          {/* </View> */}
                        </View>
                        <View style={styles.bodyContainerSubmit}>
                          {this._renderComment()}

                          <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={this.onCommentChange.bind(this)}
                            defaultValue={this.state.commentSurveyState}
                            // maxLength={200}
                            placeholder={'Leave a comment'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                            returnKeyType="done"
                            keyboardType="default"
                            multiline={true}
                            blurOnSubmit={true}
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                          />
                          <Button
                            title="Submit"
                            onPress={() => {
                              if (this.state.fullName == '') {
                                this.setState({
                                  fullNameSubmit: false,
                                });
                              } else if (
                                this.state.mobileNumber == '' ||
                                this.state.mobileNumber.length < 11
                              ) {
                                console.log('in number condition');
                                this.setState({
                                  mobileNumberSubmit: false,
                                });
                              } else {
                                console.log('send data data');
                                console.log('answers');
                                console.log(this.state.doctorData);
                                console.log(this.testArr);
                                console.log(
                                  '{' +
                                    'secret:' +
                                    JSON.parse(this.props.secretKey) +
                                    ',' +
                                    'comment:' +
                                    this.props.commentSurvey +
                                    ',' +
                                    'phone:' +
                                    this.state.mobileNumber +
                                    ',' +
                                    'doctorData:' +
                                    this.state.doctorData +
                                    ',' +
                                    'answers:' +
                                    this.testArr +
                                    ',' +
                                    'url:' +
                                    JSON.parse(this.props.secretUrl) +
                                    ',' +
                                    'name' +
                                    this.state.fullName +
                                    ' , ' +
                                    '}',
                                );
                                console.log('this.testArr');
                                console.log(this.testArr);
                                // this.testArr.push({ [this.state.doctorData.question_id]: this.state.doctorData.id });
                                console.log('after adding doctor');
                                console.log(this.testArr);

                                this.props.postSurvey({
                                  secret: JSON.parse(this.props.secretKey),
                                  comment: this.state.commentSurveyState,
                                  // phone: this.state.phone,
                                  answers: this.state.answers,
                                  // doctorData: this.state.doctorData,
                                  phone: this.state.mobileNumber,
                                  name: this.state.fullName,
                                  answers: this.state.answers,
                                  url: JSON.parse(this.props.secretUrl),
                                });
                                clearInterval(this.interval);
                                this.testArr = [];
                                this.setState({
                                  counter: 0,
                                  showSubmitBtn: false,
                                  answers: [],
                                  commentSurveyState: '',
                                  counterInterval: 0,
                                  showPhoneModal: false,
                                  askedPhone: false,
                                  phone: '',
                                  // doctorData: {},
                                  counter: 0,
                                  mobileNumber: '',
                                  name: '',
                                  mobileNumberSubmit: true,
                                  fullNameSubmit: true,
                                });
                                // this.props.getQuestions({
                                //   secret: JSON.parse(this.props.secretKey),
                                //   url: JSON.parse(this.props.secretUrl),
                                // });
                                this.props.navigation.navigate('Result');
                              }
                            }}
                            titleStyle={styles.titleSubmitBtn}
                            buttonStyle={styles.submitBtn}
                          />
                        </View>
                      </View>
                    </ScrollView>
                  </KeyboardAvoidingView>
                </View>
              ) : (
                <View>
                  <FlatList
                    data={this.props.getQues}
                    renderItem={({item, index}) =>
                      this.renderItem(item, index, this.props.getQues.length)
                    }
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <View
            style={{
              width: '100%',
              height: '85%',
              marginVertical: responsiveHeight(5),
              paddingHorizontal: responsiveHeight(0.5),
            }}>
            <LottieView
              source={require('../assets/lottie/7675-loading.json')}
              autoPlay
              loop
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '85%',
              }}
            />
          </View>
        </>
      );
    }
  };

  findChooseDrQes(item) {
    return item.type == 'single-choice';
  }
  allQuestionsWhithoutDrQes(item) {
    return item.type === 'emoji';
  }
  render() {
    const {showPhoneModal, askedPhone, phone, doctorData} = this.state;
    console.log('test array');
    hideNavigationBar();

    if (this.props.getQues && this.props.loadingGetQuestions) {
      return (
        <View style={{flex: 1}}>
          {/* {Object.keys(this.state.doctorData).length == 0 ? (
            <UserSelection
              chooseDr={this.props.getQues.find(this.findChooseDrQes)}
              onSelect={(data) => {
                console.log('doctor data')
                console.log(data)
                this.setState({
                  doctorData: data,
                });
              }}
            />
          ) : (
            this.content()
          )} */}
          <CodeModal
            passwordToExit={this.state.passwordToExit}
            visible={this.state.showPasswordToExitModal}
            secondsCounter={this.state.counterPasswordToExitInterval}
            onSubmit={(value) => {
              this.setState({
                // askedPhone: true,
                passwordToExit: value,
                showPasswordToExitModal: false,
                counterPasswordToExitInterval: 0,
              });
            }}
          />
          {this.content()}
          {this.renderPoweredBy()}
          {/* <PhoneModal
            phone={phone}
            visible={showPhoneModal && !askedPhone}
            onSubmit={(value) =>
              this.setState({
                askedPhone: true,
                phone: value,
                showPhoneModal: false,
              })
            }
          /> */}
        </View>
      );
    } else {
      return (
        <View>
          <LoadingLottie />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(3),
  },
  bodyContainerSubmit: {
    // marginHorizontal: responsiveWidth(5),
    // marginVertical: responsiveHeight(20),
  },
  commentLabel: {
    fontSize: responsiveFontSize(2.5),
    marginBottom: responsiveHeight(0.8),
    fontFamily: 'Roboto-Regular',
  },
  titleSubmitBtn: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(1),
  },
  submitBtn: {
    backgroundColor: '#00A834',
    borderRadius: 30,
    width: responsiveWidth(23),
    marginHorizontal: responsiveWidth(30),
    marginTop: responsiveHeight(5),
  },
  questionText: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(18),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  questionText1: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(12),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  questionText2: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(4),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(15),
  },
  surveyImg: {
    width: Platform.OS == 'ios' ? responsiveWidth(19) : responsiveWidth(17),
    height: Platform.OS == 'ios' ? responsiveWidth(19) : responsiveHeight(29.8),
    borderRadius: 110,
  },
  textareaContainer: {
    height: responsiveHeight(35),
    padding: '3%',
    backgroundColor: '#F5FCFF',
    borderColor: '#00A834',
    borderWidth: 3,
    borderRadius: 15,
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: responsiveHeight(20),
    fontSize: responsiveFontSize(1.5),
    color: '#333',
  },
  optionalText: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(0.8),
    fontFamily: 'Roboto-Regular',
    color: '#cccccc',
  },
  button: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    // backgroundColor: '#44BC96',
    marginHorizontal: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',

    // flex:1,
    borderRadius: 100,
    borderColor: '#44BC96',
    borderWidth: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 8.0,

    elevation: 10,
  },
  buttonRate: {
    width: responsiveWidth(17.5),
    height: responsiveHeight(20),
    // backgroundColor: '#44BC96',
    // marginHorizontal: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',

    // flex:1,
    borderRadius: 100,
    borderColor: '#44BC96',
    borderWidth: 3.5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 8.0,

    elevation: 10,
  },
  btnTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#44BC96',
  },
  btnTitleRate: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#44BC96',
  },
  nextBtn: {
    backgroundColor: '#2e6da4',
    width: responsiveWidth(15),
    height: responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 30,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  poweredByView: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#F2F2F2',
    // backgroundColor:'red',

    flex: 1,
    bottom: 0,
    width: responsiveWidth(100),
    // height:responsiveHeight(10)
  },
  poweredByText: {
    fontSize: responsiveFontSize(1.5),
    // marginTop: responsiveHeight(18),
    paddingVertical: responsiveHeight(1),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#808080',
  },
  nextText: {
    // color: '#44BC96',
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.5),
    marginBottom: responsiveHeight(2),
    fontFamily: 'Roboto-Regular',
    color: 'black',
  },
  containerStyleFullName: {
    width: responsiveWidth(40),
    // marginLeft: responsiveWidth(4),
  },
  inputContainerStyleFullName: {
    width: responsiveWidth(40),
    height: responsiveHeight(8),
    borderBottomWidth: 0,
  },
  inputStyleForm: {
    fontSize: responsiveFontSize(1.5),
    color: 'black',
    borderColor: '#00A834',
    borderWidth: 3,
    borderRadius: 20,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    height: responsiveHeight(10),
    backgroundColor: '#F5FCFF',
  },
  containerStyleMobile: {
    width: responsiveWidth(32),
    marginLeft: responsiveWidth(4),
  },
  inputContainerStyleMobile: {
    width: responsiveWidth(35),
    height: responsiveHeight(8),
    borderBottomWidth: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    secretKey: state.auth.secretKey,
    secretUrl: state.auth.secretUrl,
    getQues: state.survey.getQuestions,
    commentSurvey: state.survey.comment,
    loadingGetQuestions: state.survey.loadingGetQuestions,
    failPost: state.survey.failPostSurvey,
    successPost: state.survey.successPostSurvey,
    getComment: state.getComment.getCommentReducer,
    loadingGetComment: state.getComment.loadingGetComment,
    loadingEnterComment: state.survey.loadingEnterComment,
    fullName: state.survey.fullName,
    number: state.survey.number,
    loadingEnterFullName: state.survey.loadingEnterFullName,
    loadingEnterNumber: state.survey.loadingEnterNumber,
  };
};

const SurveyRedux = connect(mapStateToProps, {
  getQuestions,
  commentChanged,
  postSurvey,
  getCommentFromServer,
  fullNameChanged,
  numberChanged,
})(Survey);
export {SurveyRedux as Survey};
