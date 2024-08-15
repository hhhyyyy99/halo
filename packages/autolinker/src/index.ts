import * as Regex from './regex';
import * as Verify from './verify';
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

function link(input: string, element?: (match: string) => string) {
  const result = input.replace(Regex.textToUrlRegex, match => {
    return element ? element(match) : `<a href="${match}" target="_blank">${match}</a>`;
  });
  return DOMpurify.sanitize(result); // 防止xss攻击
}

// 根据正则分割字符串
function extractMatchesAndText(text: string, regex: RegExp) {
  // 用于存储最终结果的数组
  const result = [];
  // 用于保存匹配项的数组
  const matches = text.match(regex) || [];
  // 用于保存匹配项的索引位置和内容
  const matchDetails = [];
  let lastIndex = 0;

  // 记录所有匹配项的位置和内容
  for (const match of matches) {
    const matchIndex = text.indexOf(match, lastIndex);
    matchDetails.push({
      start: matchIndex,
      end: matchIndex + match.length,
      content: match,
    });
    lastIndex = matchIndex + match.length;
  }

  // 根据匹配项的位置信息来提取未匹配的文本部分和匹配项
  let currentPos = 0;
  for (const { start, end, content } of matchDetails) {
    if (start > currentPos) {
      // 添加未匹配的文本部分
      result.push(text.substring(currentPos, start));
    }
    // 添加匹配的URL/IP
    result.push(content);
    currentPos = end;
  }

  // 如果最后一个匹配之后还有文本，添加剩余的文本
  if (currentPos < text.length) {
    result.push(text.substring(currentPos));
  }
  return result;
}

// 根据正则提取字符串中的链接最终返回一个数组
function extractLinks(text: string) {
  const chineseSplitResult = extractMatchesAndText(text, Regex.chineseRegex);
  const textToUrlResult = chineseSplitResult.reduce((acc: string[], cur: string) => {
    if (Regex.textToUrlRegex.test(cur)) {
      const urlMatches = extractMatchesAndText(cur, Regex.textToUrlRegex);
      return [...acc, ...urlMatches];
    }
    return [...acc, cur];
  }, []);
  return textToUrlResult.reduce((acc: string[], cur: string) => {
    if (Regex.textToUrlRegex.test(cur)) {
      // 如果当前元素是 URL，先将累积的非 URL 内容加入结果数组
      if (acc.length > 0 && acc[acc.length - 1] && !Regex.textToUrlRegex.test(acc[acc.length - 1])) {
        acc.push(cur);
      } else {
        acc.push(cur);
      }
    } else {
      // 如果当前元素不是 URL，累积到结果数组最后一个元素（如果它不是 URL）
      if (acc.length > 0 && !Regex.textToUrlRegex.test(acc[acc.length - 1])) {
        acc[acc.length - 1] += cur;
      } else {
        acc.push(cur);
      }
    }
    return acc;
  }, []);
}
export { link, extractLinks, extractMatchesAndText, Regex, Verify };
