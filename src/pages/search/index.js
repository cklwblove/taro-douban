import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

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
      hasMore: false
    });
  }

  render() {
    return (
      <View></View>
    );
  }

}
