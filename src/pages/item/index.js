import Taro, { Component } from '@tarojs/taro';
import { Image, Text, View } from '@tarojs/components';
import { GLOBAL_CONFIG } from '@/constants/globalConfig';
import { getImages } from '@/utils/index';
import api from '@/services/api';

import './index.less';

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: '',
      movie: {}
    };
  }

  componentWillMount() {
    let params = this.$router.params;
    this.setState({
      id: params.id
    });
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT});
    this.loadSubject();
  }

  loadSubject() {
    const {id} = this.state;
    api.get('/subject/' + id, {})
      .then((res) => {
        const {data} = res.data;
        this.setState({
          title: data.title,
          movie: data
        });
        Taro.setNavigationBarTitle({
          title: data.title + ' « 电影 « 豆瓣'
        });
        Taro.hideLoading();
      }).catch(() => {
      Taro.hideLoading();
    });
  }

  render() {
    const {movie} = this.state;
    if (!movie.images) return <View />;
    return (
      <View className='item-container'>
        {
          <Image
            src={getImages(movie.images.large)}
            className='background'
            mode='aspectFill'
          />
        }
        <View className='meta'>
          {
            <Image
              src={getImages(movie.images.large)}
              className='poster'
              mode='aspectFill'
            />
          }
          <Text className='title'>{movie.title}({movie.year})</Text>
          <Text className='info'>评分：{movie.rating.average}</Text>
          <Text className='info'>导演：
            {
              movie.directors.length > 0 &&
              movie.directors.map((item) => item.name + '\t')
            }
          </Text>
          <Text className='info'>主演：
            {
              movie.casts.length > 0 &&
              movie.casts.map((item) => item.name + '\t')
            }
          </Text>
        </View>
        <View className='summary'>
          <Text className='label'>摘要：</Text>
          <Text className='content'>{movie.summary}</Text>
        </View>
      </View>
    )
  }
}
