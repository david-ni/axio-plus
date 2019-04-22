/**
 * @file 测试用例
 * @author david wang 
 */
import { AxioPlus } from "../index";
import { HttpErrorCodeType } from "../src/enum";
describe('http client',()=>{
    test('post',()=>{
        const httpClient = AxioPlus.createClient({});
        (httpClient as any).post('/',{})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
            })
    });
    test('get',()=>{
        const httpClient = AxioPlus.createClient({});
        (httpClient as any).get('/',{'example': '2'})
            .subscribe(({result,response})=>{
                console.log(response);
            })
    });
    test('listen',()=>{
        const httpClient = AxioPlus.createClient({baseUrl: "http://192.168.30.20/"});
        httpClient.listen((topic)=>{
            expect(topic).toBe(HttpErrorCodeType.NotFound);
        });
        (httpClient as any).get('/notFound',{})
            .subscribe(({result,response})=>{})
    })
})