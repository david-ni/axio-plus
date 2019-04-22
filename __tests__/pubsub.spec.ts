import { PubSub } from "../src/pubsub";

describe("pubsub",()=>{
    test("main",()=>{
        const pubSub = new PubSub();
        pubSub.on("event1",(arg)=>{
            expect(arg).toBe(1);
        });
        pubSub.on("event1",(arg)=>{
            expect(arg).toBe(1);
        });
        pubSub.emit("event1",1);
    });
    test("no topic",()=>{
        const pubSub = new PubSub();
        const result = pubSub.emit("event1",1);
        expect(result).toBe(undefined);
    });
});