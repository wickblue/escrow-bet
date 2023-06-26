# Decentralized Betting Escrow App

This is an app built to let two users bet with one another with an arbiter to decide who won or lost.

Steps to place bet:
1. Enter an arbiter's address
2. Enter your counterparty's address
3. Enter in how much you're willing to stake.
4. Enter the odds (in decimal odds). If you think you're 1 in 4 to win, enter 4 as your decimal odds.
5. Detail the terms of the bet for the arbiter
6. Deploy the contract!

Steps to complete bet:
1. The counterparty needs to put up his stake too. Once he accesses the page, he can match his portion of stake.
2. The arbiter decides who won or lost the bet, either the bettor or the counterparty, and the funds from the contract are immediately sent to the winner.

TO-DO (continuation of project)

Having gotten the site workable, I'd like to continue with the material in the Alchemy course but would like to return to continue this project.

1. Have the existing contracts read from the Ethereum blockchain rather than from local storage. A public list of contract addresses should be accessible. This way, contracts that have been created and not resolved can always be accessed, added to the 'Existing Contracts' queue and then resolved
2. Clean up the UI and make it look "prettier"
3. Connect the app to the Ethereum network rather than local test blockchain.


## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.



