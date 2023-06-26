// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


contract Escrow {
	address public arbiter;
	address public counterparty;
	address public bettor;
	
	bool public isMatched;

	string toStake;

	bool public isApproved;

	constructor(address _arbiter, address _counterparty, string memory _toStake) payable {
		arbiter = _arbiter;
		counterparty = _counterparty;
		bettor = msg.sender;
		toStake = _toStake;
	}

	function st2num(string memory numString) public pure returns(uint) {
        uint  val=0;
        bytes   memory stringBytes = bytes(numString);
        for (uint  i =  0; i<stringBytes.length; i++) {
            uint exp = stringBytes.length - i;
            bytes1 ival = stringBytes[i];
            uint8 uval = uint8(ival);
           uint jval = uval - uint(0x30);
   
           val +=  (uint(jval) * (10**(exp-1))); 
        }
      return val;
    }


	event Matched(uint);

	function matchStake() external payable {
		require(msg.sender == counterparty);
		uint requiredVal = st2num(toStake);
		require(msg.value == requiredVal);
		isMatched = true;
		emit Matched(msg.value);
	}

	event Settled(address, uint);

	function settle(bool bettorWin) external {
		require(msg.sender == arbiter);
		require(isMatched == true);
		uint balance = address(this).balance;
		if (bettorWin) {
			(bool sent, ) = payable(bettor).call{value: balance}("");
			require(sent, "Failed to send Ether");
			emit Settled(bettor, balance);
			isApproved = true;
		} else {
			(bool sent, ) = payable(counterparty).call{value: balance}("");
			require(sent, "Failed to send Ether");
			emit Settled(counterparty, balance);
			isApproved = true;
		}

	}
}
