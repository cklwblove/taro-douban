import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Navigator, Text, ScrollView } from '@tarojs/components';
import { GLOBAL_CONFIG } from '@/constants/globalConfig';
import { getImages } from '@/utils/index';
import api from '@/services/api';

import './index.less';

export default class Board extends Component {
  config = {
    navigationBarTitleText: '榜单 « 电影 « 豆瓣'
  };

  constructor(props) {
    super(props);
    this.state = {
      boards: [
        {key: 'in_theaters'},
        {key: 'coming_soon'},
        {key: 'us_box'},
        {key: 'top250'}
      ]
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT});
    this.loadBoard();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  loadBoard() {
    const {boards} = this.state;
    const tasks = boards.map((board) => {
      return api.get(`/${board.key}`, {
        start: 1,
        count: 8
      }).then((d) => {
        let list = [];
        const {data} = d.data;
        board.title = data.title;
        if (Array.isArray(data.subjects) && data.subjects.length) {
          list = data.subjects.map((v) => {
            // 北美电影排行的API中数据格式与普通的API不同，这里是渲染北美电影排行的数据
            if (v.subject) {
              return v.subject;
            } else {
              return v;
            }
          });
        }
        board.movies = list;
        return board;
      });
    });

    Promise.all(tasks).then((result) => {
      this.setState({
        boards: result
      });
      Taro.hideLoading();
    });
  }

  render() {
    const {boards = []} = this.state;
    return (
      <View className='container'>
        <View className='slide'>
          <Swiper
            className='slide-swiper'
            indicatorDots
            indicatorActiveColor='rgba(0,0,0,.5)'
            autoplay
            duration={1000}
          >
            {
              (boards[0].movies && boards[0].movies.length > 0) &&
              boards[0].movies.map((movie) => {
                return (
                  <SwiperItem className='slide-swiper-item' key={movie.id}>
                    <Image
                      src={getImages(movie.images.large)}
                      mode='aspectFill'
                      className='slide-swiper-item-img'
                    />
                  </SwiperItem>
                );
              })
            }
          </Swiper>
        </View>
        <View className='board'>
            {
              boards.length > 0 &&
              boards.map((board) => {
                return (
                  <View className='board-item' key={board.key}>
                    <Navigator url={'/pages/list/index?type=' + board.key + '&title=' + board.title}>
                      <View className='title'>
                        <Text className='info'>{board.title}</Text>
                        <Image
                          className='arrow-right'
                          src={require('../../assets/img/arrowright.png')}
                          mode='aspectFill'
                        />
                      </View>
                    </Navigator>
                    <ScrollView className='content' scrollX>
                      <View className='inner'>
                        {
                          board.movies && board.movies.length > 0 &&
                          board.movies.map((item) => {
                            return (
                              <Navigator url={'/pages/item/index?id=' + item.id} key={item.id}>
                                <View className='movie-item'>
                                  <Image
                                    className='movie-item-img'
                                    src={getImages(item.images.large)}
                                    mode='aspectFill'
                                  />
                                  <Text className='movie-item-text'>{item.title}</Text>
                                </View>
                              </Navigator>
                            );
                          })
                        }
                      </View>
                    </ScrollView>
                  </View>
                );
              })
            }
        </View>
      </View>
    );
  }
}
