import Taro, { Component } from '@tarojs/taro';
import { Navigator, Image, View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import { getImages } from '@/utils/index';

import './style.less';

export default class MovieList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }

  static propTypes = {
    movies: PropTypes.array
  };

  static defaultProps = {
    movies: [],
  };

  render() {
    const {movies} = this.props;
    return (
      <View className='movie-list-container'>
        {
          movies.map((movie) => {
            return (
              <Navigator url={'/pages/item/index?id=' + movie.id} key={movie.id}>
                <View className='item'>
                  <Image
                    className='poster'
                    src={getImages(movie.images.small)}
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
                    <Text className='rating-text'>{movie.rating.average}</Text>
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
