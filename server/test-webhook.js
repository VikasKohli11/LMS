import fetch from 'node-fetch';

const payload = {
  type: 'user.created',
  data: {
    id: 'test-id',
    first_name: 'A',
    last_name: 'B',
    email_addresses: [{ email_address: 'a@b.com' }],
    image_url: ''
  }
};

fetch('http://localhost:5000/clerk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(res => res.text())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));