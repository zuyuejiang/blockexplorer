import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(currentBlockNumber);
      // newly added: other block details
      const block = await alchemy.core.getBlockWithTransactions(currentBlockNumber);
      setBlockDetails(block);
    }
    getBlockNumber();
  },[]);
  const handleTransactionClick = async (transactionHash) => {
    try {
      const transactionReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
      setSelectedTransaction(transactionReceipt);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // return <div className="App">Block Number: {blockNumber}</div>;
  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      <p>Current Block Number: {blockNumber}</p>
      {blockDetails && (
        <div>
          <h2>Block Details</h2>
          <p>Block Hash: {blockDetails.hash}</p>
          <p>Miner: {blockDetails.miner}</p>
          <p>Timestamp: {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
          <p>Transactions: {blockDetails.transactions.length}</p>
          <h3>Transactions</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {blockDetails.transactions.map((tx) => (
              tx.hash ? (
                <li key={tx.hash}>
                  <button 
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#007BFF', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      margin: '8px 0', 
                      fontSize: '14px',
                      transition: 'transform 0.2s, background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
                    onClick={() => handleTransactionClick(tx.hash)}
                  >
                    {tx.hash}
                  </button>
                </li>
              ) : null
            ))}
          </ul>
        </div>
      )}
      {/* {selectedTransaction && (
        <div>
          <h2>Transaction Details</h2>
          <p>Transaction Hash: {selectedTransaction.transactionHash}</p>
          <p>From: {selectedTransaction.from}</p>
          <p>To: {selectedTransaction.to}</p>
          <p>Gas Used: {selectedTransaction.gasUsed.toString()}</p>
          <p>Status: {selectedTransaction.status.toString() ? 'Success' : 'Failure'}</p>
        </div>
      )} */}
      {selectedTransaction && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          backgroundColor: 'white', 
          border: '1px solid #ccc', 
          borderRadius: '10px', 
          padding: '20px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000
        }}>
          <h2>Transaction Details</h2>
          <p><strong>Transaction Hash:</strong> {selectedTransaction.transactionHash}</p>
          <p><strong>From:</strong> {selectedTransaction.from}</p>
          <p><strong>To:</strong> {selectedTransaction.to}</p>
          <p><strong>Gas Used:</strong> {selectedTransaction.gasUsed.toString()}</p>
          <p><strong>Status:</strong> {selectedTransaction.status.toString() ? 'Success' : 'Failure'}</p>
          <button 
            style={{ 
              marginTop: '10px', 
              padding: '10px 15px', 
              backgroundColor: '#FF6347', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
            onClick={() => setSelectedTransaction(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="App">
  //     <h1>Ethereum Block Explorer</h1>
  //     <p>Current Block Number: {blockNumber}</p>
  //     {blockDetails && (
  //       <div>
  //         <h2>Block Details</h2>
  //         <p>Block Hash: {blockDetails.hash}</p>
  //         <p>Miner: {blockDetails.miner}</p>
  //         <p>Timestamp: {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
  //         <p>Transactions: {blockDetails.transactions.length}</p>
  //         <h3>Sample Transactions</h3>
  //         <ul>
  //           {blockDetails.transactions.slice(0, 5).map((tx) => (
  //             <li key={tx.hash}>
  //               <p><strong>Transaction Hash:</strong> {tx.hash}</p>
  //               <p><strong>From:</strong> {tx.from}</p>
  //               <p><strong>To:</strong> {tx.to || 'Contract Creation'}</p>
  //               <p><strong>Value:</strong> {tx.value.toString()} wei</p>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default App;
