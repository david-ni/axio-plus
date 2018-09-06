/**
 * @file 测试用例
 * @author david wang 
 */
import { HttpClient } from "../index";

describe('http client',()=>{
    test('post',()=>{
        let httpClient = HttpClient.createClient({});
        (httpClient as any).post('/',{})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
            })
    });
})