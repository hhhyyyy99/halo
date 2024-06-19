import {PluginLifecycle, PluginDefine,Plugin} from "./Plugin";
import { IAbstractPlugin } from "./AbstractPlugin";

export interface PluginEventEmitterType extends Plugin, IAbstractPlugin {}
export default class PluginEventEmitter extends Set<PluginEventEmitterType> {
    constructor(private readonly coreContext = {}) {
        super();
    }
    public register(
        plugin: PluginEventEmitterType[] | PluginEventEmitterType
    ): void {
        const plugins = Array.isArray(plugin) ? plugin : [plugin];
        plugins.forEach((plugin) => {
            this.add(plugin);
            plugin.onRegister?.(this.coreContext);
        });
    }
    public initPluginContext(
        plugins: PluginEventEmitterType[] | PluginEventEmitterType,
        core: any
    ): void {
        const pluginsArray = Array.isArray(plugins) ? plugins : [plugins];
        pluginsArray.forEach((plugin) => {
            plugin.setContext?.(core);
        });
        this.run("onInit");
    }
    public unregister(plugin: PluginEventEmitterType): void {
        plugin.onDestroy?.();
        this.delete(plugin);
    }
    /**
     * filters plugins by lifecycle
     *
     * @param lifecycle PluginLifecycle
     * @returns Plugin[Lifecycle][]
     */
    public filters<Lifecycle extends PluginLifecycle = PluginLifecycle>(
        lifecycle: Lifecycle
    ): PluginDefine[Lifecycle][] {
        return Array.from(this)
            .map((plugin) => {
                if (plugin[lifecycle] && typeof plugin[lifecycle] === "function") {
                    // @ts-ignore
                    return plugin[lifecycle]!.bind(plugin);
                }
                return undefined;
            })
            .filter(Boolean) as PluginDefine[Lifecycle][];
    }

    /**
     * @title filters plugins by lifecycle and calls them
     */
    run<Lifecycle extends PluginLifecycle = PluginLifecycle>(
        lifecycle: Lifecycle,
        ...args: Parameters<PluginDefine[Lifecycle]>
    ) {
        const plugins = this.filters<Lifecycle>(lifecycle);
        plugins.forEach((plugin) => {
            // @ts-ignore
            plugin.apply(plugin, args);
        });
    }

    /**
     * filters plugins by lifecycle and calls them synchronously
     */
    public async runSync<Lifecycle extends PluginLifecycle = PluginLifecycle>(
        lifecycle: Lifecycle,
        ...args: Parameters<PluginDefine[Lifecycle]>
    ) {
        for (const iterator of this.filters<Lifecycle>(lifecycle)) {
            // @ts-ignore
            await iterator.apply(iterator, args);
        }
    }

    /**
     * @title filters plugins by lifecycle and calls them in an onion-like fashion
     *
     * @param lifecycle PluginLifecycle to filter
     * @param args arguments to pass to the plugins lifecycle method (e.g. onInit)
     * @returns ReturnType<PluginDefine[Lifecycle]> | undefined | void
     */
    public runOnion<Lifecycle extends PluginLifecycle = PluginLifecycle>(
        lifecycle: Lifecycle,
        ...args: Parameters<PluginDefine[Lifecycle]>
    ): ReturnType<PluginDefine[Lifecycle]> | undefined | void {
        const plugins = this.filters<Lifecycle>(lifecycle);
        return plugins.reduce((prev, plugin) => {
            // @ts-ignore
            return plugin.apply(plugin, args) ?? prev;
        }, undefined);
    }

    /**
     * @title filters plugins by lifecycle and calls them in an onion-like fashion asynchronously
     *
     * @param lifecycle PluginLifecycle to filter
     * @param args arguments to pass to the plugins lifecycle method (e.g. onInit)
     * @returns Promise<ReturnType<PluginDefine[Lifecycle]> | undefined | void>
     */
    public runOnionAsync<Lifecycle extends PluginLifecycle = PluginLifecycle>(
        lifecycle: Lifecycle,
        ...args: Parameters<PluginDefine[Lifecycle]>
    ): Promise<ReturnType<PluginDefine[Lifecycle]> | undefined | void> {
        const plugins = this.filters<Lifecycle>(lifecycle);
        return plugins.reduce(async (prev, plugin) => {
            const prevResult = await prev;
            // @ts-ignore
            return await plugin.apply(plugin, args) ?? prevResult;
        }, Promise.resolve(undefined));
    }

    /**
     * @title Find the plug-in by its name
     */
    getPluginByName(pluginName: string | symbol): PluginEventEmitterType | undefined {
        return Array.from(this).find((plugin) => plugin.name === pluginName);
    }
}
