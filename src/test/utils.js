import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const {
  BASE_URL = 'http://localhost:3000'
} = process.env;

export const baseUrl = BASE_URL;

export async function methodAndParse(method, path, data = null) {
  const url = new URL(path, baseUrl);

  const options = { headers: {} };

  if (method !== 'GET') {
    options.method = method;
  }

  if (data) {
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const result = await fetch(url, options);

  if (method === 'DELETE') {
    return result.status;
  }

  return {
    result: result.json(),
    status: result.status,
  };
}

export async function fetchAndParse(path, token = null) {
  return methodAndParse('GET', path, null, token);
}

export async function postAndParse(path, data) {
  return methodAndParse('POST', path, data);
}

export async function patchAndParse(path, data) {
  return methodAndParse('PATCH', path, data);
}

export async function deleteAndParse(path) {
  return methodAndParse('DELETE', path);
}
