const { ethers } = require('hardhat');
const { expect } = require('chai');


describe('Escrow', function () {
  let contract;
  let bettor1;
  let bettor2;
  let arbiter;
  const depositVal = 1
  const deposit = ethers.utils.parseEther(depositVal.toString());
  const odds = 240;
  const toStakeVal = (depositVal * odds / 100) - depositVal;
  const toStake = ethers.utils.parseEther(toStakeVal.toString());

  beforeEach(async () => {
    bettor1 = ethers.provider.getSigner(0);
    bettor2 = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);

    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      bettor2.getAddress(),
      toStake.toString(),
      {
        value: deposit,
      }
    );
    await contract.deployed();
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);
  });

  it('should convert string to number', async function () {
    let num = await contract.st2num("5");
    expect(num).to.eq(5);
  });

  it('should be fully funded after Bettor 2 calls matchStake', async function () {

    const before = await ethers.provider.getBalance(contract.address);
    const stakeMatched = await contract.connect(bettor2).matchStake({value: toStake});
    await stakeMatched.wait();
    const after = await ethers.provider.getBalance(contract.address);
    expect(after.sub(before)).to.eq(toStake);
  })

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(bettor2).settle(true)).to.be.reverted;
    });
  });

  describe('after settle from the arbiter in favor of Bettor 1', () => {
    it('should transfer balance to Bettor 1', async () => {
      const matchedTxn = await contract.connect(bettor2).matchStake({value: toStake});
      await matchedTxn.wait();
      const winnings = await ethers.provider.getBalance(contract.address);
      const before = await ethers.provider.getBalance(bettor1.getAddress());
      const approveTxn = await contract.connect(arbiter).settle(true);
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(bettor1.getAddress());
      expect(after.sub(before)).to.eq(winnings);
    });
  });

  describe('after settle from the arbiter in favor of Bettor 2', () => {
    it('should transfer balance to Bettor 2', async () => {
      const matchedTxn = await contract.connect(bettor2).matchStake({value: toStake});
      await matchedTxn.wait();
      const winnings = await ethers.provider.getBalance(contract.address);
      const before = await ethers.provider.getBalance(bettor2.getAddress());
      const approveTxn = await contract.connect(arbiter).settle(false);
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(bettor2.getAddress());
      expect(after.sub(before)).to.eq(winnings);
    });
  });
});
