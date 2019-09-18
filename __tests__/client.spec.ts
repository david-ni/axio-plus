/**
 * @file 测试用例
 * @author david wang 
 */
import { AxioPlus } from "../index";
import { HttpErrorCodeType } from "../src/enum";
describe('http client',()=>{
    test('post',(done)=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://192.168.30.20/"});
        httpClient.post('/',{})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
                done();
            })
    });
    test('get',(done)=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://192.168.30.20/"});
        httpClient.get('/',{'example': '2'})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
                done();
            })
    });
    test('timeout',(done)=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://100.100.1.110"});
        httpClient.get('/',{'example': '2'},{ timeout: 2000 })
            .subscribe(({result,response,isSuccess})=>{
                expect(isSuccess).toBe(false);
                expect(response.message).toEqual(
                    expect.stringMatching(/timeout/g)
                );
                done();
            })
    });
    test('listen notFound',(done)=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://192.168.30.20/"});
        httpClient.listen((topic)=>{
            // https://stackoverflow.com/questions/50930249/failing-expect-inside-subscribe-does-not-mark-test-as-invalid
            // fix bug https://github.com/superTerrorist/axio-plus/issues/1
            expect(topic).toBe(HttpErrorCodeType.UnAuth);
            done();
        });
        (httpClient as any).get('/notFound',{})
            .subscribe(({result,response})=>{});
    });
})