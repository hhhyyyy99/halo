import { MATCH_TYPE } from './constants';

export interface TransformResult {
  value: string;
  type: MATCH_TYPE;
}

export interface RegexsListType {
  type: MATCH_TYPE;
  regex: RegExp;
}
