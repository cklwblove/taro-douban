import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Button } from '@tarojs/components';
import { GLOBAL_CONFIG } from '@/constants/globalConfig';
import { get as getGlobalData } from '@/utils/global_data';
import { getImages } from '@/utils/index';
import api from '@/services/api';

import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  };

  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT});
    this.loadComing();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  async loadComing() {
    const cache = await this.getCache();
    if (cache) {
      this.setState({
        movies: cache.movies
      });
      Taro.hideLoading();
    } else {
      let res = null;
      try {
        res = await api.get('/coming_soon', {
          start: 1,
          count: 3,
          city: getGlobalData('currentCity')
        });
        const {data} = res.data;
        const {subjects} = data;
        this.setState({
          movies: subjects
        });
        Taro.setStorage({
          key: 'lastSplashData',
          data: {
            movies: subjects,
            expires: Date.now() + 24 * 60 * 60
          }
        });
      } catch (err) {
        this.setState({
          movies: []
        });
      } finally {
        Taro.hideLoading();
      }
    }
  }

  async getCache() {
    try {
      const res = await Taro.getStorage({key: 'lastSplashData'});
      const {movies, expires} = res;
      if (movies && expires > Date.now()) {
        return {
          movies,
          expires
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  handleStart() {
    Taro.switchTab({
      url: '/pages/board/index'
    });
  }

  render() {
    const {movies} = this.state;
    const isShowButton = (index) => index === movies.length - 1;
    if (!movies || !movies.length) return <View />;
    return (
      <View className='container'>
        {movies.length !== 0 &&
        <Swiper className='splash'>
          {movies.map((movie, index) => {
            return (
              <SwiperItem className='swiper-item' key={movie.id}>
                <Image
                  src={getImages(movie.images.large)}
                  mode='scaleToFill'
                  className='swiper-item-img'
                />
                {(isShowButton(index) &&
                  <Button size='mini' className='button-experience' onClick={this.handleStart}>立即体验</Button>)
                }
              </SwiperItem>
            );
          })}
        </Swiper>
        }
      </View>
    );
  }
}
