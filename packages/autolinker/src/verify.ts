import {urlRegex,ipRegex} from "./regex"

export function isUrl(str: string): boolean {
    return urlRegex.test(str) || isIp(str);
}

export function isIp(str: string): boolean {
    return ipRegex.test(str);
}
