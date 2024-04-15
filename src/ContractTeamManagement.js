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
        setNotification("Please enter both the team member address and task description.");
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
      const teamMember = await contractTeamManagement.methods.teamMembers(walletAddress).call();
      setTeamMembers(prevMembers => [...prevMembers, teamMember]);
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
          method: "eth_requestAccounts"
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
    <div className="team-management-container">
      <h1>Team Management Application</h1>
      {/* Display notification if available */}
      {notification && <p>{notification}</p>}
      {/* <button onClick={handleFetchTeamMembers}>Fetch Team Members</button> */}
      <div className="row">
        <div className="column">
          <button className="connect-metamask" onClick={connectToMetaMask}>
            Connect to MetaMask
          </button>
        </div>
        <div className="column">
          {connectedAddress && (
            <p>Connected Address: {connectedAddress}</p>
          )}
        </div>
      </div>
      {/* Viewing of Members Address, Name and Task */}
      <div className="row">
        <div className="column">
        <h2>Team Members</h2>
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>Total Tasks Assigned</th>
              <th>Total Tasks Completed</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.walletAddress}</td>
                <td>{member.name}</td>
                <td>{member.totalTasksAssigned}</td>
                <td>{member.totalTasksCompleted}</td>
                <td>{member.isActive ? "🟢" : "🔴"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
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
                  <input type="text" value={teamMemberAddress} onChange={(e) => setTeamMemberAddress(e.target.value)} />
              </label>
              <br />
              <label>
                  Task Description:
                  <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
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
                <input type="text" value={teamMemberAddress} onChange={(e) => setTeamMemberAddress(e.target.value)} />
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
                <input type="text" value={teamMemberAddress} onChange={(e) => setTeamMemberAddress(e.target.value)} />
            </label>
            <br />
            <label>
                Amount:
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
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
