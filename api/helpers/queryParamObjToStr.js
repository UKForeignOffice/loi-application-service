/**
 * URLSearchParams does not support converting arrays to separate query params.
 * i.e. doing {test: ['a', 'b']} to '?test=a&test=b'. This solves that.
 * @param {{unknown}} queryParamsObj
 * @returns string
 */
function queryParamObjToStr(queryParamsObj) {
    const params = new URLSearchParams();

    Object.entries(queryParamsObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            for (const val of value) {
                params.append(key, val);
            }
        } else {
            params.append(key, value.toString());
        }
    });

    return params.toString();
}

module.exports = queryParamObjToStr;
