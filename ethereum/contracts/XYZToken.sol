// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract XYZToken is IERC20 {

    string public _name;
    string public _symbol;
    uint256 internal _totalSupply;
    mapping(address => uint256) public balances;

    constructor(uint256 rewardPool) {
        _name = "XYZToken";
        _symbol = "XYZ";
        balances[address(this)] = rewardPool;
        _totalSupply = rewardPool;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return balances[account];
    }

    function transfer(address _to, uint256 _value) public virtual override returns (bool success) {
        require(msg.sender != address(0), "ERC20: mint to the zero address");

        _totalSupply += _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(_value <= balances[_from]);

        _totalSupply -= _value;
        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }



    mapping(address => mapping(address => uint256)) public override allowance;
    mapping(address => mapping (address => uint256)) private _allowed;
    function _allowance(address owner, address delegate) public view returns (uint) {
        return _allowed[owner][delegate];
    }
    function approve(address _spender, uint256 _value) public virtual override returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        //Approval(msg.sender, _spender, _value);

        return true;
    }
    
}
