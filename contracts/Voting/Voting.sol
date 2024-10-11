// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./VotingUtils.sol";

error AccessForbidden();

// inheritance and virtual and ovverride methods
// super contractor


// IA
// call by abi
// staticcall


contract Voting is Initializable {

    event VotedEvent(string indexed candidate, address voter) anonymous; 

    address private owner;

    string[] public candidates;

    mapping(string => uint256) public votes;

    mapping(address => string) public voters;

    mapping(address => bool) public hasVoted;

    function initialize(string[] memory _candidateNames) public initializer {
        owner = msg.sender;
        candidates = _candidateNames;
    }

    modifier OnlyOwner {
        require(!(msg.sender == owner), AccessForbidden());
        _;
    }
    
    function vote(string memory candidate) public {
        // Ensure that the signer hasn't voted before
        require(!hasVoted[msg.sender], "you have already voted");

        // check if the candidates is exists
        bool isValidCandidate = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (
                keccak256(abi.encodePacked(candidates[i])) ==
                keccak256(abi.encodePacked(candidate))
            ) {
                isValidCandidate = true;
                break;
            }
        }
        require(isValidCandidate, "Invalid candidate.");

        votes[candidate]++;
        emit VotedEvent(candidate, msg.sender);
    }

    // Function to get the vote count of a candidate
    function getVoteCount(string memory candidate) external view returns (uint256) {
        return votes[candidate];
    }

    // Function to check if someone has voted
    function checkIfVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }

    function winner() external view returns (string memory) {
        string memory winningCandidate;
        uint256 highestVotes = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (votes[candidates[i]] > highestVotes) {
                highestVotes = votes[candidates[i]];
                winningCandidate = candidates[i];
            }
        }
        return winningCandidate;
    }

    function resetVoting() external OnlyOwner {
        for (uint i = 0; i < candidates.length; i++) {
            votes[candidates[i]] = 0;
        }
        for (uint i = 0; i < candidates.length; i++) {
            votes[candidates[i]] = 0;
        }
        for (uint i = 0; i < candidates.length; i++) {
            address voter = address(uint160(uint256(keccak256(abi.encodePacked(candidates[i])))));
            hasVoted[voter] = false;
        }
    }

    function removeCandidate(string memory candidate) external OnlyOwner {
        // require(candidates.remove(candidate), "Candidate not found");
    }

    function addCandidate(string memory candidate) external OnlyOwner {
        // require(candidates.remove(candidate), "Candidate not found");
    }
}