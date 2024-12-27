// TransactionSearch Component
import { useState } from 'react';

function TransactionSearch({ alchemy }) {
  const [txHash, setTxHash] = useState('');
  const [txDetails, setTxDetails] = useState(null);

  const fetchTransactionDetails = async () => {
    try {
      const details = await alchemy.core.getTransactionReceipt(txHash);
      setTxDetails(details);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      setTxDetails("Error fetching transaction details");
    }
  };

  return (
    <div>
      <h3>Transaction Search</h3>
      <input
        type="text"
        placeholder="Enter Transaction Hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        style={{ padding: '5px', marginRight: '10px', width: '300px' }}
      />
      <button
        onClick={fetchTransactionDetails}
        style={{ padding: '5px 10px', backgroundColor: '#CBBB90', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Get Transaction Details
      </button>
      {txDetails && (
        <div>
          {typeof txDetails === 'string' ? (
            <p>{txDetails}</p>
          ) : (
            <div>
              <p><strong>From:</strong> {txDetails.from}</p>
              <p><strong>To:</strong> {txDetails.to}</p>
              <p><strong>Gas Used:</strong> {txDetails.gasUsed.toString()}</p>
              <p><strong>Status:</strong> {txDetails.status ? 'Success' : 'Failure'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionSearch;
