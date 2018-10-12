/**
 * @file 测试用例
 * @author david wang 
 */
import { AxioPlus } from "../index";
const httpClient = AxioPlus.createClient({});
describe('http client',()=>{
    test('post',()=>{
        (httpClient as any).post('/',{})
            .subscribe(({result,response})=>{
                expect(result).toBe(null);
            })
    });
    it('get',()=>{
        (httpClient as any).get('/',{'example': '2'})
            .subscribe(({result,response})=>{
                console.log(response);
            })
    })
})