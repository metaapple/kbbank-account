import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/transactions';

async function testAxios() {
  console.log('--- Starting Axios Tests ---');

  console.log('Fetching all transactions...');
  // 1. GET all transactions
  try {
    const response = await axios.get(API_BASE_URL);
    console.log('GET Response (first 5 items):', response.data.slice(0, 5));
    console.log('Total items fetched:', response.data.length);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
  }

  // 2. POST a new transaction
  console.log('Adding a new transaction...');
  const newTransaction = {
    type: 'income',
    title: 'Axios 테스트 수입',
    amount: 150000,
    date: new Date().toISOString().split('T')[0],
  };
  try {
    const response = await axios.post(API_BASE_URL, newTransaction);
    console.log('POST Response (new item):', response.data);
    const addedId = response.data.id;

    // 3. GET the newly added transaction
    console.log(`
Fetching newly added transaction (id: ${addedId})...`);
    const getResponse = await axios.get(`${API_BASE_URL}/${addedId}`);
    console.log('GET Single Item Response:', getResponse.data);

    // 4. DELETE the newly added transaction
    console.log(`
Deleting transaction (id: ${addedId})...`);
    await axios.delete(`${API_BASE_URL}/${addedId}`);
    console.log(`Transaction with id ${addedId} deleted successfully.`);

    // Verify deletion
    console.log(`
Verifying deletion of transaction (id: ${addedId})...`);
    try {
      await axios.get(`${API_BASE_URL}/${addedId}`);
      console.log('Deletion failed: Item still exists.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Deletion verified: Item not found (expected 404).');
      } else {
        console.error('Error verifying deletion:', error.message);
      }
    }
  } catch (error) {
    console.error('Error during POST/DELETE operations:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }

  console.log('--- Axios Tests Finished ---');
}

testAxios();
