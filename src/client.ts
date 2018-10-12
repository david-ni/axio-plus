/**
 * @file http
 * @author david wang
 */

import Axios from 'axios';
import { Observable, of } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpConfigType,HttpRequestOptionsType } from "./type";
import { HttpErrorCodeType, HttpObserveType } from './enum';
import { HTTP_DEFAULT_CONFIG, HTTP_DEFAULT_REQUEST_OPTION } from './const';
import {
	HttpUploadProgressEvent,
	HttpDownloadProgressEvent,
	HttpResponseError
} from './response';

class HttpClient {
	/** @private 公共头部 */
	private _commonHeader: Object = {};
	/** @private 全局配置项 */
	private _config: HttpConfigType = {};
	/**
	 * @private 判断是否是合法的请求方法
	 * @param { string } method 方法名
	 * @return { boolean } true or false
	 */
	private _isValidMethod(method: string):boolean{
		return [
			'delete',
			'get',
			'head',
			'options',
			'patch',
			'post',
			'put',
			'jsonp'
		].includes(method);
	}
	/**
	 * @private 参数转换
	 * @param { object } params 要转换的参数
	 * @return { string } 转换的值
	 */
	private _convertParam(params:object):string{
		if (!params) return '';
		let queryKeys = Object.keys(params);
		let array = [];
		for (let key of queryKeys) {
			if (typeof params[key] !== 'undefined') {
				array.push(
					`${encodeURIComponent(key)}=${encodeURIComponent(
						params[key]
					)}`
				);
			}
		}
		return array.join('&');
	}
	/**
	 * @private 获取请求路径
	 * @param { string } url 路径
	 * @param { string } params 参数
	 * @return { string } url
	 */
	private _getUrl(url:string, params:string = '') {
		if (params) url += /\?$/.test(url) ? `${params}` : `?${params}`;
		return url;
	}
	/**
	 * @private 获取header
	 * @param { object } header header
	 * @return { object } header
	 */
	private _getHeader(header:{[key:string]:any} = {}) {
		return { ...this._commonHeader, ...header };
	}
	/**
	 * @private 发送请求
	 * @param { string } method 请求方法
	 * @param { string } url 请求地址
	 * @param { HttpRequestOptionType } options 配置
	 * @return { object } < Observable<any> >
	 */
	private _request(method:string, url:string, options:HttpRequestOptionsType = {}):Observable<any>{
		return new Observable((observer) => {
			if (!url) throw new Error('the url is required!');
			//校验是否是合法的方法
			if (!this._isValidMethod(method)) throw new Error(`method ${method} is not valid!`);
			//获取参数
			let params;
			if (!!options.params) params = this._convertParam(options.params);
			//获取请求路径
			url = this._getUrl(url, params);
			//获取header
			let header = this._getHeader(options.header);
			//cancel Token
			let cancelToken = Axios.CancelToken;
			let cancelSource = cancelToken.source();
			//发送请求
			Axios.request({
				method: method,
				url: url,
				baseURL: options.baseUrl,
				data: options.body,
				headers: header,
				withCredentials: !!options.withCredentials,
				responseType: options.responseType || 'json',
				onUploadProgress: function(progressEvent) {
					observer.next(new HttpUploadProgressEvent(progressEvent));
				},
				onDownloadProgress: function(progressEvent) {
					observer.next(new HttpDownloadProgressEvent(progressEvent));
				},
				cancelToken: cancelSource.token,
				validateStatus: (status) => {
					let validateStatus = this._config.validateStatus;
					if (typeof validateStatus === 'function')
						return validateStatus(status);
					console.warn(
						'the option validateStatus must be function that return boolean!'
					);
					return false;
				}
			})
			.then((response) => {
				observer.next(response);
				observer.complete();
			})
			.catch((error) => {
				observer.error(
					new HttpResponseError(
						error.response || error.request || error,
						options
					)
				);
			});
			// 返回一个取消订阅的函数
			return () => {
				//取消请求
				cancelSource.cancel();
			};
		});
	}

