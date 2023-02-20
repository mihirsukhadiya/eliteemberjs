import Helper from '@ember/component/helper';
export function addition(params = []) {
  let result = 0;
  params.forEach((param) => result+= param);
  return result;
}

export default Helper.helper(addition);
