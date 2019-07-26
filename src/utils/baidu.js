import api from '../services/api';

const URI = 'https://api.map.baidu.com';

/**
 * 根据经纬度获取城市
 *
 * @param {number} [latitude=39.90403]
 * @param {number} [longitude=116.407526]
 * @returns {Promise} promise对象
 */
function getCityName(latitude = 39.90403, longitude = 116.407526) {
  const params = {
    location: `${latitude},${longitude}`,
    output: 'json',
    ak: 'GGALPpTghq5ZvZwouPid0Txx6cVogim0'
  };

  return api.get(URI + '/geocoder/v2/', params)
    .then((res) => res.data.result.addressComponent.city);
}

export default getCityName;
