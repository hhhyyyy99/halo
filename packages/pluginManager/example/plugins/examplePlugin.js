import {AbstractPlugin} from "../../dist/index.js";

export default class ExamplePlugin extends AbstractPlugin{
    constructor(config={}) {
        super();
    }
    onRegister(context){
        console.log("example plugin register",context)
    }
    onInit(){
        console.log("example plugin init")
    }
    onDestroy(context){
        console.log("example plugin destroy")
    }
}