	/**
	 * 处理json返回数据
	 * @param { object } json 返回的json值
	 * @param { object } response response
	 * @param { object } options 当前请求的配置项
	 * @return { any } 返回object|httpResponseError
	 */
	private _handleJsonResponse(json:object, response:object, options:HttpRequestOptionsType):Object|HttpResponseError{
		let responseKey = options.responseResultKey;
		let successCode = options.successCode;
		let keyCode = responseKey.code;
		//判断是否是成功的
		if (!Array.isArray(successCode)) successCode = [successCode];
		if (
			json &&
			typeof json[keyCode] !== 'undefined' &&
			successCode.indexOf(json[keyCode]) !== -1
		) {
			// --todo http 缓存
			//返回数据内容
			return json[responseKey.data];
		} else {
			//抛出异常
			return new HttpResponseError(response, options);
		}
	}

	/**
	 * 错误返回处理
	 * @param { any } err 错误对象
	 * @param { object } options 配置项
	 * @return { void }
	 */
	private _handleResponseError(err: HttpResponseError, options:HttpRequestOptionsType):void{
		//消息配置项
		let returnErrorMessage = options.returnErrorMessage;
		let config = null;
		//错误码
		let status = err.status;
		if(!returnErrorMessage || typeof returnErrorMessage !== 'object') return;
		//处理一些常见的 status
		if(status >= 500) config = returnErrorMessage[HttpErrorCodeType.Server];
		if(status === 0) config = returnErrorMessage[HttpErrorCodeType.Offline];
		if(status === 401) config = returnErrorMessage[HttpErrorCodeType.UnAuth];
		if(status === 404) config = returnErrorMessage[HttpErrorCodeType.NotFound];
		if(!config) return;
		if(typeof config.content === 'function') {
			config.content(err, options);
		}else{
			//todo 默认处理函数
			console.error(err);
		}
	}

	/**
	 * 设置公共头
	 * @param { string } key header key
	 * @param { any } value header value
	 * @return { void }
	 */
	setCommonHeader(key:string, value:any):void{
		this._commonHeader[key] = value;
	}

	/**
	 * @private 发送请求
	 * @param { string } method 请求方法
	 * @param { string } url 请求地址
	 * @param { HttpRequestOptionType } options 配置
	 * @return { Object } < Observable<any> >
	 */
	request(method: string, url: string, options:HttpRequestOptionsType = {}) {
		let config = this._config;
		//拼合配置项
		options = { ...HTTP_DEFAULT_REQUEST_OPTION, ...config, ...options };
		return this._request(method, url, options).pipe(
			filter((response) => {
				//不要求跟踪事件，那么就过滤它
				if (options.observe !== HttpObserveType.Event) {
					return !(
						response instanceof HttpDownloadProgressEvent ||
						response instanceof HttpUploadProgressEvent
					);
				}
				return true;
			}),
			map((response) => {
				if (options.observe === HttpObserveType.Body) {
					let data = response.data;
					let result = data;
					//如果返回的是json数据
					if (
						options.responseType === 'json' &&
						typeof data === 'object'
					) {
						result = this._handleJsonResponse(
							data,
							response,
							options
						);
						//如果结果不成功
						if (result instanceof HttpResponseError) {
							throw result;
						} else {
							return { result, response, isSuccess: true };
						}
					}
					return { result, response, isSuccess: true };
				}
				return response;
			}),
			catchError((error) => {
				if (error instanceof HttpResponseError) {
					this._handleResponseError(error, options);
				} else {
					console.error(error);
				}
				//返回null
				return of({ result: null, response: error, isSuccess: false });
			})
		);
	}

	/**
	 * 初始化
	 * @param { object } config 配置项
	 * @return { void }
	 */
	init(config:HttpConfigType = {}) {
		this._config = { ...HTTP_DEFAULT_CONFIG, ...config };
		['post'].forEach((method) => {
			this[method] = function(url, body, options:HttpRequestOptionsType = {}) {
				options.body = body || {};
				return this.request(method, url, options);
			};
		});
		['get', 'put', 'delete'].forEach((method) => {
			this[method] = function(url, body, options:HttpRequestOptionsType = {}) {
				options.params = body || {};
				return this.request(method, url, options);
			};
		});
		return this;
	}
}

export default {
	createClient: (config)=>{
		return new HttpClient().init(config);
	}
}
