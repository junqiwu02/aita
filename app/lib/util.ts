
// intelligently split a string at delimiters close to but not over a target len per split
export function lenSplit(str: string, delims: string, targetLen: number) {
  const res = [];

  let start = 0;
  while (start + targetLen < str.length) {
    let end = start + targetLen;
    while (start < end - 1 && !delims.includes(str[end - 1])) {
      end -= 1;
    }
    if (start === end - 1) {
      // no delim found, just take entire section
      end = start + targetLen;
    }
    res.push(str.slice(start, end).trim());
    start = end;
  }
  // put the rest in
  res.push(str.slice(start));

  return res;
}