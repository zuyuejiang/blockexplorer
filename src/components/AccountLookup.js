// AccountLookup Component
import { useState } from 'react';

function AccountLookup({ alchemy }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    try {
      const balance = await alchemy.core.getBalance(address);
      setBalance(balance.toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    }
  };

  return (
    <div>
      <h3>Account Lookup</h3>
      <input
        type="text"
        placeholder="Enter Ethereum Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ padding: '5px', marginRight: '10px', width: '300px' }}
      />
      <button
        onClick={fetchBalance}
        style={{ padding: '5px 10px', backgroundColor: '#CBBB90', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Get Balance
      </button>
      {balance && (
        <p>Balance: {balance} wei</p>
      )}
    </div>
  );
}

export default AccountLookup;
