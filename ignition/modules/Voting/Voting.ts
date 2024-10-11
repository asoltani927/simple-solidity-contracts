import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const votingModule = buildModule("VotingModule", (m) => {
    const voting = m.contract("Voting");

    // m.call(theContract, "ini", {  })

    return { voting }
});

export default votingModule;