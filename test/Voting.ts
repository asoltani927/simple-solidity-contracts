import { createPublicClient, http, createWalletClient, parseGwei } from 'viem';
import { hardhat } from 'viem/chains';
import { expect } from 'chai';
import hre from "hardhat";

describe('Voting Contract', () => {
  let votingAddress: `0x${string}`;
  let publicClient: ReturnType<typeof createPublicClient>;
  let walletClient: ReturnType<typeof createWalletClient>;
  const accounts = privateKeyToAccount(process.env.PRIVATE_KEY!);

  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

    const lockedAmount = parseGwei("1");
    const unlockTime = BigInt((await time.latest()) + ONE_YEAR_IN_SECS);

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const lock = await hre.viem.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    const publicClient = await hre.viem.getPublicClient();

    return {
      lock,
      unlockTime,
      lockedAmount,
      owner,
      otherAccount,
      publicClient,
    }
  }

  beforeEach(async () => {
    // Set up the client for hardhat chain
    publicClient = createPublicClient({ chain: hardhat, transport: http() });
    walletClient = createWalletClient({
      chain: hardhat,
      transport: http(),
      account: accounts,
    });

    // Deploy the contract (using a utility function or directly in this file)
    const candidates = ['Alice', 'Bob', 'Charlie'];
    votingAddress = await  hre.viem.deployContract(walletClient, 'Voting', [candidates]);
  });

  it('Should deploy with the correct candidates', async () => {
    const candidates: string[] = await publicClient.readContract({
      address: votingAddress,
      abi: [parseAbiItem('function candidates(uint256) view returns (string)')],
      functionName: 'candidates',
      args: [0],
    });
    expect(candidates[0]).to.equal('Alice');
    expect(candidates[1]).to.equal('Bob');
    expect(candidates[2]).to.equal('Charlie');
  });

  it('Should allow voting for a valid candidate', async () => {
    await walletClient.writeContract({
      address: votingAddress,
      abi: [parseAbiItem('function vote(string)')],
      functionName: 'vote',
      args: ['Alice'],
    });

    const voteCount: bigint = await publicClient.readContract({
      address: votingAddress,
      abi: [parseAbiItem('function getVoteCount(string) view returns (uint256)')],
      functionName: 'getVoteCount',
      args: ['Alice'],
    });

    expect(voteCount).to.equal(1n); // 'n' for BigInt
  });

  it('Should not allow voting twice from the same address', async () => {
    await walletClient.writeContract({
      address: votingAddress,
      abi: [parseAbiItem('function vote(string)')],
      functionName: 'vote',
      args: ['Alice'],
    });

    await expect(
      walletClient.writeContract({
        address: votingAddress,
        abi: [parseAbiItem('function vote(string)')],
        functionName: 'vote',
        args: ['Alice'],
      })
    ).to.be.rejectedWith('you have already voted');
  });

  it('Should return the correct winner', async () => {
    await walletClient.writeContract({
      address: votingAddress,
      abi: [parseAbiItem('function vote(string)')],
      functionName: 'vote',
      args: ['Alice'],
    });

    const { winnerName, winnerVoteCounts }: { winnerName: string; winnerVoteCounts: bigint } =
      await publicClient.readContract({
        address: votingAddress,
        abi: [parseAbiItem('function winner() view returns (string, uint256)')],
        functionName: 'winner',
      });

    expect(winnerName).to.equal('Alice');
    expect(winnerVoteCounts).to.equal(1n);
  });
});
