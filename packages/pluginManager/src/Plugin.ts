export interface PluginDefine {
    /**
     * on register plugin
     */
    onRegister: (context: any) => any;

    /**
     * Called after the plug-in has been initialized
     * You can get the context by this.getContext() and do more (you can customize it)
     */
    onInit: () => any;

    onError: (error: any) => any;
    /**
     * destroy
     */
    onDestroy: () => any;
}

export interface Plugin extends Partial<PluginDefine> {
    [key: string]: any;
};
export type PluginLifecycle = keyof PluginDefine;
