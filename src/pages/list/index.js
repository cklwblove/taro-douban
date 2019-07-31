import Taro, { Component } from '@tarojs/taro';
import { Image, Navigator, Text, View } from '@tarojs/components';
import MovieList from '@/components/MovieList';
import { GLOBAL_CONFIG } from '@/constants/globalConfig';
import { getImages } from '@/utils/index';
import api from '@/services/api';

import './style.less';

export default class List extends Component {

  config = {
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      type: 'in_theaters',
      hasMore: true,
      page: 1,
      count: 20,
      movies: []
    };
  }

  componentWillMount() {
    let {title, type} = this.$router.params;
    title = decodeURIComponent(title);
    this.setState({
      title,
      type
    });
    Taro.setNavigationBarTitle({
      title: title + ' « 电影 « 豆瓣'
    });
  }

  componentDidMount() {
    this.loadList();
  }

  onPullDownRefresh() {
    this.loadList(this.state.type, true);
  };

  onReachBottom () {
    this.loadList(this.state.type);
  };

  loadList(type = 'in_theaters', isPullDown) {
    const {hasMore, page, count, movies} = this.state;
    if (!hasMore) return;

    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT});

    api.get('/' + type, {
      type,
      start: page,
      count
    }).then((res) => {
      let list = [];
      const {data} = res.data;
      if (Array.isArray(data.subjects) && data.subjects.length) {
        list = data.subjects.map((v) => {
          // 北美电影排行的API中数据格式与普通的API不同，这里是渲染北美电影排行的数据
          if (v.subject) {
            return v.subject;
          } else {
            return v;
          }
        });
        this.setState({
          movies: movies.concat(list),
          page: page + 1
        });
      } else {
        this.setState({
          hasMore: false
        });
      }
      Taro.hideLoading();

      if (isPullDown) {
        Taro.stopPullDownRefresh();
      }
    }).catch(() => {
      Taro.hideLoading();
      if (isPullDown) {
        Taro.stopPullDownRefresh();
      }
    });
  }

  render() {
    const {movies} = this.state;
    if (!movies.length) return <View />;
    return (
      <View className='movie-list-wrap'>
        <MovieList movies={movies}/>
      </View>
    );
  }
}
