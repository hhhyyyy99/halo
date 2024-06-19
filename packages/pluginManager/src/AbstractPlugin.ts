import { PluginLifecycle } from "./Plugin";

export interface IAbstractPlugin<TContext = Record<string | number | symbol, any>> {
    name: string | symbol;
    version?: string;
    setContext(context: TContext): void;
    getContext(): TContext;
}

export enum PluginEnforce {
    Pre = "pre",
    Post = "post",
    Normal = "normal"
}

export default abstract class AbstractPlugin<TContext = Record<string | number | symbol, any>> implements IAbstractPlugin<TContext> {
    /**
     * The runtime context of the plug-in
     */
    private _context: TContext;

    constructor() {
        this._context = {} as TContext;
    }

    /**
     * The name of the plug-in
     */
    abstract name: string | symbol;

    /**
     * The version number of the plug-in
     */
    version?: string;

    /**
     * Define the order of plugin execution. If set to a certain value,
     * it applies to all lifecycles in the entire plugin (for example, if set to pre, each lifecycle is executed by pre)
     *
     * If you need to control the execution order of each lifecycle, you can configure an object.
     * - Key is the name of the lifecycle
     * - Value is the order of execution of the lifecycle
     */
    enforce?: Partial<Record<PluginLifecycle, PluginEnforce | string>> | PluginEnforce | string;

    /**
     * This function will be called when the plug-in is registered,
     * passing the current runtime context to each plug-in so that the plug-in can communicate directly
     */
    public setContext(context: TContext): void {
        this._context = context;
    }

    /**
     * You can get the runtime context inside the plugin by modifying the function
     */
    public getContext(): TContext {
        return this._context;
    }
}