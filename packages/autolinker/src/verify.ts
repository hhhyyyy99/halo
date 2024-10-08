import { TransformResult } from 'rollup';
import { urlRegex, ipRegex, emailRegex, phoneRegex } from './regex';

export function isUrl(str: string): boolean {
  return urlRegex.test(str) || isIp(str);
}

export function isIp(str: string): boolean {
  return ipRegex.test(str);
}

export function isEmail(str: string): boolean {
  return emailRegex.test(str);
}

export function isPhone(str: string): boolean {
  return phoneRegex.test(str);
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isTransformResult(item: any): item is TransformResult {
  return item && typeof item === 'object' && 'type' in item; // 根据 TransformResult 的实际结构进行检查
}
