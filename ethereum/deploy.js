const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const Bank = require("../bin/contracts/Bank");

const provider = new HDWalletProvider(
  'arrive drama armed universe claim apart undo afraid network hawk urban secret',
  'https://rinkeby.infura.io/v3/4b74aa0f5f684896af3bac08981ab69d'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(Bank.abi)
    .deploy({ data: Bank.bytecode, arguments:[5, 'minutes', 3500] })
    .send({ from: accounts[0], gas: '3000000' });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
