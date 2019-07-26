import Taro, { Component } from '@tarojs/taro';
import { Navigator, Image, View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.less';

export default class MovieList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  static propTypes = {
    hasMore: PropTypes.bool
  };

  static defaultProps = {
    hasMore: false
  };

  componentDidMount() {
  }

  render() {
    const {movies} = this.state;
    if (!movies.length) return <View />;
    return (
      <View className='movie-list-container'>
        {
          movies.map((movie) => {
            return (
              <Navigator url={'/pages/item/index?id=' + movie.id} key={movie.id}>
                <View className='item'>
                  <Image
                    className='poster'
                    src={movie.images.small}
                  />
                  <View className='meta'>
                    <Text className='title'>{movie.title}</Text>
                    <Text className='sub-title'>{movie.original_title} ({movie.year})</Text>
                    <View className='artists'>导演：
                      {
                        movie.directors.length > 0 &&
                        movie.directors.map((item) => item.name + '\t')
                      }
                    </View>
                  </View>
                  <View className='rating'>
                    <Text>{movie.rating.average}</Text>
                  </View>
                </View>
              </Navigator>
            );

          })
        }
      </View>
    );
  }
}
