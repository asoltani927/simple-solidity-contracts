// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    string[] public candidates;

    mapping(string => uint256) public votes;

    mapping(address => string) public voters;

    mapping(address => bool) public hasVoted;

    constructor(string[] memory _candidateNames) {
        candidates = _candidateNames;
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
        voters[msg.sender] = candidate;
        hasVoted[msg.sender] = true;
    }

    // Function to get the vote count of a candidate
    function getVoteCount(
        string memory candidate
    ) external view returns (uint256) {
        return votes[candidate];
    }

    // Function to check if someone has voted
    function checkIfVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }

    function winner()
        external
        view
        returns (string memory winnerName, uint256 winnerVoteCounts)
    {
        winnerVoteCounts = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (votes[candidates[i]] > 0 && votes[candidates[i]] > winnerVoteCounts) {
                winnerName = candidates[i];
                winnerVoteCounts = votes[candidates[i]];
            }
        }
    }
}
