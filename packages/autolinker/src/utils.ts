import { MATCH_TYPE } from './constants';
import { RegexsListType, TransformResult } from './type';

// 根据正则分割字符串
export function extractMatchesAndText(text: string, regex: RegExp, transform?: (match: string) => TransformResult | string) {
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
    result.push(transform ? transform(content) : content);
    currentPos = end;
  }

  // 如果最后一个匹配之后还有文本，添加剩余的文本
  if (currentPos < text.length) {
    result.push(text.substring(currentPos));
  }
  return result;
}

/**
 * 递归匹配正则列表
 * @param text
 * @param regexsList
 * @returns
 */
export function recursiveMatch(text: (string | TransformResult)[], regexsList: RegexsListType[]): (string | TransformResult)[] {
  if (regexsList.length === 0) {
    return text;
  }
  const currentRegex = regexsList[0];

  const processText = (inputText: string | (string | TransformResult)[]) => {
    let result = [];
    if (typeof inputText === 'string') {
      result = extractMatchesAndText(inputText, currentRegex.regex, match => ({ value: match, type: currentRegex.type }));
    } else {
      result = inputText
        .map(item => {
          if (typeof item === 'string') {
            return extractMatchesAndText(item, currentRegex.regex, match => ({ value: match, type: currentRegex.type }));
          } else {
            return item;
          }
        })
        .flat();
    }
    return result;
  };

  const processedText = processText(text);
  return recursiveMatch(processedText, regexsList.slice(1));
}

export function getTextValue(text: string | TransformResult): string {
  return typeof text === 'string' ? text : text.value;
}

export function getMatchHref(value: string | TransformResult, type: MATCH_TYPE) {
  const match = getTextValue(value);
  switch (type) {
    case MATCH_TYPE.LINK:
      return match.startsWith('http')? match : `http://${match}`;
    case MATCH_TYPE.EMAIL:
      return `mailto:${match}`;
    case MATCH_TYPE.PHONE:
      return `tel:${match}`;
    default:
      return match;
  }
}

export function concatenateStrings(array: (string | TransformResult)[], options?: { separator?: string; shouldConcatenate?: (item: string | TransformResult, index: number, array: (string | TransformResult)[]) => boolean }) {
  let result: (string | TransformResult)[] = [];
  let currentString = '';
  const separator = (options && options.separator) || '';
  const shouldConcatenate = (options && options.shouldConcatenate) || ((item, index, array) => typeof item === 'string');
  const flushCurrentString = () => {
    if (currentString) {
      result.push(currentString);
      currentString = '';
    }
  };

  array.forEach((item, index) => {
    if (shouldConcatenate(item, index, array)) {
      currentString += (currentString ? separator : '') + item;
    } else {
      flushCurrentString();
      result.push(item);
    }
  });

  // 检查数组末尾是否有未添加的字符串
  flushCurrentString();

  return result;
}
