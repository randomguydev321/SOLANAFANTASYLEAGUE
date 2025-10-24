pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NBAFantasy is Ownable {
    
    // Player data
    struct Player {
        string name;
        uint256 points;
        string position; // PG, SG, SF, PF, C
        uint256 salary;  // 1-5 tokens
        bool active;
    }
    
    // User lineup with salary cap
    struct Lineup {
        uint256 pg;
        uint256 sg;
        uint256 sf;
        uint256 pf;
        uint256 c;
        uint256 totalSalary;
        uint256 totalPoints;
        bool registered;
    }
    
    // Mappings
    mapping(uint256 => Player) public players;
    mapping(address => Lineup) public userLineups;
    
    // League settings
    uint256 public constant SALARY_CAP = 20; // 20 tokens total
    uint256 public entryFee = 0.1 ether;
    uint256 public prizePool;
    
    address[] public participants;
    
    constructor() Ownable(msg.sender) {}
    
    // Owner adds players with position and salary
    function addPlayer(
        uint256 playerId, 
        string memory name, 
        string memory position,
        uint256 salary
    ) external onlyOwner {
        require(salary >= 1 && salary <= 5, "Salary must be 1-5");
        require(
            keccak256(bytes(position)) == keccak256(bytes("PG")) ||
            keccak256(bytes(position)) == keccak256(bytes("SG")) ||
            keccak256(bytes(position)) == keccak256(bytes("SF")) ||
            keccak256(bytes(position)) == keccak256(bytes("PF")) ||
            keccak256(bytes(position)) == keccak256(bytes("C")),
            "Invalid position"
        );
        
        players[playerId] = Player({
            name: name,
            points: 0,
            position: position,
            salary: salary,
            active: true
        });
    }
    
    // Users register lineup with salary cap constraint
    function registerLineup(
        uint256 pgId,
        uint256 sgId,
        uint256 sfId,
        uint256 pfId,
        uint256 cId
    ) external payable {
        require(msg.value >= entryFee, "Insufficient entry fee");
        require(!userLineups[msg.sender].registered, "Already registered");
        
        // Verify positions
        require(players[pgId].active && keccak256(bytes(players[pgId].position)) == keccak256(bytes("PG")), "Invalid PG");
        require(players[sgId].active && keccak256(bytes(players[sgId].position)) == keccak256(bytes("SG")), "Invalid SG");
        require(players[sfId].active && keccak256(bytes(players[sfId].position)) == keccak256(bytes("SF")), "Invalid SF");
        require(players[pfId].active && keccak256(bytes(players[pfId].position)) == keccak256(bytes("PF")), "Invalid PF");
        require(players[cId].active && keccak256(bytes(players[cId].position)) == keccak256(bytes("C")), "Invalid C");
        
        // Calculate total salary
        uint256 totalSalary = players[pgId].salary + 
                              players[sgId].salary + 
                              players[sfId].salary + 
                              players[pfId].salary + 
                              players[cId].salary;
        
        require(totalSalary <= SALARY_CAP, "Exceeds salary cap");
        
        userLineups[msg.sender] = Lineup({
            pg: pgId,
            sg: sgId,
            sf: sfId,
            pf: pfId,
            c: cId,
            totalSalary: totalSalary,
            totalPoints: 0,
            registered: true
        });
        
        participants.push(msg.sender);
        prizePool += msg.value;
    }
    
    // Owner updates player scores
    function updatePlayerScore(uint256 playerId, uint256 points) external onlyOwner {
        players[playerId].points = points;
    }
    
    // Calculate user's total score
    function getUserScore(address user) public view returns (uint256) {
        if (!userLineups[user].registered) return 0;
        
        Lineup memory lineup = userLineups[user];
        
        return players[lineup.pg].points +
               players[lineup.sg].points +
               players[lineup.sf].points +
               players[lineup.pf].points +
               players[lineup.c].points;
    }
    
    // Get user's lineup
    function getUserLineup(address user) external view returns (
        uint256 pg,
        uint256 sg,
        uint256 sf,
        uint256 pf,
        uint256 c,
        uint256 totalSalary
    ) {
        Lineup memory lineup = userLineups[user];
        return (lineup.pg, lineup.sg, lineup.sf, lineup.pf, lineup.c, lineup.totalSalary);
    }
    
    // Get leaderboard
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256[] memory scores = new uint256[](participants.length);
        
        for(uint i = 0; i < participants.length; i++) {
            scores[i] = getUserScore(participants[i]);
        }
        
        return (participants, scores);
    }
    
    // Owner pays winner
    function payWinner(address winner) external onlyOwner {
        require(prizePool > 0, "No prize pool");
        uint256 prize = prizePool;
        prizePool = 0;
        payable(winner).transfer(prize);
    }
    
    // Update entry fee
    function setEntryFee(uint256 newFee) external onlyOwner {
        entryFee = newFee;
    }
}