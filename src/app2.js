const axios = require('axios');

const RAZORPAY_KEY = 'rzp_live_lkuqq6mCeVxpCU';
const RAZORPAY_SECRET = 'mzdi9VlZdM10Sei6j5baVcDN';

const encodedCredentials = Buffer.from(`${RAZORPAY_KEY}:${RAZORPAY_SECRET}`).toString('base64');

async function createContact() {
  const url = 'https://api.razorpay.com/v1/contacts';
  const data = {
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "+919999999999",
    type: "employee",
    reference_id: "Acme12345",
    notes: {
      notes_key_1: "Tea, Earl Grey, Hot",
      notes_key_2: "Tea, Earl Grey… decaf."
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Contact created:', response.data);
    return response.data.id; 
  } catch (error) {
    console.error('Error creating contact:', error.response.data);
    throw error;
  }
}

async function addBankAccount(contactId) {
  const url = 'https://api.razorpay.com/v1/fund_accounts';
  const data = {
    contact_id: contactId,
    account_type: "bank_account",
    bank_account: {
      name: "John Doe",
      ifsc: "HDFC0001234",
      account_number: "1234567890"
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Fund account created:', response.data);
    return response.data.id; 
  } catch (error) {
    console.error('Error adding bank account:', error.response.data);
    throw error;
  }
}

// Function to make a payout
async function createPayout(fundAccountId) {
  const url = 'https://api.razorpay.com/v1/payouts';
  const data = {
    account_number: '23232300334232',  
    fund_account_id: fundAccountId,  
    amount: 100,  
    currency: 'INR',
    mode: 'IMPS',  
    purpose: 'payout',
    queue_if_low_balance: true,
    reference_id: 'AcmeTxn001',
    narration: 'Salary for August',
    notes: {
      internal_ref: '123456',
      for_invoice: 'INV001'
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Payout created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating payout:', error.response.data);
    throw error;
  }
}

async function initiatePayout() {
  try {

    const contactId = await createContact();

    const fundAccountId = await addBankAccount(contactId);

    const payout = await createPayout(fundAccountId);
    console.log('Payout successful:', payout);
  } catch (error) {
    console.error('Failed to complete the payout process:', error.message);
  }
}

initiatePayout();
