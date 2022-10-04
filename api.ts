import type { Handler } from 'vite-plugin-mix'
import fetch from 'node-fetch';
import FormData from 'form-data';
import { promises as fs } from 'fs';

export const handler: Handler = async (req, res, next) => {
  if (req.path === '/api/getformstackforms') {
    let accessToken = await fs.readFile('./fakeDataBase.txt', {encoding: 'utf-8'});

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
  } else if (req.path === '/api/formstackauth') {
    let formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', '31415');
    formData.append('client_secret', '2e5fecce28');
    formData.append('code', req.query.code);
    formData.append('redirect_uri', 'https://localhost:44355/api/formstackauth/success');

    const options = {
      method: 'POST',
      headers: {accept: 'application/json'},
      body: formData
    };
    
    let response = await fetch('https://www.formstack.com/api/v2/oauth2/token', options)
      .then(async response => {return JSON.stringify(await response.json())})
      .catch(async err => {return JSON.stringify(await err.json())});
    
    let accessToken = JSON.parse(response).access_token;
    if (accessToken !== undefined && accessToken !== null) {
      fs.writeFile('./fakeDataBase.txt', accessToken);
    }
  }
  next() // this just returns the index.html by default
}