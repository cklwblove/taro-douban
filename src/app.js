import '@tarojs/async-await';
import Taro, { Component } from '@tarojs/taro';
import Index from './pages/index';
import getCityName from './utils/baidu';
import { set as setGlobalData } from './utils/global_data';

// 全局引入一次即可
import 'taro-ui/dist/style/index.scss';
import './app.less';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/board/index',
      'pages/item/index',
      'pages/list/index',
      'pages/search/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeDouabn',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    networkTimeout: {
      request: 20000,
      downloadFile: 20000
    },
    tabBar: {
      color: '#666',
      selectedColor: '#000',
      borderStyle: 'white',
      backgroundColor: '#f8f9fb',
      list: [
        {
          text: '榜单',
          pagePath: 'pages/board/index',
          iconPath: './assets/img/board.png',
          selectedIconPath: './assets/img/board-actived.png'
        },
        {
          text: '搜索',
          pagePath: 'pages/search/index',
          iconPath: './assets/img/search.png',
          selectedIconPath: './assets/img/search-actived.png'
        }
      ]
    }
  };

  componentDidMount() {
    this.getCurrentLocation();
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  async getCurrentLocation() {
    try {
      const location = await Taro.getLocation();
      console.log('location', location);
      if (location && location.errMsg) {
        // 拒绝授权地理位置权限
        if (
          location.errMsg.indexOf('deny') !== -1 ||
          location.errMsg.indexOf('denied') !== -1
        ) {
          Taro
            .showToast({
              title: '需要开启地理位置权限',
              icon: 'none',
              duration: 3000
            })
            .then(() => {
              let timer = setTimeout(() => {
                clearTimeout(timer);
                Taro.openSetting();
              }, 3000);
            });
        } else {
          const {latitude, longitude} = location;
          const name = getCityName(latitude, longitude);
          setGlobalData('currentCity', typeof name === 'string' && name.replace('市', ''));
        }
      } else {
        setGlobalData('currentCity', '杭州' || '');
      }
    } catch (err) {
      // console.log(err);
      setGlobalData('currentCity', '杭州' || '');
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
