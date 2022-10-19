import {Image, StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {savedSecert, savedUrl, userApiObj} from '../actions';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Reactotron from 'reactotron-react-native';

class Intial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: '',
      lastState: null,
    };
  }

  componentDidMount() {
    let interval = setInterval(() => {
      console.log('This will run every second!');
      this.getData();
      clearInterval(interval);
    }, 3000);
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(async () => {
        if (this.state.lastState !== state.isConnected) {
          console.log('***********************************');
          console.log('Connection type', state.type);
          console.log('Is connected?', state.isConnected);
          console.log('***********************************');
          this.state.lastState = state.isConnected;

          const getHistory = await AsyncStorage.getItem('@API_QUEUE');
          if (getHistory && state.isConnected) {
            console.log('************* Send History ********************');
            const historyObj = JSON.parse(getHistory);
            Reactotron.display({
              name: 'historyObj',
              value: historyObj,
            });
            historyObj.map((data, index) => {
              console.log('****************data', data);
              userApiObj
                .PostSurvey(data)
                .then((res) => {
                  console.log('****************res', res);
                  if (res.success) {
                    console.log(index, ' completed', res.success);
                  } else {
                    console.log(index, ' failed');
                  }
                })
                .catch((err) => {
                  console.log('err', err);
                });
            });
            await AsyncStorage.setItem('@API_QUEUE', JSON.stringify([]));
          }
        }
      }, 1000);
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  getData = async () => {
    // async getData(){
    console.log('in fun get data');

    const value = await AsyncStorage.getItem('USER_SECRET');
    const valueUrl = await AsyncStorage.getItem('USER_URL');

    if (value !== null && valueUrl !== null) {
      console.log('have data in intial');
      console.log(value);
      await this.props.savedSecert(value);
      await this.props.savedUrl(valueUrl);
      this.props.navigation.navigate('Survey');
    } else {
      console.log(' in else storage save data');
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.bodyContainer}>
          <Image
            style={styles.loadingImg}
            source={require('../assets/icons/AppIcon-512x.png')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    height: responsiveHeight(100),
  },
  bodyContainer: {
    marginHorizontal: responsiveWidth(10),
    marginVertical: responsiveHeight(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImg: {
    width: responsiveWidth(20),
    height: responsiveHeight(35),
  },
});

const mapStateToProps = (state) => {
  return {
    syncStorageStatus: state.auth.syncStorageStatus,
  };
};

const IntialRedux = connect(mapStateToProps, {
  savedSecert,
  savedUrl,
})(Intial);
export {IntialRedux as Intial};
