import {SandBox, SandBoxType} from "./interface";
const rawObjectDefineProperty = Object.defineProperty;
type FakeWindow = Window & Record<PropertyKey, any>;
const unscopables = {
    undefined: true,
    Array: true,
    Object: true,
    String: true,
    Boolean: true,
    Math: true,
    Number: true,
    Symbol: true,
    parseFloat: true,
    Float32Array: true,
};
export default class ProxySandbox implements SandBox {
    private updatedValueSet = new Set<PropertyKey>();
    private updateKeys= new Map();
    private callBack: Array<() => void> = [];
    name: string;
    type: SandBoxType;
    proxy: WindowProxy;
    constructor(name:string) {
        this.name = name;
        this.type= SandBoxType.Proxy;
        const rawWindow = window;
        const fakeWindow = new Proxy(rawWindow, {
            set: (target, key, value, receiver) => {
                this.updatedValueSet.add(key);
                if(!this.updateKeys.has(key)){
                    // @ts-ignore
                    this.updateKeys.set(key, target[key]);
                    this.callBack.push(() => {
                        // @ts-ignore
                        target[key] = this.updateKeys.get(key); // 恢复原始值
                    });
                }
                return Reflect.set(target, key, value, receiver);
            },
            get: (target, key, receiver) => {
                return Reflect.get(target, key, receiver);
            },
            deleteProperty:(target, p: string | number | symbol)=>{
                if (target.hasOwnProperty(p)) {
                    // @ts-ignore
                    delete target[p];
                    // @ts-ignore
                    this.updatedValueSet.delete(p);
                    return true;
                }
                return true;
            },
        });
        this.proxy = fakeWindow;
    }
    clearUpdatedValueSet() {
        // 清空更新的属性集合，恢复副作用,同时映射到原本的window对象上
        this.callBack.forEach(cb => cb());
        this.updateKeys.clear();
        this.updatedValueSet.clear();
    }
}
function createFakeWindow(global: Window) {
    // map always has the fastest performance in has check scenario
    const propertiesWithGetter = new Map<PropertyKey, boolean>();
    const fakeWindow = {} as FakeWindow;

    /*
     copy the non-configurable property of global to fakeWindow
     see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
     > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
     */
    Object.getOwnPropertyNames(global)
        .filter((p) => {
            const descriptor = Object.getOwnPropertyDescriptor(global, p);
            return !descriptor?.configurable;
        })
        .forEach((p) => {
            const descriptor = Object.getOwnPropertyDescriptor(global, p);
            if (descriptor) {
                const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');

                /*
                 make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
                 see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
                 > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
                 */
                if (
                    p === 'top' ||
                    p === 'parent' ||
                    p === 'self' ||
                    p === 'window'
                ) {
                    descriptor.configurable = true;
                    /*
                     The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
                     Example:
                      Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
                      Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
                     */
                    if (!hasGetter) {
                        descriptor.writable = true;
                    }
                }

                if (hasGetter) propertiesWithGetter.set(p, true);

                // freeze the descriptor to avoid being modified by zone.js
                // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
                rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
            }
        });

    return {
        fakeWindow,
        propertiesWithGetter,
    };
}

