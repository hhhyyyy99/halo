import { textToEmailRegex, textToUrlRegex, textToPhoneRegex } from './regex';

export enum MATCH_TYPE {
  LINK = 'link',
  EMAIL = 'email',
  PHONE = 'phone',
  TXT = 'text',
  UNKNOWN = 'unknown',
}

export const regexsList = [
  { type: MATCH_TYPE.EMAIL, regex: textToEmailRegex },
  { type: MATCH_TYPE.LINK, regex: textToUrlRegex },
  { type: MATCH_TYPE.PHONE, regex: textToPhoneRegex },
];
