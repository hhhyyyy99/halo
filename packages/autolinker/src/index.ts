import * as Regex from './regex';
import * as Verify from './verify';
import DOMpurify from 'dompurify';

function link(input: string, element?: (match: string) => string) {
  const result = input.replace(Regex.textToUrlRegex, match => {
    if (element) {
      return element(match);
    }
    const url = match.startsWith('http') ? match : `http://${match}`;
    return `<a href="${url}" target="_blank">${match}</a>`;
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
function extractLinks(text: string, urlRegex: RegExp = Regex.textToUrlRegex) {
  const chineseSplitResult = extractMatchesAndText(text, Regex.chineseRegex);
  const textToUrlResult = chineseSplitResult.reduce((acc: string[], cur: string) => {
    if (urlRegex.test(cur)) {
      const urlMatches = extractMatchesAndText(cur, urlRegex);
      return [...acc, ...urlMatches];
    }
    return [...acc, cur];
  }, []);
  return splitAndMerge(textToUrlResult, Verify.isUrl);
}

// 根据 verifyFunc结果 将数组拆分为 两部分，并合并
function splitAndMerge(arr: string[],verifyFunc: (str: string) => boolean = Verify.isUrl): string[] {
  const result: string[] = [];
  let currentString = "";

  for (const item of arr) {
    if (verifyFunc(item)) {
      // 如果 currentString 不为空，先将其添加到结果数组
      if (currentString) {
        result.push(currentString);
        currentString = "";
      }
      // 将当前 URL 项单独添加到结果数组
      result.push(item);
    } else {
      // 如果不是 URL，将其拼接到 currentString
      currentString += item;
    }
  }

  // 如果最后还有剩余的拼接字符串，将其添加到结果数组
  if (currentString) {
    result.push(currentString);
  }

  return result;
}

export { link, extractLinks, extractMatchesAndText, splitAndMerge, Regex, Verify };
