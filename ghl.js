const axios = require('axios');
require('dotenv').config();

const GHL_API = 'https://rest.gohighlevel.com/v1';
const headers = {
  Authorization: `Bearer ${process.env.GHL_API_KEY}`,
  'Content-Type': 'application/json'
};

async function findContactByEmail(email) {
  const response = await axios.get(`${GHL_API}/contacts/lookup?email=${email}`, { headers });
  return response.data.contact || null;
}

async function createContact({ name, email }) {
  const response = await axios.post(`${GHL_API}/contacts/`, {
    firstName: name,
    email
  }, { headers });

  return response.data.contact;
}

async function addTagToContact(contactId, tag) {
  await axios.post(`${GHL_API}/contacts/${contactId}/tags/`, {
    tags: [tag]
  }, { headers });
}

module.exports = { findContactByEmail, createContact, addTagToContact };
