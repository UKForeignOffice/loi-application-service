/**
 * URLSearchParams does not support converting arrays to separate query params.
 * i.e. doing {test: ['a', 'b']} to '?test=a&test=b'. This solves that.
 * @param {{unknown}} queryParamsObj
 * @returns string
 */
function orbitQueryParamObjToStr(queryParamsObj) {
    const params = new URLSearchParams();

    Object.entries(queryParamsObj).forEach(([key, value]) => {
      // ORBIT cannot support passing multiple query string params
      // with the same key e.g. ?applicationReference=&applicationReference=
      // therefore we number them e.g. ?applicationReference1=&applicationReference2=
      let n = 0
      if (Array.isArray(value)) {
            for (const val of value) {
              n++;
              params.append(key + n, val);
            }
        } else {
            params.append(key, value.toString());
        }
    });
    return params.toString();
}

module.exports = orbitQueryParamObjToStr;
