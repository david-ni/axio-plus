/**
 * @file http 类型
 * @author david wang
 */

/**
 * @enum 缓存的类型 
 */
export enum CacheType{
	/**
	 * 每次请求都先检查是否存在缓存，
	 * 如果使用缓存
	 * 如果不存在，则缓存最新值 
	 */
	Always = 'always',
	/**
	 * 每次请求都不缓存 
	 * 会默认给请求地址附加上forbid_cache_key
	 */
	Never = 'never',
	/**
	 * 既不缓存也不附加forbid_cache_key
	 */
	Normal = 'normal'
}

/**
 * @enum http错误码类型
 */
export enum HttpErrorCodeType{
	//服务器端错误
	Server = 'server',
	//断网
	Offline = 'offline',
	//未授权
	UnAuth = 'unauth',
	//404
	NotFound = 'notfound',
	// unknow
	UnKnow = 'unknow'
};

/**
 * @enum http 事件类型 
 */
export enum HttpEventType{
	/**
	 * 请求发送 
	 */
	Send = 'send',
	/**
	 * 上传中 
	 */
	Uploading = 'uploading',
	/**
	 * 下载中 
	 */
	Downloading = 'downloading',
	/**
	 * 成功响应
	 */
	Response = 'response'
};

/** 
 * @enum http观察类型 
 */
export enum HttpObserveType{
	// 此类型返回的是response 具体数据
	Body = 'body',
	// 此类型返回上传/下载事件
	Event = 'event',
	// 此类型返回响应对象
	Response = 'response'
};
