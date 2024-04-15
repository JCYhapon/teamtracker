const alchemyKey = "wss://eth-sepolia.g.alchemy.com/v2/FI-974hdofERGqCnrGu-doHGCuP1LqHt";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require('../contract-abi.json');
const contractAddress = '0x8CFeBC7dF90808DFed7258CDD244B1fF56f33eF7';


export const contractTeamManagement = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export async function addTeamMember(walletAddress, name) {
  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.addTeamMember(walletAddress, name).send({ from: userAddress });

      // Check if the TaskAssigned event is emitted
      contract.events.TaskAssigned({ filter: { teamMember: walletAddress } }, (error, event) => {
          if (!error) {
              console.log("Team member added successfully");
          } else {
              console.error("Error adding team member:", error);
          }
      });
  } catch (error) {
      console.error("Error adding team member:", error);
  }
}



export async function assignTask(teamMember, taskDescription) {
  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      await contractTeamManagement.methods.assignTask(teamMember, taskDescription).send({ from: userAddress });
      console.log("Task assigned successfully");
      return true;
  } catch (error) {
      console.error("Error assigning task:", error);
      return false;
  }
}


export async function completeTask(teamMember) {
  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      await contractTeamManagement.methods.completeTask(teamMember).send({ from: userAddress });
      console.log("Task completed successfully");
      return true;
  } catch (error) {
      console.error("Error completing task:", error);
      return false;
  }
}


export async function deactivateTeamMember(teamMember) {
  try {
      // Get the current user's account address from MetaMask
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];

      // Call the deactivateTeamMember function of the contract
      await contractTeamManagement.methods.deactivateTeamMember(teamMember).send({ from: userAddress });

      console.log("Team member deactivated successfully");
      return true;
  } catch (error) {
      console.error("Error deactivating team member:", error);
      return false;
  }
}

export async function releasePayment(teamMember, amount) {
  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      await contractTeamManagement.methods.releasePayment(teamMember, amount).send({ from: userAddress });
      console.log("Payment released successfully");
      return true;
  } catch (error) {
      console.error("Error releasing payment:", error);
      return false;
  }
}

// Function to get a team member's details
async function getTeamMembers(walletAddress) {
    try {
        const teamMember = await contractTeamManagement.methods.teamMembers(walletAddress).call();
        console.log(`Wallet Address: ${teamMember.walletAddress}`);
        console.log(`Name: ${teamMember.name}`);
        console.log(`Total Tasks Assigned: ${teamMember.totalTasksAssigned}`);
        console.log(`Total Tasks Completed: ${teamMember.totalTasksCompleted}`);
        console.log(`Is Active: ${teamMember.isActive}`);
    } catch (error) {
        console.error(`Error fetching team member: ${error}`);
    }
}

// Usage
getTeamMembers('0x1ca266b1F1bdBD94Cd980BCF611D6dD93BCc5B7f');





export async function withdrawBalance() {
    // Implement withdrawBalance function here
}
