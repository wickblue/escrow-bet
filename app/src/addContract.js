import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function addContract(
  id,
  contract,
  arbiter,
  counterparty,
  odds,
  toStake,
  value
) {
  const buttonId = `approve-${id}`;

  const container = document.getElementById('container');
  container.innerHTML += createHTML(buttonId, arbiter, counterparty, odds, toStake, value);

  contract.on('Approved', () => {
    document.getElementById(buttonId).className = 'complete';
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
  });

  document.getElementById(buttonId).addEventListener('click', async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).approve(true);
  });
}

function createHTML(buttonId, arbiter, counterparty, odds, value) {
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Counterparty </div>
          <div> ${counterparty} </div>
        </li>
        <li>
          <div> Odds </div>
          <div> ${odds} </div>
        </li>
        <li>
          <div> Bettor Stake </div>
          <div> ${value} </div>
        </li>
        <li>
          <div> Counterparty Stake </div>
          <div> ${toStake} </div>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}
