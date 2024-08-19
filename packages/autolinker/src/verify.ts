import { urlRegex, ipRegex } from './regex';

export function isUrl(str: string): boolean {
  return urlRegex.test(str);
}

export function isIp(str: string): boolean {
  return ipRegex.test(str);
}

export function isUrlOrIp(str: string): boolean {
  return isUrl(str) || isIp(str);
}
