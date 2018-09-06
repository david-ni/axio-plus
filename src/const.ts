/**
 * @file http 常量
 * @author david wang 
 */
import { CacheType,HttpObserveType } from './enum';
import { HttpConfigType,HttpRequestOptionsType } from './type';
/**
 * @const http 全局默认配置项
 */
export const HTTP_DEFAULT_CONFIG:HttpConfigType = {
	cache: CacheType.Normal,
	cacheDuration: 0,
	forbidCacheKey: 'forbid_cache',
	timeout: 0,
	validateStatus: function(status) {
		return status >= 200 && status < 300;
	},
	responseResultKey: {
		code: 'code',
		data: 'data',
		message: 'message'
	},
	successCode: [0],
	returnErrorMessage: {}
};

/**
 * @const 请求配置项 作用于单一请求
 */
export const HTTP_DEFAULT_REQUEST_OPTION:HttpRequestOptionsType = {
	observe: HttpObserveType.Body,
	responseType: 'json',
	withCredentials: false
};
