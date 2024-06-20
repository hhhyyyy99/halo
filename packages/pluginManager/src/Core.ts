import PluginEventEmitter, {PluginEventEmitterType} from "./PluginEventEmitter";
import ProxySandBox from "./Sandbox";
import {ScriptPlugin, ScriptType} from "./interface";
export interface CoreConfig{
    plugins?: PluginEventEmitterType[];
}
export class PluginManager extends PluginEventEmitter{
    private sandboxMap = new Map<string, ProxySandBox>()
    private scriptPlugins = new Set<ScriptPlugin['name']>()
    constructor(private readonly coreConfig:CoreConfig = {} ) {
        super(coreConfig);
        this.mountPlugins()
    }
    private mountPlugins() {
        const { plugins = [] } = this.coreConfig;
        const defaultPlugins = [...plugins];
        this.register(defaultPlugins);
        this.initPluginContext(defaultPlugins, this);
    }
    public registerScript(plugin:  ScriptPlugin[] | ScriptPlugin){
        const plugins = Array.isArray(plugin) ? plugin : [plugin];
        plugins.forEach((plugin) => {
            if(this.scriptPlugins.has(plugin.name)){
                console.log(`${plugin.name}已被注册`)
                return;
            }
            this.scriptPlugins.add(plugin.name);
            this.initPlugin(plugin)
        });
    }
    public initPlugin(plugin:ScriptPlugin){
        const { name, context,type } = plugin;
        const sandbox = new ProxySandBox(name)
        const head = document.getElementsByTagName('head')[0]
        const script = document.createElement('script')
        script.type = 'text/javascript';
        switch (type){
            case ScriptType.URL:
                // TODO: 加载远程脚本, 并注入到sandbox中,思路是通过请求获取脚本内容然后执行runScript方法
                script.src = context;
                break;
            case ScriptType.CODE:
                this.runScript(sandbox.proxy, context)
                break;
            default:
                console.log(`脚本类型${type}不支持`)
                return;
        }
        script.id = name;
        this.sandboxMap.set(name, sandbox)
        head.appendChild(script)
    }
    public runScript(globalThis: WindowProxy,code:string){
        const func = new Function("globalThis", code);
        func(globalThis);
    }
    public unregisterScript(plugin: ScriptPlugin): void {
        if (!this.scriptPlugins.has(plugin.name)) {
            console.warn(`The plugin "${plugin.name}" is not registered.`);
            return;
        }
        const sandbox = this.sandboxMap.get(plugin.name)
        if (sandbox) {
            const script = document.getElementById(plugin.name)
            if (script) {
                script.remove()
            }
            sandbox.clearUpdatedValueSet()
            this.sandboxMap.delete(plugin.name)
            this.scriptPlugins.delete(plugin.name);
        }
    }
}
