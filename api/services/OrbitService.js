const axios = require('axios');
const orbitParamObjToStr = require('../helper/orbitQueryParamObjToStr');
const config = require('../../config/environment-variables');
const {getEdmsAccessToken} = require("./HelperService");
const {
    edmsHost
} = config;


const orbitBaseRequest = axios.create({
  baseURL: edmsHost,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  paramsSerializer: orbitParamObjToStr,
});

async function getApplicationStatusFromOrbit(applicationReference) {
  const queryParams = { applicationReference };
  const authToken = await getEdmsAccessToken();
  const requestTimeout = 5000;
  const requestOptions = {
    params: queryParams,
    timeout: requestTimeout,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const startTime = new Date();

  try {
    const response = await orbitBaseRequest.get('/api/v1/getApplicationStatusUpdate', requestOptions);

    const endTime = new Date();
    const elapsedTime = endTime - startTime;

    console.log(`Orbit status request response time: ${elapsedTime}ms`);
    console.log(JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error(`getApplicationStatusFromOrbit: ${error}`);
    throw error;
  }
}

function getApplicationsStatusesFromOrbit(results) {
  if (!Array.isArray(results)) {
    throw new Error('results argument must be an array');
  }

  const applicationReferences = results.map((result) => result.unique_app_id);

  return getApplicationStatusFromOrbit(applicationReferences);
}


module.exports = {
    getApplicationsStatusesFromOrbit,
    getApplicationStatusFromOrbit
};
