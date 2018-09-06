/**
 * @file 类型定义
 * @author david wang 
 */

import { CacheType,HttpObserveType } from "./enum";

/**
 * @interface http 成功返回（一般指的是status < 300 && status >= 200）的内容关键字
 */
export interface HttpResponseSuccessResultKeyType{
    /**
     * 状态码 
     */
    code?: string|number,
    /**
     * 内容数据 
     */
    data?: any,
    /**
     * 消息 
     */
    message?: string
}

/**
 * http消息的格式 
 */
export interface HttpMessageType{
    /**
     * 消息类型 
     */
    type: 'error'|'warning'|'info'|'success',
    /**
     * 消息内容 
     */
    content: string|((response: any,options: HttpRequestOptionsType)=> void) 
}

/**
 * @interface http 配置项 
 */
export interface HttpConfigType{
    /**
     * 请求基础路径 
     */
    baseUrl?: string,
    /**
     * 缓存类型 
     */
    cache?: CacheType,
    /**
     * timeout 
     */
    timeout?: number,
    /**
     * 缓存时间 为0表示不缓存
     */
    cacheDuration?: number,
    /**
     * 用于附加到url上，以便阻止浏览器缓存，默认为'forbid_cache_key'
     */
    forbidCacheKey?: string,
    /**
     * 服务端成功返回内容关键字
     */
    responseResultKey?: HttpResponseSuccessResultKeyType,
    /**
     * 服务端返回成功的状态码
     */ 
    successCode?: Array<number|string>,
    /**
     * 自定义请求失败时返回的消息 
     */
    returnErrorMessage?: {[code:string]: string},
    /**
     * validateStatus 
     */
    validateStatus?: (status: number)=>boolean;
}

/**
 * @interface 请求配置项 
 */
export interface HttpRequestOptionsType extends HttpConfigType{
    /**
     * body 
     */
    body?: any,
    /**
     * 请求头 
     */
    header?: {[header:string]: string},
    /**
     * 附加到url上的参数
     */
    params?: {[param:string]: string},
    /**
     * 返回的响应体类型
     */
    observe?: HttpObserveType,
    /**
     * 返回的body的类型
     */
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    /**
     * 是否允许携带身份信息（cookie等） 
     */
    withCredentials?: boolean
}