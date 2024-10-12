// 1. Import modules.
import { createPublicClient, http, getContract, parseAbi, Abi, createWalletClient } from 'viem'
import { hardhat } from 'viem/chains'
import fs from 'fs'
import path from 'path'
import { privateKeyToAccount } from 'viem/accounts'

// 2. Set up your client with desired chain & transport.
const privateKey = '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6' // Replace with your private key
const account = privateKeyToAccount(privateKey)



// 2. Set up your client with desired chain & transport.
const client = createPublicClient({
    chain: hardhat,
    transport: http(),
})

const contractAddress = `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` // Proxy Contract

// Load and parse ABI
const abiPath = path.join(process.cwd(), 'artifacts', 'contracts', 'Proxy', 'Proxy.sol', 'Proxy.json')
if (!fs.existsSync(abiPath)) {
    throw new Error(`ABI file not found at ${abiPath}`)
}



const integrate = async () => {

    const signer = createWalletClient({
        account: account,
        chain: hardhat,
        transport: http(),
    })
    // require(abiPath).abi as Abi
    // const abi = parseAbi([
    //     'function upgrade(address newImplementation) external',
    //     'function implementation() public view returns (address)',
    //   ])
    const abi = require(abiPath).abi as Abi

    // prepare contract abject
    const contract = getContract({ address: contractAddress, abi: abi , client: {public: client, account} })


    try {
        // Ensure the method and parameters are correct
        const upgradeAddress = `0x5FbDB2315678afecb367f032d93F642f64180aa3` // Voting Contract
        console.log(`Calling upgrade method with address: ${upgradeAddress}`)
        
        // Check if the method exists in the ABI
        const methodExists = require(abiPath).abi.some((item: { name: string }) => item.name === 'upgrade')
        if (!methodExists) {
            throw new Error(`Method 'upgrade' not found in ABI`)
        }

        // const tx = await contract.write.upgrade([upgradeAddress])
        const tx = await signer.writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'upgrade',
            args: [upgradeAddress]
        })
        console.log('Transaction successful:', tx)
        console.log('-------------------------------------')
    } catch (error) {
        console.error('Error executing contract method:', error)
    }

    // try {
    //     // Read the implementation value
    //     const implementation = await contract.read.implementation()
    //     console.log('Implementation address:', implementation)
    // } catch (error) {
    //     console.error('Error reading contract method:', error)
    // }

    await client.readContract({
        address: contractAddress,
        abi: abi,
        functionName: 'vote',
        args: []
    }).then((result) => {
        console.log('Implementation address:', result)
    })

}

integrate().catch(console.error)