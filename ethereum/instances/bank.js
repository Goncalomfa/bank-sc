import web3 from './web3';
import Bank from '../../bin/contracts/Bank';

const bankInstance = new web3.eth.Contract(
    Bank.abi,
    '0x2C7F8E0CF36F1A3736Db07032a472748Fa139020'
  );
  
  export default bankInstance;