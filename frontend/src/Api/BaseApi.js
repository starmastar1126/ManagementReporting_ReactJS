import axios from 'axios';

import ApiConfig from '../Config/ApiConfig';

class BaseApi {

  _baseDevURL = ApiConfig.baseDevURL;
  _baseProURL = ApiConfig.baseProURL;
  _api = null;

  constructor() {
    const baseURL = process.env.NODE_ENV === 'production' ? this._baseProURL : this._baseDevURL;

    if(!this._api){
      this._api = axios.create({
        baseURL,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 60000,
      });

      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'){
        return;
      }

      this._api.interceptors.request.use(function (config) {
        console.log('%cREQUEST: '+config.method.toUpperCase() + ' %c'+ config.baseURL + config.url ,  'color: blue; font-weight: bold;', 'color: black;font-weight: normal;', config.data, config.headers);
        return config;
      }, function (error) {
        console.log('%cREQUEST: '+error , 'color: red; font-weight: bold;');
        return Promise.reject(error);
      });

      this._api.interceptors.response.use(function (response) {
        console.log('%cRESPONSE: '+response.status + ' %c'+  response.config.url,  'color: blue; font-weight: bold;', 'color: black;font-weight: normal;', response.data);
        return response;
      }, function (error) {
        console.log('%cRESPONSE: '+error , 'color: red; font-weight: bold;');
        return Promise.reject(error);
      });
    }
  }

  get baseUrl() {
    return process.env.NODE_ENV === 'production' ? this._baseProURL : this._baseDevURL;
  }

  get api() {
    return this._api;
  }

  get authToken() {
    return this._api.defaults.headers.common['Authorization'];
  }

  set authToken(token) {
    if (token === null) {
      delete this._api.defaults.headers.common['Authorization'];
      return;
    }
    this._api.defaults.headers.common['Authorization'] = "Bearer " + token;
  }
}

export default new BaseApi;
