import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

function TransactionHeatmap({ alchemy, barColor = "#007BFF", xAxisFormat = "time" }) {
  const [data, setData] = useState([['Time', 'Transactions']]);

  useEffect(() => {
    async function fetchTransactionData() {
      try {
        const currentBlockNumber = await alchemy.core.getBlockNumber();
        const transactionData = [['Time', 'Transactions']];

        for (let i = 0; i < 24; i++) {
          const block = await alchemy.core.getBlock(currentBlockNumber - i);
          const time = new Date(block.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          transactionData.push([time, block.transactions.length]);
        }

        setData(transactionData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    }

    fetchTransactionData();
  }, [alchemy]);

  return (
    <div>
      <h3>Transaction Heatmap</h3>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
        options={{
          title: 'Transactions per Hour',
          hAxis: {
            title: 'Time',
            format: xAxisFormat,
          },
          vAxis: {
            title: 'Number of Transactions',
          },
          legend: { position: 'none' },
          colors: [barColor],
        }}
      />
    </div>
  );
}

export default TransactionHeatmap;
