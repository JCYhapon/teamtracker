// SPDX-License-Identifier: MIT

pragma solidity >=0.7.3;
pragma experimental ABIEncoderV2;

contract ContactTeamManagement {
    // Structure to represent a contact team member
    struct TeamMember {
        address payable walletAddress;
        string name;
        uint256 totalTasksAssigned;
        uint256 totalTasksCompleted;
        bool isActive;
    }
    
    // Mapping to store team members
    mapping(address => TeamMember) public teamMembers;
    
    // Mapping to store received payments for each team member
    mapping(address => uint256) public receivedPayments;

    // Array to store addresses of team members
    address[] public teamMemberAddresses;
    
    // Contract owner
    address payable public owner;
    
    // Constructor to set the contract owner
    constructor() {
        owner = payable(msg.sender);
    }
    
    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    // Event to log task assignment
    event TaskAssigned(address indexed teamMember, string taskDescription);
    
    // Event to log payment release
    event PaymentReleased(address indexed teamMember, uint256 amount);
    
    // Receive function to accept Ether sent to the contract
    receive() external payable {
        // Store the received payment for the sender
        receivedPayments[msg.sender] += msg.value;
    }
    
    // Function to add a new team member
    function addTeamMember(address payable _walletAddress, string memory _name) external {
        require(!teamMembers[_walletAddress].isActive, "Team member already exists");
        
        TeamMember memory newMember = TeamMember({
            walletAddress: _walletAddress,
            name: _name,
            totalTasksAssigned: 0,
            totalTasksCompleted: 0,
            isActive: true
        });
        
        teamMembers[_walletAddress] = newMember;
        teamMemberAddresses.push(_walletAddress); // Update the array of team member addresses
    }
    
    // Function to assign a task to a team member
    function assignTask(address _teamMember, string memory _taskDescription) external onlyOwner {
        require(teamMembers[_teamMember].isActive, "Team member does not exist");
        
        // Increment total tasks assigned
        teamMembers[_teamMember].totalTasksAssigned++;
        
        // Emit event
        emit TaskAssigned(_teamMember, _taskDescription);
    }
    
    // Function to mark a task as completed
    function completeTask(address _teamMember) external onlyOwner {
        require(teamMembers[_teamMember].isActive, "Team member does not exist");
        
        // Increment total tasks completed
        teamMembers[_teamMember].totalTasksCompleted++;
    }
    
    // Function to release payment to a team member
    function releasePayment(address payable _teamMember, uint256 _amount) external onlyOwner {
        require(teamMembers[_teamMember].isActive, "Team member does not exist");
        
        // Ensure the contract has enough received funds for the payment
        require(receivedPayments[_teamMember] >= _amount, "Insufficient received balance for payment");
        
        // Send payment
        _teamMember.transfer(_amount);
        
        // Update the received balance for the team member
        receivedPayments[_teamMember] -= _amount;
        
        // Emit event
        emit PaymentReleased(_teamMember, _amount);
    }
    
    // Function to deactivate a team member
    function deactivateTeamMember(address _teamMember) external onlyOwner {
        require(teamMembers[_teamMember].isActive, "Team member does not exist");
        
        teamMembers[_teamMember].isActive = false;
    }
    
    // Function to withdraw contract balance (only for the contract owner)
    function withdrawBalance() external onlyOwner {
        owner.transfer(address(this).balance);
    }

     // Function to get the count of team members
    function getTeamMemberCount() external view returns (uint256) {
        return teamMemberAddresses.length;
    }

    // Function to get details of all team members
    function getAllTeamMembers() external view returns (address[] memory, string[] memory, uint256[] memory, uint256[] memory, bool[] memory) {
        address[] memory addresses = new address[](teamMemberAddresses.length);
        string[] memory names = new string[](teamMemberAddresses.length);
        uint256[] memory totalTasksAssigned = new uint256[](teamMemberAddresses.length);
        uint256[] memory totalTasksCompleted = new uint256[](teamMemberAddresses.length);
        bool[] memory isActive = new bool[](teamMemberAddresses.length);

        for (uint256 i = 0; i < teamMemberAddresses.length; i++) {
            TeamMember memory member = teamMembers[teamMemberAddresses[i]];
            addresses[i] = member.walletAddress;
            names[i] = member.name;
            totalTasksAssigned[i] = member.totalTasksAssigned;
            totalTasksCompleted[i] = member.totalTasksCompleted;
            isActive[i] = member.isActive;
        }

        return (addresses, names, totalTasksAssigned, totalTasksCompleted, isActive);
    }
}

