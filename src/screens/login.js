import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  brandNameChanged,
  branchNameChanged,
  passwordChanged,
  loginUser,
  storageStatus,
  savedSecert,
  savedUrl,
} from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import {InputView, Label, InputText} from '../components';
// import SplashScreen from 'react-native-splash-screen'

// import Api from '../Api'
import {Input, Button} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: false,
    };
  }

  componentDidMount() {
    console.log('in did mount');
  }

  onBranchnameChange(text) {
    console.log(text);
    this.props.branchNameChanged(text);
  }

  onBrandnameChange(text) {
    console.log(text);
    this.props.brandNameChanged(text);
  }

  onPasswordChange(text) {
    console.log(text);

    this.props.passwordChanged(text);
  }

  storeData = async () => {
    this.USER = {
      brand_name: this.props.brandName,
      branch_name: this.props.branchName,
      password: this.props.password,
      secret: this.props.user.secret,
    };
    try {
      await AsyncStorage.setItem(
        'USER_SECRET',
        JSON.stringify(this.props.user.secret),
      );
      await AsyncStorage.setItem(
        'USER_URL',
        JSON.stringify(this.props.user.url),
      );

      console.log('success storage');
      // this.props.navigation.navigate('Home');
      this.getData();
    } catch (e) {
      console.log('err');
      console.log(e);
    }
  };
  getData = async () => {
    // async getData(){
    console.log('in fun get data');

    const value = await AsyncStorage.getItem('USER_SECRET');
    const valueUrl = await AsyncStorage.getItem('USER_URL');

    if (value !== null && valueUrl !== null) {
      // this.props.storageStatus(true);
      await this.props.savedSecert(value);
      await this.props.savedUrl(valueUrl);

      this.props.navigation.navigate('Survey');

      //  await AsyncStorage.removeItem('USER')
    } else {
      console.log(' in else storage save data');

      this.setState({
        initialScreen: true,
      });
    }
  };

  onButtonPressLogin() {
    console.log('btn login');

    this.props.loginUser({
      // "brand_name":"aht",
      // "branch_name":"New Balance ( CFC )",
      // "password":"ahtcmiles"
      brand_name: this.props.brandName,
      branch_name: this.props.branchName,
      password: this.props.password,
    });
    // this.storeData();
  }

  loginState() {
    console.log('loading');
    if (this.props.loading) {
      console.log('succes login');
      this.storeData();
    }
    if (this.props.err) {
      Alert.alert('Warning', this.props.err);
    }
  }

  navigateToHome() {
    this.props.navigation.navigate('Home');
  }

  render() {
    {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(0);
          }}>
          <ScrollView style={styles.mainContainer}>
            <View style={styles.bodyContainer}>
              <Image
                style={styles.logoImg}
                source={require('../assets/icons/AppIcon-512x.png')}
              />

              <Input
                placeholder="Brand Name"
                onChangeText={this.onBrandnameChange.bind(this)}
                value={this.props.brandName}
                inputContainerStyle={styles.inputContainerStyle}
                autoCapitalize="none"
                inputStyle={styles.inputStyle}
              />
              <Input
                placeholder="Branch Name"
                onChangeText={this.onBranchnameChange.bind(this)}
                value={this.props.branchName}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                autoCapitalize="none"
              />
              <Input
                placeholder="Password"
                value={this.props.password}
                onChangeText={this.onPasswordChange.bind(this)}
                autoCapitalize="none"
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
              />
              <Button
                title="Login"
                onPress={this.onButtonPressLogin.bind(this)}
                titleStyle={styles.titleLoginBtn}
                buttonStyle={styles.loginBtn}
              />
            </View>
            {this.loginState()}
          </ScrollView>
        </TouchableWithoutFeedback>
      );
    }
  }
}

// chalhoub
// branch1
// ahtcmiles

const styles = StyleSheet.create({
  iconLogo: {
    textAlign: 'center',
    marginBottom: '15%',
  },
  loginBtn: {
    backgroundColor: '#00A834',
    borderRadius: 30,
    width: responsiveWidth(20),
    marginHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(4),
  },
  titleLoginBtn: {
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(0.5),
    paddingVertical: responsiveHeight(0.8),
  },
  inputContainerStyle: {
    marginVertical: responsiveHeight(0.3),
    marginHorizontal: responsiveWidth(10),
    width: responsiveWidth(60),
  },
  inputStyle: {
    fontSize: responsiveFontSize(1.5),
  },
  logoImg: {
    width: responsiveWidth(20),
    height: responsiveHeight(35),
  },
  bodyContainer: {
    marginHorizontal: responsiveWidth(10),
    marginVertical: responsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: 'white',
    // height: responsiveHeight(100)
  },
});

const mapStateToProps = (state) => {
  return {
    brandName: state.auth.brandName,
    branchName: state.auth.branchName,
    password: state.auth.password,
    loading: state.auth.loading,
    syncStorageStatus: state.auth.syncStorageStatus,
    user: state.auth.userData,
    err: state.auth.errMsg,

    // language: state.translation,
    // user: state.auth.user
  };
};

const LoginRedux = connect(mapStateToProps, {
  brandNameChanged,
  branchNameChanged,
  passwordChanged,
  loginUser,
  storageStatus,
  savedSecert,
  savedUrl,
})(Login);
export {LoginRedux as Login};
