import * as Regex from './regex';
import * as Verify from './verify';
import * as Constants from './constants';
import DOMpurify from 'dompurify';
import { TransformResult,RegexsListType } from './type';
import { concatenateStrings, extractMatchesAndText, getMatchHref, recursiveMatch } from './utils';

function link(input: string, element?: (match: string, type: Constants.MATCH_TYPE) => string) {
  const matches = list(input).map(item => {
    if (Verify.isTransformResult(item)) {
      const { value, type } = item as unknown as TransformResult;
      const href = getMatchHref(value, type);
      return element ? element(value, type) : `<a href="${href}" target="_blank">${value}</a>`;
    }
  });
  const result = matches.join('');
  return DOMpurify.sanitize(result); // 防止xss攻击
}

/**
 * 获取文本中所有中文、邮箱、链接、电话等内容
 * @param text
 * @param regex
 * @param transform
 * @returns
 */
function list(text: string, regex = Regex.chineseRegex, transform?: (match: string) => TransformResult | string) {
  const frist = extractMatchesAndText(text, regex, transform);
  const last = recursiveMatch(frist, Constants.regexsList);
  return concatenateStrings(last);
}

export { link, list, recursiveMatch, concatenateStrings, extractMatchesAndText, Regex, Verify, Constants };
export type { TransformResult,RegexsListType };
