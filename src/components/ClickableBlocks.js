// ClickableBlocks Component
import { useState } from 'react';

function ClickableBlocks({ alchemy }) {
  const [blockNumber, setBlockNumber] = useState('');
  const [blockDetails, setBlockDetails] = useState(null);

  const fetchBlockDetails = async () => {
    try {
      const block = await alchemy.core.getBlockWithTransactions(Number(blockNumber));
      setBlockDetails(block);
    } catch (error) {
      console.error("Error fetching block details:", error);
      setBlockDetails("Error fetching block details");
    }
  };

  return (
    <div>
      <h3>Block Search</h3>
      <input
        type="number"
        placeholder="Enter Block Number"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        style={{ padding: '5px', marginRight: '10px', width: '300px' }}
      />
      <button
        onClick={fetchBlockDetails}
        style={{ padding: '5px 10px', backgroundColor: '#CBBB90', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Get Block Details
      </button>
      {blockDetails && (
        <div>
          {typeof blockDetails === 'string' ? (
            <p>{blockDetails}</p>
          ) : (
            <div>
              <p><strong>Block Hash:</strong> {blockDetails.hash}</p>
              <p><strong>Miner:</strong> {blockDetails.miner}</p>
              <p><strong>Timestamp:</strong> {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
              <p><strong>Transactions:</strong> {blockDetails.transactions.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClickableBlocks;
