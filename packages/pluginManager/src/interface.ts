export enum SandBoxType {
    Proxy = 'Proxy',
    Snapshot = 'Snapshot',
    LegacyProxy = 'LegacyProxy',
}

export type SandBox = {
    /** 沙箱的名字 */
    name: string;
    /** 沙箱的类型 */
    type: SandBoxType;
    /** 沙箱导出的代理实体 */
    proxy?: WindowProxy;
    /** 沙箱是否在运行中 */
    sandboxRunning?: boolean;
    /** latest set property */
    latestSetProp?: PropertyKey | null;
    /** 启动沙箱 */
    active?: () => void;
    /** 关闭沙箱 */
    inactive?: () => void;
};


export enum ScriptType{
    URL = 'url',
    CODE = 'code'
}
export interface ScriptPlugin {
    name: string;
    type: ScriptType;
    context: string;
}
