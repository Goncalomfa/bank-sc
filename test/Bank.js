const assert = require('assert');
const Web3 = require("web3");
const ganache = require("ganache-cli");
const web3 = new Web3(ganache.provider());
const Bank = require("../bin/contracts/Bank");
const XYZToken = require("../bin/contracts/XYZToken");

let accounts;
let bank;
let token;
let tokenAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    bank = await new web3.eth.Contract(Bank.abi)
        .deploy({ data: Bank.bytecode, arguments:[1, 'minutes', 3500] })
        .send({ from: accounts[0], gas: "5000000" });

    tokenAddress = await bank.methods.token().call();
    token = await new web3.eth.Contract(
        XYZToken.abi,
        tokenAddress
    );
});

describe('Bank and Tokens Setup', () => {

    it('Deploy the bank and tokens', async () => {
        const addressBank = bank.options.address;
        const addressToken = token.options.address;
        assert.ok(addressBank);
        assert.ok(addressToken);
        assert.notEqual(addressBank,addressToken);
    });

    it('Has a name', async () => {
        const name = await token.methods._name().call();
        assert.equal(name,'XYZToken');
    });

    it('Has a symbol', async () => {
        const symbol = await token.methods._symbol().call();
        assert.equal(symbol,'XYZ');
    });
});
describe('Transactions of XYZTokens', () => {

    it('Users First Deposit of XYZ', async () => {
        await bank.methods.deposit(10).send({
            value: 100,
            from: accounts[1],
            gas: "1000000"
        });
        const user = await bank.methods.activeUsers().call();
        assert.equal(user, 1);
    });

    it('Users Second Deposit of XYZ', async () => {
        await bank.methods.deposit(10).send({
            value: 100,
            from: accounts[1],
            gas: "1000000"
        });
        await bank.methods.deposit(10).send({
            value: 100,
            from: accounts[1],
            gas: "1000000"
        });
        const user = await bank.methods.activeUsers().call();
        assert.equal(user, 1);
    });

    it('Deposit of XYZ failing for insuficient wei spent', async () => {
        try {
            await bank.methods.deposit(100).send({
                value: 10,
                from: accounts[1],
                gas: "1000000"
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Wrong period to withdraw', async () => {
        try {
            await bank.methods.deposit(10).send({
                value: 100,
                from: accounts[1],
                gas: "1000000"
            });
            await bank.methods.withdraw().send({
                from: accounts[0],
                gas: "1000000"
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Only owner can withdraw the tokens to the bank', async () => {
        try {
            await bank.methods.bankWithdraw().send({
                from: accounts[5],
                gas: "1000000"
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('The bank cannot withdraw when there are active users', async () => {
        try {
            await bank.methods.deposit(10).send({
                value: 100,
                from: accounts[1],
                gas: "1000000"
            });
            await bank.methods.bankWithdraw().send({
                from: accounts[0],
                gas: "1000000"
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

});