import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import MovieList from '@/components/MovieList';
import { GLOBAL_CONFIG } from '@/constants/globalConfig';
import api from '@/services/api';

import './style.less';

export default class Search extends Component {
  config = {
    enablePullDownRefresh: false
  };

  constructor(props) {
    super(props);
    this.setState({
      subtitle: '请在此输入搜索内容',
      search: '',
      hasMore: false,
      page: 1,
      count: 20,
      movies: []
    });
  }

  componentDidMount() {
    this.loadSearchList();
  }

  onReachBottom() {
    this.loadSearchList();
  }

  loadSearchList() {
    const {hasMore, page, count, search} = this.state;
    if (!hasMore) return;

    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT});

    api.get('/search', {
      q: search,
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
        this.setState((prevState) => ({
          movies: prevState.movies.concat(list),
          page: prevState.page + 1
        }));
      } else {
        this.setState({
          hasMore: false
        });
      }
      Taro.hideLoading();
    }).catch(() => {
      Taro.hideLoading();
    });
  }

  handleSearch = (e) => {
    if (!e.detail.value) return;

    this.setState({
      subtitle: '加载中...',
      search: e.detail.value,
      hasMore: true
    }, () => {
      this.loadSearchList();
    });
  };

  render() {
    const {movies, subtitle} = this.state;
    return (
      <View className='search-wrap'>
        <View className='header'>
          <Input
            className='search'
            placeholder={subtitle}
            placeholder-class='search-placeholder'
            focus
            onInput={this.handleSearch} />
        </View>
        <MovieList movies={movies} />;
      </View>
    );
  }
}
