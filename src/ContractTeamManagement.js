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

      <div className="flex gap-3 items-center">
        <div className="border p-4 rounded-md mt-4 overflow-x-auto h-[25rem] w-[160vh]">
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

        <div className="flex flex-col h-[25rem] mt-4 gap-4">
          {/* Adding New Team Member */}
          <div className="w-[60vh] border p-4 rounded-md h-full">
            <form onSubmit={handleAddTeamMember} className="">
              <div className="flex mt-6 flex-col">
                <label className="flex justify-start items-center">
                  Wallet Address:
                  <input
                    type="text"
                    name="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="ml-2 border p-2 rounded w-[25rem]"
                  />
                </label>

                <label className="flex justify-start mt-4 items-center">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ml-2 border p-2 rounded w-[30rem]"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end ">
                <button
                  type="submit"
                  className="border px-[10px] py-[5px] text-sm rounded-md bg-orange-600 text-white flex gap-2 items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="12.25"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                    />
                  </svg>
                  Add team member
                </button>
              </div>
            </form>
          </div>

          {/* Deactivating Team Member */}
          <div className="w-[60vh] border p-4 rounded-md h-full">
            <form onSubmit={handleDeactivateTeamMember}>
              <div className="mt-6">
                <label className="flex justify-start items-center">
                  Team Member Address:
                  <input
                    type="text"
                    name="teamMember"
                    value={teamMemberAddress}
                    onChange={(e) => setTeamMemberAddress(e.target.value)}
                    className="ml-2 border p-2 rounded w-[25rem]"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end items-end">
                <button
                  type="submit"
                  className="border px-[10px] py-[5px] text-sm rounded-md bg-orange-600 text-white flex gap-2 items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="14"
                    width="10.5"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                    />
                  </svg>
                  Deactivate member
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        {/* Assigning Task to a Team Member */}
        <div className="w-[80vh] border p-4 rounded-md h-[13rem]">
          <h2 className="flex justify-start mb-3 font-semibold">Assign Task</h2>
          <form onSubmit={handleAssignTask}>
            <div className="flex flex-col gap-2">
              <label className="flex justify-start">
                <input
                  type="text"
                  value={teamMemberAddress}
                  onChange={(e) => setTeamMemberAddress(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Team member address"
                />
              </label>
              <label className="flex justify-start">
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Task description"
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end ">
              <button
                type="submit"
                className="border px-[10px] py-[5px] text-sm rounded-md bg-orange-600 text-white flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="14"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ffffff"
                    d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
                  />
                </svg>
                Add task
              </button>
            </div>
          </form>
        </div>
        {/* Task Completion */}
        <div className="relative w-[80vh] border p-4 rounded-md h-[13rem]">
          <h2 className="flex justify-start mb-3 font-semibold">
            Complete Task
          </h2>
          <form onSubmit={handleCompleteTask}>
            <div className="flex flex-col gap-2 justify-between">
              <label className="flex justify-start">
                <input
                  type="text"
                  value={teamMemberAddress}
                  onChange={(e) => setTeamMemberAddress(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Team member address"
                />
              </label>
            </div>
            <button
              type="submit"
              className="absolute bottom-4 right-4 border px-[10px] py-[5px] text-sm rounded-md bg-orange-600 text-white flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                width="14"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#ffffff"
                  d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                />
              </svg>
              Complete task
            </button>
          </form>
        </div>

        {/* Releasing Payment */}
        <div className="relative w-[80vh] border p-4 rounded-md h-[13rem]">
          <h2 className="flex justify-start mb-3 font-semibold">
            Release Payment
          </h2>
          <form onSubmit={handleReleasePayment}>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="text"
                  value={teamMemberAddress}
                  onChange={(e) => setTeamMemberAddress(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Team member address"
                />
              </label>

              <label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Team member address"
                />
              </label>
            </div>

            <button
              type="submit"
              className="absolute bottom-4 right-4 border px-[10px] py-[5px] text-sm rounded-md bg-orange-600 text-white flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                width="15.75"
                viewBox="0 0 576 512"
              >
                <path
                  fill="#ffffff"
                  d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z"
                />
              </svg>
              Release payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractTeamManagement;
