const sortObject = (obj: { [key: string]: any }): { [key: string]: string } => {
  const str: string[] = Object.keys(obj).sort();
  const encode = encodeURIComponent;
  return str.reduce((acc: { [key: string]: string }, key: string) => {
    acc[encode(key)] = encode(obj[key]).replace(/%20/g, '+');
    return acc;
  }, {});
};

export { sortObject };
