var Bank = artifacts.require("Bank");
var XYZToken = artifacts.require("XYZToken");
var Arg = "5, minutes,100";
module.exports = deployer => {
    deployer.deploy(Bank, Arg);
};