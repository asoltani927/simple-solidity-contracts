// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Voting.sol";

contract VotingFactory {
    address[] public votingContracts;

    event VotingContractCreated(address votingContract);

    function createVoting(string[] memory candidateNames) public {
        Voting newVoting = new Voting();
        newVoting.initialize(candidateNames);
        votingContracts.push(address(newVoting));
        emit VotingContractCreated(address(newVoting));
    }

    function getVotingContracts() public view returns (address[] memory) {
        return votingContracts;
    }
}