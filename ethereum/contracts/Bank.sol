// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./XYZToken.sol";

contract Bank is Ownable {
    using SafeMath for uint;

    struct User {
        uint256 value;
        bool withdrew;
        bool firstDeposit;
    }

    XYZToken public token;
    address private bank;
    uint256 public startTime;
    uint256 public timeBlock;
    uint public rewardPool;
    uint public R1;
    uint public R2;
    uint private prizeTaken;
    uint256 public activeUsers;
    mapping(address => User) public users;

    constructor(uint256 T, string memory timeUnit, uint256 _rewardPool) {
        token = new XYZToken(_rewardPool);
        bank = msg.sender;
        startTime = block.timestamp;

        if(keccak256(bytes(timeUnit)) == keccak256(bytes("minutes"))) {
            timeBlock = T * 1 minutes;
        } else {
            if (keccak256(bytes(timeUnit)) == keccak256(bytes("hours"))) {
                timeBlock = T * 1 hours;
            } else {
                    timeBlock = T * 1 days;
            }
        }

        rewardPool=_rewardPool;
        R1 = (_rewardPool.mul(20)).div(100);
        R2 = (_rewardPool.mul(30)).div(100);
    }

    function deposit(uint _numTokens) external payable {
        require(block.timestamp <= (startTime + timeBlock), "Period to deposit ended");
        require(msg.value >= _numTokens, "Low amount of ether to these tokens");

        token.transfer(address(token), _numTokens);

        if(users[msg.sender].firstDeposit != true){
            User storage user = users[msg.sender];
            user.value = _numTokens; user.withdrew = false; user.firstDeposit = true;
            activeUsers++;

        } else {
            User storage user = users[msg.sender];
            user.value += _numTokens;
        }
    }

    function withdraw() external {
        //lock period, idk if they can withdraw in the first period -> || block.timestamp <= (startTime + timeLimit)
        require( block.timestamp >= (startTime + (timeBlock * 2)), "Lock period" );
        
        //user has tokens
        User storage user = users[msg.sender];
        require(user.withdrew != true && user.value != 0, "You don't have more tokens");

        //prize pool R1
        if ( block.timestamp >= (startTime + (timeBlock * 2)) && block.timestamp <= (startTime + (timeBlock * 3)) ) {
            uint proportAmount = (R1 * user.value) / token.totalSupply();
            uint withdrawAmount = user.value + proportAmount - prizeTaken;

            token.transferFrom(address(token), msg.sender, withdrawAmount);
            prizeTaken += proportAmount;
            user.withdrew = true;

        } else {

            //prize pool R2
            if ( block.timestamp >= (startTime + (timeBlock * 3)) && block.timestamp <= (startTime + (timeBlock * 4)) ) {
                uint proportAmount = (R2 * user.value) / token.totalSupply();
                uint withdrawAmount = user.value + proportAmount - prizeTaken;
                
                token.transferFrom(address(token), msg.sender, withdrawAmount);
                prizeTaken += proportAmount;
                user.withdrew = true;

            } else {

                //full prize pool
                uint withdrawAmount = user.value + (rewardPool/activeUsers) - prizeTaken;
                token.transferFrom(address(token), msg.sender, withdrawAmount);
                user.withdrew = true;
            }
        }
        activeUsers--;
    }

    function bankWithdraw() public onlyOwner {
        require(activeUsers == 0, "There are still users to withdraw");
        require(block.timestamp >= (startTime + (timeBlock * 4)), "It isn't time to withdraw yet");
        require(rewardPool != prizeTaken, "There are no more tokens available");
        token.transferFrom(address(token), bank, rewardPool - prizeTaken);
        prizeTaken = rewardPool;
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

}