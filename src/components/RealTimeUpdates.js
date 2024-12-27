import { useEffect, useState } from 'react';

function RealTimeUpdates({ alchemy }) {
  const [latestBlock, setLatestBlock] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const subscription = alchemy.ws.on("block", async (blockNumber) => {
      try {
        const block = await alchemy.core.getBlock(blockNumber);
        setLatestBlock(block);
        setUpdates((prevUpdates) => [
          { blockNumber: blockNumber, transactions: block.transactions.length },
          ...prevUpdates,
        ].slice(0, 10));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    });

    return () => {
      subscription(); // Unsubscribe when the component unmounts
    };
  }, [alchemy]);

  return (
    <div>
      <h3>Real-Time Updates</h3>
      {latestBlock && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Latest Block:</strong> {latestBlock.number}</p>
          <p><strong>Transactions:</strong> {latestBlock.transactions.length}</p>
        </div>
      )}
      <h4>Recent Updates</h4>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {updates.map((update, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <p><strong>Block Number:</strong> {update.blockNumber}</p>
            <p><strong>Transactions:</strong> {update.transactions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RealTimeUpdates;
