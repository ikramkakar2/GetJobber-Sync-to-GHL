const axios = require('axios');
require('dotenv').config();

async function getAccessToken() {
  const response = await axios.post('https://api.getjobber.com/oauth/token', {
    client_id: process.env.JOBBER_CLIENT_ID,
    client_secret: process.env.JOBBER_CLIENT_SECRET,
    grant_type: 'client_credentials'
  });

  return response.data.access_token;
}

async function fetchJobsAndVisits(accessToken) {
  const graphqlQuery = {
    query: `
      query {
        jobs {
          nodes {
            id
            title
            status
            client {
              id
              displayName
              email
            }
            visits {
              nodes {
                id
                status
              }
            }
          }
        }
      }
    `
  };

  const response = await axios.post('https://api.getjobber.com/api/graphql', graphqlQuery, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-JOBBER-GRAPHQL-VERSION': '2025-01-20'
    }
  });

  return response.data.data.jobs.nodes;
}

module.exports = { getAccessToken, fetchJobsAndVisits };
