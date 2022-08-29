export function deepCopy(data: any): any {
  if (data && typeof data === "object") {
    //针对函数的拷贝
    if (typeof data === "function") {
      let tempFunc = data.bind(null);
      tempFunc.prototype = deepCopy(data.prototype);
      return tempFunc;
    }

    switch (Object.prototype.toString.call(data)) {
      case "[object String]":
        return data.toString();
      case "[object Number]":
        return Number(data.toString());
      case "[object Boolean]":
        return new Boolean(data.toString());
      case "[object Date]":
        return new Date(data.getTime());
      case "[object Array]":
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr[i] = deepCopy(data[i]);
        }
        return arr;

      case "[object Object]":
        const obj: any = {};
        for (let key in data) {
          obj[key] = deepCopy(data[key]);
        }
        return obj;
    }
  } else {
    return data;
  }
}
