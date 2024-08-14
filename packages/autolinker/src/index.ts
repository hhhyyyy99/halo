import { urlRegex, ipRegex } from './regex';
import DOMpurify from 'dompurify';

// export function replace(
//   arg:
//     | string
//     | {
//         input: string;
//         element?: (match: string) => string;
//       }
// ) {
//   let { input, element } = typeof arg === 'string' ? { input: arg, element: undefined } : arg;
//   const combinedRegex = new RegExp(`${urlRegex.source}|${ipRegex.source}`, 'gi');
//   const result = input.replace(combinedRegex, match => {
//     return element ? element(match) : `<a href="${match}" target="_blank">${match}</a>`;
//   });
//   return DOMpurify.sanitize(result); // 防止xss攻击
// }
export function link(input:string, element?: (match: string) => string) {
    const combinedRegex = new RegExp(`${urlRegex.source}|${ipRegex.source}`, 'gi');
    const result = input.replace(combinedRegex, match => {
      return element ? element(match) : `<a href="${match}" target="_blank">${match}</a>`;
    });
    return DOMpurify.sanitize(result); // 防止xss攻击
  }
  