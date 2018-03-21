const fetch = require('isomorphic-fetch');

const getGithubToken = async githubCode => {
  const endpoint = 'https://github.com/login/oauth/access_token';

  const data = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_ID,
      client_secret: process.env.GITHUB_SECRET,
      code: githubCode,
    }),
  }).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data.access_token;
};

const getGithubUser = async githubToken => {
  const endpoint = `https://api.github.com/user?access_token=${githubToken}`;
  const data = await fetch(endpoint).then(response => response.json());

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data;
};

module.exports = {
  getGithubToken,
  getGithubUser,
};
