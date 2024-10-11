import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("ProxyModule", (m) => {
    const proxy = m.contract("Proxy", ["0x5FbDB2315678afecb367f032d93F642f64180aa3"]);

    // m.call(theContract, "ini", {  })

    return { proxy }
});

export default proxyModule;