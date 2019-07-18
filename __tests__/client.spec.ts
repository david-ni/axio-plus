/**
 * @file 测试用例
 * @author david wang 
 */
import process from "process";
import { AxioPlus } from "../index";
import { HttpErrorCodeType } from "../src/enum";
describe('http client',()=>{
    test('post',()=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://192.168.30.20/"});
        httpClient.post('/',{})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
            })
    });
    test('get',()=>{
        const httpClient = AxioPlus.createClient();
        httpClient.init({baseUrl: "http://192.168.30.20/"});
        httpClient.get('/',{'example': '2'})
            .subscribe(({result,response})=>{
                console.log(response);
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