/**
 * 事件订阅和发布
 * @author david wang
 */
export class PubSub{
    private _topics: {[topic: string]: Function[]} = {};
    /**
     * 订阅 
     * @param topic  
     * @param handle
     */
    on(topic: string,handle: Function ):void{
        if(topic in this._topics){
            this._topics[topic].push(handle);
        }else{
            this._topics[topic] = [handle];
        }
    }
    /**
     * 发布
     * @param topic 
     * @param args
     */
    emit(topic: string,...args: any[]):void{
        if(!(topic in this._topics)) return;
        const handles = this._topics[topic];
        handles.forEach((handle)=>{
            if(typeof handle !== "function") return;
            handle.apply(null,args);
        });
    }
    /**
     * clear 
     */
    clear(){
        this._topics = {};
    }
}
