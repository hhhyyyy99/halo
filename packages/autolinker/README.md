# @eamon98/autolinker


## 安装：

```
pnpm install @eamon98/autolinker
```

## 手动构建
```
git clone https://github.com/hhhyyyy99/halo.git

pnpm install

pnpm build --pkg=autolinker
```


### 使用：
#### 第一种方式直接替换成a标签
```typescript
import {link} from '@eamon98/autolinker';
const html = link('This is a link: https://www.google.com');
console.log(html); // This is a link: <a href="https://www.google.com">https://www.google.com</a>
```
#### 第二种方式使用自定义的替换函数
```typescript
import {link,generateLinkHref} from '@eamon98/autolinker';
const html = link('This is a link: https://www.google.com',(match,type)=>{
  const href = generateLinkHref(match,type);
  return `<a href="${href}" target="_blank">${match}</a>`;
});
console.log(html); // This is a link: <a href="https://www.google.com" target="_blank">https://www.google.com</a>
```

#### 第三种方式获取分割好的数组
```typescript
import {list} from '@eamon98/autolinker';
const links = list('This is a link: https://www.google.com');
console.log(links); // [ "This is a link: ", { "value": "https://www.google.com", type: "link" } ]
```

## 目前支持的枚举类型：
```typescript
// Constans
enum MATCH_TYPE {
  LINK = 'link', // 链接
  EMAIL = 'email',// 邮箱
  PHONE = 'phone',// 电话
  TXT = 'text',// 文本
  UNKNOWN = 'unknown',// 未知类型
}
```