/**
 * @file http response
 * @author david wang
 */

import { HttpEventType } from './enum';
import { HttpRequestOptionsType } from './type';

/**
 * @class 进度事件
 */
class HttpProgressEvent {
	/**
	 * 事件进度类型 
	 */
	type: string;
	/**
	 * 已传输的数量 
	 */
	loaded: number;
	/**
	 * 数据总量 
	 */
	total: number;
}

/**
 * @class 上传进度事件类型
 */
export class HttpUploadProgressEvent extends HttpProgressEvent {
	constructor(event) {
		super();
		this.type = HttpEventType.Uploading;
		this.loaded = event.loaded;
		if (event.lengthComputable) {
			this.total = event.total;
		}
	}
}

/**
 * @class 下载进度事件
 */
export class HttpDownloadProgressEvent extends HttpProgressEvent {
	constructor(event) {
		super();
		this.type = HttpEventType.Downloading;
		this.loaded = event.loaded;
		if (event.lengthComputable) {
			this.total = event.total;
		}
	}
}

/**
 * @class 响应错误
 * @description 本类的目的是统一错误接口
 */
export class HttpResponseError{
	/**
	 * 状态码 
	 */
	readonly status: number;
	/**
	 * 状态文字 
	 */
	readonly statusText: string;
	/**
	 * 响应头 
	 */
	readonly headers: any;
	/**
	 * 错误消息 
	 */
	readonly message: string;
	/**
	 * 错误码 
	 */
	readonly errorCode: number;
	/**
	 * 返回数据
	 */
	readonly data: any;
	constructor(
		error:any = {}, 
		options:HttpRequestOptionsType = {}
	){
		const response = error.response;
		// 如果有返回请求有收到反馈
		if(response){
			let data = response.data;
			let responseKey = options.responseResultKey;
			let status = this.status = response.status;
			this.statusText = response.statusText;
			this.headers = response.headers;
			this.message = data
				? data[responseKey.message] || response.message
				: response.message;
			this.errorCode = data ? data[responseKey.code] : status;
			this.data = data;
		}else{
			this.errorCode = error.code;
			this.message = error.message;
		}
	}
}
