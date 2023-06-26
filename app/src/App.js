import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function settle(escrowContract, signer, bettorWin) {
  const approveTxn = await escrowContract.connect(signer).settle(bettorWin);
  await approveTxn.wait();
}

export async function match(escrowContract, signer, toStake) {
  const toStakeVal = ethers.utils.parseUnits(toStake, 'wei');
  const approveTxn = await escrowContract.connect(signer).matchStake({value: toStakeVal});
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    // Retrieve saved contracts from localStorage on page load
    const savedContracts = JSON.parse(localStorage.getItem('contracts')) || [];
    setEscrows(savedContracts);
  }, []);

  async function newContract() {
    const counterparty = document.getElementById('counterparty').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('ether').value);
    const odds = document.getElementById('odds').value;
    const toStake = ((value * odds) - value).toString();
    const terms = document.getElementById('terms').value;
    const escrowContract = await deploy(signer, arbiter, counterparty, toStake, value);


    const escrow = {
      address: escrowContract.address,
      bettor: account,
      arbiter,
      counterparty,
      odds,
      toStake,
      terms,
      value: value.toString(),
      settlementOutcome: localStorage.getItem(escrowContract.address + '-settlement') || '',
      isMatched: localStorage.getItem(escrowContract.address + '-isMatched') === 'true',
      handleMatch: async () => {
        await match(escrowContract, signer, toStake);
        localStorage.setItem(escrowContract.address + '-isMatched', 'true');
        escrow.isMatched = true;
      },
      
      handleApprove: async () => {
        await settle(escrowContract, signer, true);

        localStorage.setItem(escrowContract.address + '-settlement', 'Bettor');
        escrow.settlementOutcome = 'Bettor';
      },

      handleReject: async () => {
        await settle(escrowContract, signer, false);
        localStorage.setItem(escrowContract.address + '-settlement', 'Counterparty');
        escrow.settlementOutcome = 'Counterparty';
      },
    };

    const updatedEscrows = [...escrows, escrow];
    setEscrows(updatedEscrows);

    // Save updated contracts to localStorage
    localStorage.setItem('contracts', JSON.stringify(updatedEscrows));
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Counterparty Address
          <input type="text" id="counterparty" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <label>
          Odds (in Decimal)
          <input type="text" id="odds" />
        </label>
        <label>
          Description and Terms
          <textarea id="terms" rows="4" cols="50" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return (
              <Escrow
                key={escrow.address}
                {...escrow}
                isMatched={escrow.isMatched}
                settlementOutcome={escrow.settlementOutcome}
                handleMatch={escrow.handleMatch}
                handleApprove={escrow.handleApprove}
                handleReject={escrow.handleReject}
              />
            );
          })}
        </div>
        <div>
          <div
            className="button"
            id="clear"
            onClick={(e) => {
              e.preventDefault();

              setEscrows([]);
            }}
          >
            Clear Contracts
          </div>
        </div>
      </div>


    </>
  );
}

export default App;
