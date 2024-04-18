const { ethers } = require("hardhat");

async function main() {
    const ContactTeamManagement = await ethers.getContractFactory("ContactTeamManagement");
    
    // Start deployment, returning a promise that resolves to a contract object 
    const contactTeamManagement = await ContactTeamManagement.deploy();
    await contactTeamManagement.deployed();
    
    console.log("Contract deployed to address:", contactTeamManagement.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
