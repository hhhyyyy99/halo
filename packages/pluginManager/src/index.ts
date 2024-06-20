import {PluginManager} from './Core'
import AbstractPlugin from "./AbstractPlugin";
import PluginEventEmitter from "./PluginEventEmitter";
import {ScriptType}from './interface';
import {Plugin, PluginDefine, PluginLifecycle} from './Plugin';
import ProxySandBox from "./Sandbox";
import { CoreConfig } from "./Core";

export type { Plugin, PluginDefine, PluginLifecycle }
export { AbstractPlugin, PluginEventEmitter, ProxySandBox,ScriptType,CoreConfig }
export default PluginManager
