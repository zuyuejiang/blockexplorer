// Import necessary libraries and styles
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';
import AccountLookup from './components/AccountLookup';
import TransactionSearch from './components/TransactionSearch';
import ClickableBlocks from './components/ClickableBlocks';
import TransactionHeatmap from './components/TransactionHeatmap';
// import RealTimeUpdates from './components/RealTimeUpdates';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalContent, setModalContent] = useState(null);
  const transactionsPerPage = 12;

  useEffect(() => {
    async function getBlockNumber() {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(currentBlockNumber);
      const block = await alchemy.core.getBlockWithTransactions(currentBlockNumber);
      setBlockDetails(block);
    }
    getBlockNumber();
  }, []);

  const handleTransactionClick = async (transactionHash) => {
    try {
      const transactionReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
      setModalContent(
        <div>
          <h2>Transaction Details</h2>
          <p><strong>Transaction Hash:</strong> {transactionReceipt.transactionHash}</p>
          <p><strong>From:</strong> {transactionReceipt.from}</p>
          <p><strong>To:</strong> {transactionReceipt.to}</p>
          <p><strong>Gas Used:</strong> {transactionReceipt.gasUsed.toString()}</p>
          <p><strong>Status:</strong> {transactionReceipt.status ? 'Success' : 'Failure'}</p>
        </div>
      );
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  const handleAccountLookup = async (address) => {
    try {
      const balance = await alchemy.core.getBalance(address);
      setModalContent(
        <div>
          <h2>Account Balance</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance.toString()} ETH</p>
        </div>
      );
    } catch (error) {
      console.error("Error fetching account balance:", error);
    }
  };

  const handleTransactionSearch = (content) => {
    setModalContent(
      <div>
        <h2>Transaction Search</h2>
        {content}
      </div>
    );
  };

  const handleBlockClick = (content) => {
    setModalContent(
      <div>
        <h2>Block Details</h2>
        {content}
      </div>
    );
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = blockDetails?.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
      <div>
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
              {currentTransactions.map((tx) => (
                tx.hash ? (
                  <li key={tx.hash}>
                    <button 
                      style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#CBBB90', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        margin: '8px 0', 
                        fontSize: '14px',
                        transition: 'transform 0.2s, background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#C79E76'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#CBBB90'}
                      onClick={() => handleTransactionClick(tx.hash)}
                    >
                      {tx.hash}
                    </button>
                  </li>
                ) : null
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
              {Array.from({ length: Math.ceil(blockDetails.transactions.length / transactionsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  style={{ 
                    margin: '5px', 
                    padding: '5px 10px', 
                    backgroundColor: currentPage === index + 1 ? '#701515' : '#CBBB90', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                  }}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        {modalContent && (
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
            {modalContent}
            <button 
              style={{ 
                marginTop: '10px', 
                padding: '10px 15px', 
                backgroundColor: '#701515', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
              onClick={() => setModalContent(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
      <div>
        <TransactionHeatmap alchemy={alchemy} barColor="#701515" xAxisFormat="time" />
        {/* <RealTimeUpdates alchemy={alchemy} /> */}
        <AccountLookup alchemy={alchemy} onResult={handleAccountLookup} />
        <TransactionSearch alchemy={alchemy} onResult={handleTransactionSearch} />
        <ClickableBlocks alchemy={alchemy} onResult={handleBlockClick} />
      </div>
    </div>
  );
}

export default App;
