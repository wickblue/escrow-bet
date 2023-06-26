import { ethers } from 'ethers';
import { useEffect, useState } from 'react';


export default function Escrow({
  address,
  bettor,
  arbiter,
  counterparty,
  odds,
  toStake,
  terms,
  value,
  handleMatch,
  handleApprove,
  handleReject,
}) {

  const [isMatched, setIsMatched] = useState(false);
  const [settlementOutcome, setSettlementOutcome] = useState('');

  useEffect(() => {
    const storedIsMatched = localStorage.getItem(`${address}-isMatched`);
    if (storedIsMatched) {
      setIsMatched(JSON.parse(storedIsMatched));
    }

    const storedSettlementOutcome = localStorage.getItem(`${address}-settlementOutcome`);
    if (storedSettlementOutcome) {
      setSettlementOutcome(storedSettlementOutcome);
    }
  }, [address]);

  useEffect(() => {
    localStorage.setItem(`${address}-settlementOutcome`, settlementOutcome);
  }, [address, settlementOutcome]);

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Bettor </div>
          <div> {bettor} </div>
        </li>
        <li>
          <div> Counterparty </div>
          <div> {counterparty} </div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Bettor Stake </div>
          <div> {ethers.utils.formatEther(value)} ETH</div>
        </li>
        <li>
          <div>Counterparty Stake</div>
          <div>{ethers.utils.formatEther(toStake)} ETH</div>
        </li>
        <li>
          <div> Odds </div>
          <div> {odds} </div>
        </li>
        <li>
          <div> Terms and Description </div>
        </li>
        <li>
          <div className="terms custom-font"> {terms} </div>
        </li>
        <li>
          <div>For Counterparty</div>
        </li>
        <li>
          <div>
            {isMatched ? (
              <div className="confirmation-text">
                Funds deposited by Counterparty
              </div>
            ) : (
              <div
                className="button"
                id={toStake}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await handleMatch();
                    setIsMatched(true);
                  } catch(error) {
                    console.error("Failed to match stake: ", error);
                  }
                }}
              >
                Match Stake
              </div>
            )}
          </div>
        </li>
        <li>
          <div>For Arbiter</div>
        </li>
        <li>
          <div>
            {!settlementOutcome && (
              <div>
                <div
                  className="button"
                  id={address}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await handleApprove();
                      setSettlementOutcome('Bettor');
                    } catch (error) {
                      console.error('Failed to settle:', error);
                    }
                  }}
                >
                  Bettor Win
                </div>
                <div
                  className="button"
                  id={counterparty}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await handleReject();
                      setSettlementOutcome('Counterparty');
                    } catch (error) {
                      console.error('Failed to settle:', error);
                    }
                  }}
                >
                  Counterparty Win
                </div>
              </div>
            )}
          </div>
        </li>
        <li>
          <div>
            {settlementOutcome === 'Bettor' && (
              <div className="confirmation-text">
                Funds sent to Bettor
              </div>
            )}
            {settlementOutcome === 'Counterparty' && (
              <div className="confirmation-text">
                Funds sent to Counterparty
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
