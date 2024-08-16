# @eamon98/autolinker

### 安装：

```
pnpm install --filter @eamon98/autolinker
```
构建：

```
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
import {link} from '@eamon98/autolinker';
const html = link('This is a link: https://www.google.com',(match)=>{
  const url = match.startsWith("http")? match : `http://${match}`;
  return `<a href="${url}" target="_blank">${match}</a>`;
});
console.log(html); // This is a link: <a href="https://www.google.com" target="_blank">https://www.google.com</a>
```

#### 第三种方式获取分割好的数组
```typescript
import {extractLinks} from '@eamon98/autolinker';
const links = extractLinks('This is a link: https://www.google.com');
console.log(links); // ["This is a link: ","https://www.google.com"]
```