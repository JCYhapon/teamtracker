import React, { useState, useEffect } from "react";
import {
  addTeamMember,
  assignTask,
  completeTask,
  deactivateTeamMember,
  releasePayment,
  getTeamMembers,
  // withdrawBalance,
  contractTeamManagement,
} from "./util/interact.js";

const ContractTeamManagement = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [teamMemberAddress, setTeamMemberAddress] = useState("");

  // Function to handle adding a team member
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      await addTeamMember(walletAddress, name);
      setNotification("Team member added successfully");
    } catch (error) {
      if (error.message.includes("already a member")) {
        setNotification("Address is already a member");
      } else {
        setNotification("Team member unsuccesfully added");
      }
    }
  };

  // Function to handle assigning a task
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!teamMemberAddress || !taskDescription) {
      setNotification(
        "Please enter both the team member address and task description."
      );
      return;
    }
    const success = await assignTask(teamMemberAddress, taskDescription);
    if (success) {
      setNotification("Task assigned successfully");
    } else {
      setNotification("Failed to assign task. Please try again.");
    }
  };

  // Function to handle completing a task
  const handleCompleteTask = async (e) => {
    e.preventDefault();
    if (!teamMemberAddress) {
      setNotification("Please enter the team member address.");
      return;
    }
    const success = await completeTask(teamMemberAddress);
    if (success) {
      setNotification("Task completed successfully");
    } else {
      setNotification("Failed to complete task. Please try again.");
    }
  };

  // Function to handle deactivating a team member
  const handleDeactivateTeamMember = async (e) => {
    e.preventDefault();
    try {
      await deactivateTeamMember(teamMemberAddress);
      setNotification("Team member deactivated successfully");
      // Update the team members list after deactivation
      fetchTeamMember();
    } catch (error) {
      console.error("Error deactivating team member:", error);
      setNotification("Error deactivating team member");
    }
  };

  // Function to handle releasing payment
  const handleReleasePayment = async (e) => {
    e.preventDefault();
    if (!teamMemberAddress || !amount) {
      setNotification("Please enter both team member address and amount.");
      return;
    }
    const success = await releasePayment(teamMemberAddress, amount);
    if (success) {
      setNotification("Payment released successfully");
    } else {
      setNotification("Failed to release payment. Please try again.");
    }
  };

  // Function to fetch team members
  const fetchTeamMember = async (walletAddress) => {
    try {
      const teamMember = await contractTeamManagement.methods
        .teamMembers(walletAddress)
        .call();
      setTeamMembers((prevMembers) => [...prevMembers, teamMember]);
    } catch (error) {
      console.error(`Error fetching team member: ${error}`);
    }
  };

  // Fetch team members when component mounts
  useEffect(() => {
    if (connectedAddress) {
      fetchTeamMember(connectedAddress);
    }
  }, [connectedAddress]);

  // Connecting to MetaMask
  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected to MetaMask:", accounts[0]);
        setConnectedAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  return (
    <div className="min-h-full p-8">
      {/* Display notification if available */}
      {notification && <p>{notification}</p>}
      {/* <button onClick={handleFetchTeamMembers}>Fetch Team Members</button> */}
      <div className="flex min-w-full items-center gap-4">
        <div className=" flex justify-center items-center border p-4 rounded-md h-[20px] font-medium hover:text-white hover:bg-orange-600  text-black ">
          <button
            className="connect-metamask text-sm"
            onClick={connectToMetaMask}
          >
            Connect to MetaMask
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="20"
            viewBox="0 0 212 189"
            id="metamask"
          >
            <g fill="none" fill-rule="evenodd">
              <polygon
                fill="#CDBDB2"
                points="60.75 173.25 88.313 180.563 88.313 171 90.563 168.75 106.313 168.75 106.313 180 106.313 187.875 89.438 187.875 68.625 178.875"
              ></polygon>
              <polygon
                fill="#CDBDB2"
                points="105.75 173.25 132.75 180.563 132.75 171 135 168.75 150.75 168.75 150.75 180 150.75 187.875 133.875 187.875 113.063 178.875"
                transform="matrix(-1 0 0 1 256.5 0)"
              ></polygon>
              <polygon
                fill="#393939"
                points="90.563 152.438 88.313 171 91.125 168.75 120.375 168.75 123.75 171 121.5 152.438 117 149.625 94.5 150.188"
              ></polygon>
              <polygon
                fill="#F89C35"
                points="75.375 27 88.875 58.5 95.063 150.188 117 150.188 123.75 58.5 136.125 27"
              ></polygon>
              <polygon
                fill="#F89D35"
                points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
              ></polygon>
              <polygon
                fill="#D87C30"
                points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
              ></polygon>
              <polygon
                fill="#EA8D3A"
                points="46.125 101.813 65.25 119.813 65.25 137.813"
              ></polygon>
              <polygon
                fill="#F89D35"
                points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
              ></polygon>
              <polygon
                fill="#EB8F35"
                points="65.25 138.375 60.75 173.25 90.563 152.438"
              ></polygon>
              <polygon
                fill="#EA8E3A"
                points="92.25 102.375 95.063 150.188 86.625 125.719"
              ></polygon>
              <polygon
                fill="#D87C30"
                points="39.375 138.938 65.25 138.375 60.75 173.25"
              ></polygon>
              <polygon
                fill="#EB8F35"
                points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
              ></polygon>
              <polygon
                fill="#E8821E"
                points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
              ></polygon>
              <polygon
                fill="#DFCEC3"
                points="60.75 173.25 90.563 152.438 88.313 170.438 88.313 180.563 68.063 176.625"
              ></polygon>
              <polygon
                fill="#DFCEC3"
                points="121.5 173.25 150.75 152.438 148.5 170.438 148.5 180.563 128.25 176.625"
                transform="matrix(-1 0 0 1 272.25 0)"
              ></polygon>
              <polygon
                fill="#393939"
                points="70.313 112.5 64.125 125.438 86.063 119.813"
                transform="matrix(-1 0 0 1 150.188 0)"
              ></polygon>
              <polygon
                fill="#E88F35"
                points="12.375 .563 88.875 58.5 75.938 27"
              ></polygon>
              <path
                fill="#8E5A30"
                d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
              ></path>
              <g transform="matrix(-1 0 0 1 211.5 0)">
                <polygon
                  fill="#F89D35"
                  points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"
                ></polygon>
                <polygon
                  fill="#D87C30"
                  points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"
                ></polygon>
                <polygon
                  fill="#EA8D3A"
                  points="46.125 101.813 65.25 119.813 65.25 137.813"
                ></polygon>
                <polygon
                  fill="#F89D35"
                  points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"
                ></polygon>
                <polygon
                  fill="#EB8F35"
                  points="65.25 138.375 60.75 173.25 90 153"
                ></polygon>
                <polygon
                  fill="#EA8E3A"
                  points="92.25 102.375 95.063 150.188 86.625 125.719"
                ></polygon>
                <polygon
                  fill="#D87C30"
                  points="39.375 138.938 65.25 138.375 60.75 173.25"
                ></polygon>
                <polygon
                  fill="#EB8F35"
                  points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"
                ></polygon>
                <polygon
                  fill="#E8821E"
                  points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"
                ></polygon>
                <polygon
                  fill="#393939"
                  points="70.313 112.5 64.125 125.438 86.063 119.813"
                  transform="matrix(-1 0 0 1 150.188 0)"
                ></polygon>
                <polygon
                  fill="#E88F35"
                  points="12.375 .563 88.875 58.5 75.938 27"
                ></polygon>
                <path
                  fill="#8E5A30"
                  d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <div className=" flex text-sm border p-4 rounded-md h-[20px] items-center gap-3">
          <div>
            <p>Connected address: </p>
          </div>
          <div>{connectedAddress && <p>{connectedAddress}</p>}</div>
        </div>
      </div>

      <div className="border p-4 rounded-md mt-4 overflow-x-auto h-[25rem] w-[140vh]">
        <h2 className="mb-4 font-bold text-[25px]">Team Members</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2">Address</th>
              <th className="py-2">Name</th>
              <th className="py-2">Total Tasks Assigned</th>
              <th className="py-2">Total Tasks Completed</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{member.walletAddress}</td>
                <td className="py-2">{member.name}</td>
                <td className="py-2">{member.totalTasksAssigned}</td>
                <td className="py-2">{member.totalTasksCompleted}</td>
                <td className="py-2">{member.isActive ? "🟢" : "🔴"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row">
        {/* Adding New Team Member */}
        <div className="column">
          <h2>Add Team Member</h2>
          <form onSubmit={handleAddTeamMember}>
            <label>
              Wallet Address:
              <input
                type="text"
                name="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </label>
            <br />
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Add Team Member</button>
          </form>
        </div>
        {/* Assigning Task to a Team Member */}
        <div className="column">
          <h2>Assign Task</h2>
          <form onSubmit={handleAssignTask}>
            <label>
              Team Member Address:
              <input
                type="text"
                value={teamMemberAddress}
                onChange={(e) => setTeamMemberAddress(e.target.value)}
              />
            </label>
            <br />
            <label>
              Task Description:
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Assign Task</button>
          </form>
        </div>
        {/* Task Completion */}
        <div className="column">
          <h2>Complete Task</h2>
          <form onSubmit={handleCompleteTask}>
            <label>
              Team Member Address:
              <input
                type="text"
                value={teamMemberAddress}
                onChange={(e) => setTeamMemberAddress(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Complete Task</button>
          </form>
        </div>
      </div>
      <div className="row">
        {/* Deactivating Team Member */}
        <div className="column">
          <h2>Deactivate Team Member</h2>
          <form onSubmit={handleDeactivateTeamMember}>
            <label>
              Team Member Address:
              <input
                type="text"
                name="teamMember"
                value={teamMemberAddress}
                onChange={(e) => setTeamMemberAddress(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Deactivate Team Member</button>
          </form>
        </div>
        {/* Releasing Payment */}
        <div className="column">
          <h2>Release Payment</h2>
          <form onSubmit={handleReleasePayment}>
            <label>
              Team Member Address:
              <input
                type="text"
                value={teamMemberAddress}
                onChange={(e) => setTeamMemberAddress(e.target.value)}
              />
            </label>
            <br />
            <label>
              Amount:
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Release Payment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractTeamManagement;
