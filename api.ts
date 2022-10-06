import type { Handler } from 'vite-plugin-mix'
import fetch from 'node-fetch';
import FormData from 'form-data';
import { promises as fs } from 'fs';

export const handler: Handler = async (req, res, next) => {
  if (req.path === '/api/getformstackforms') {
    let accessToken = req.headers.authorization;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + accessToken
      }
    };
    
    let response = await fetch('https://www.formstack.com/api/v2/form.json?folders=false', options)
      .then(async response => {return JSON.stringify(await response.json())})
      .catch(async err => {return JSON.stringify(await err.json())});

    res.end(response);
  } else if (req.path === '/api/getformstackformsubmissions') {
    let accessToken = req.headers.authorization;
    let id = req.headers.formid;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + accessToken
      }
    };

    let response = await fetch('https://www.formstack.com/api/v2/form/' + id + '/submission.json', options)
      .then(async response => {return JSON.stringify(await response.json())})
      .catch(async err => {return JSON.stringify(await err.json())});

    res.end(response);
  } else if (req.path === '/api/getformstacksubmissionresponse') {
    let accessToken = req.headers.authorization;
    let id = req.headers.submissionid;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + accessToken
      }
    };

    let response = await fetch('https://www.formstack.com/api/v2/submission/' + id + '.json', options)
      .then(async response => {return JSON.stringify(await response.json())})
      .catch(async err => {return JSON.stringify(await err.json())});

    res.end(response);
  }
  next() // this just returns the index.html by default
}