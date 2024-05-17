
export const addOpenedTrade = (trade, table) => {
    if(table) {
        const newRow = table.insertRow();
        let sideText = '';
      
        const newCell1 = newRow.insertCell();
        const newCell2 = newRow.insertCell();
        const newCell3 = newRow.insertCell();
        const newCell4 = newRow.insertCell();
        const newCell5 = newRow.insertCell();
        const newCell6 = newRow.insertCell();
        const newCell7 = newRow.insertCell();
        const newCell8 = newRow.insertCell();
        const newCell9 = newRow.insertCell();
        const button = document.createElement('button');
        button.textContent = '+';
        button.addEventListener('click', () => {
          adminStopProfit(trade.id);
        });
        
        if(trade.side === 1) {
          sideText = 'LONG';
          newCell2.style.color = '#1DEE00';
        } else {
          sideText = 'SHORT';
          newCell2.style.color = '#FF0000';
        }
        newCell8.style.color = trade.netPL >= 0 ? '#1DEE00' : '#FF0000';
      
        newCell1.textContent = trade.symbol;
        newCell2.textContent = sideText;
        newCell3.textContent = trade.quantity.toString();
        newCell4.textContent = trade.OpenPrice.toString();
        newCell5.textContent = trade.currentPrice.toString();
        newCell5.id = `td-${trade.symbol}-currentPrice-id`; // asign id to current price cell
        newCell6.textContent = trade.stop.toString();
        newCell7.textContent = trade.profit.toString();
        newCell8.textContent = trade.netPL.toString();
        newCell9.appendChild(button);
    }
}

export const addClosedTrade = (trade, table) => {
    if(table) {
        const newRow = table.insertRow();
        let sideText = '';
      
        const symbolCell = newRow.insertCell();
        const sideCell = newRow.insertCell();
        const quantityCell = newRow.insertCell();
        const priceEntryCell = newRow.insertCell();
        const stopCell = newRow.insertCell();
        const profitCell = newRow.insertCell();
        const netPLCell = newRow.insertCell();
        
        if(trade.side === 1) {
          sideText = 'LONG';
          sideCell.style.color = '#1DEE00';
        } else {
          sideText = 'SHORT';
          sideCell.style.color = '#FF0000';
        }
        netPLCell.style.color = trade.netPL >= 0 ? '#1DEE00' : '#FF0000';
      
        symbolCell.textContent = trade.symbol;
        sideCell.textContent = sideText;
        quantityCell.textContent = trade.quantity.toString();
        priceEntryCell.textContent = trade.OpenPrice.toString();
        stopCell.textContent = trade.stop.toString();
        profitCell.textContent = trade.profit.toString();
        netPLCell.textContent = trade.netPL.toString();
    }
}

export const editQuantity = (tradeData) => {
  const cells = document.getElementById(`opened-row-${tradeData.symbol}-id`).getElementsByTagName('td');
  const cell = cells[2];
  const cellSide = cells[1];
    
  if (cell && cellSide) {
    cell.textContent = tradeData.quantity;
    if(tradeData.side === 0) {
      cellSide.textContent =  'SHORT';
      cellSide.style.color = '#FF0000';
    } else if(tradeData.side === 1) {
      cellSide.textContent =  'LONG';
      cellSide.style.color = '#1DEE00';
    }
  }
}

export const closeTradeByMarket = (trade) => {
  const rowToRemove = document.getElementById(`opened-row-${trade.symbol}-id`);
  if (rowToRemove) { rowToRemove.remove(); }  //confirm either row exist

  const tbody = document.getElementById('list-closed-trades-id').getElementsByTagName('tbody')[0];

  // Crea una nueva fila en el tbody
  const newRow = tbody.insertRow();

  // Datos para las celdas de la fila
  const Tradedata = [trade.symbol, trade.side, trade.quantity, trade.OpenPrice, trade.stop, trade.profit, trade.netPL];
  const cellText = '';

  // Itera sobre los datos y agrega las celdas a la fila
  Tradedata.forEach((data, index) => {
    const newCell = newRow.insertCell();
    if(index === 1) {
      if(data === 1) {
        cellText = 'LONG';
        newCell.style.color = '#1DEE00';
      } else {
        cellText = 'SHORT';
        newCell.style.color = '#FF0000';
      }
    } else if(index === 6) {
      cellText = data.toString();
      newCell.style.color = data >= 0 ? '#1DEE00' : '#FF0000';
    } else {
      cellText = data.toString();
    }
    newCell.textContent = cellText;
  });
}

export const editProfitStopCell = (dataFromModal, symbol) => {
  const cells = document.getElementById(`opened-row-${symbol}-id`).getElementsByTagName('td');
  const cell = dataFromModal.type === 'profit' ? cells[6] : cells[5];

  if (cell) cell.textContent = dataFromModal.price;
}

export const showNetPLAndCurrentPrice = (trade) => {
  const netPLCell = document.getElementById(`td-${trade.symbol}-netPL-id`);
  if(trade.netPL >= 0) {
    netPLCell.style.color = '#1DEE00';
  } else {
    netPLCell.style.color = '#FF0000';
  }
  netPLCell.textContent = trade.netPL.toString();
  document.getElementById(`td-${trade.symbol}-currentPrice-id`).textContent = trade.currentPrice;
}

export const showBalance = (totalPL, dailyNetPl) => {
  const balanceInput = document.getElementById('balance_id');
  const TotalBalance = dailyNetPl + totalPL;
    console.log('SHOW BALANCE FUNCTION', TotalBalance);
  balanceInput.style.color = totalPL >= 0 ? '#1DEE00' : '#FF0000';
  balanceInput.value = String(TotalBalance);

  localStorage.setItem('daily_netPl', String(totalPL));
}
