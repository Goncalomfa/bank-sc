# bank-sc
> This is my proposal to the realization of the task Bank Smart Contract!

I completed, not only the smart contract according to the specifications, but also a test suite and some bonus points.

The bonus points I completed were: reusing smart contracts - IERC20, Ownable and SafeMath -, deploying on Ethereum Rinkeby testnet and providing a graphical interface for the contract (with React).


# How to run the Smart Contract


- To run the project without the front-end part, I ran it with Remix and tested it with Ganache too. I coded with vscode so I already had the plugins it was really handy.

- To run everything, first of all, you need to deploy the bank's smart contract using the file inside "ethereum" the file "deploy.js". Here you can say the arguments that you want (control the time period T, say the unit - minutes, hours or default days which you didn't say on the task, and define what is the reward pool).

- You'll want to run on cmd "node deploy.js".

- After it is complete, you need to take the address of the contract and substitute the address that I have written on "ethereum/instances/bank.js". Finally, you can just "npm run dev" on cmd and open "http://localhost:3000/" on the browser.

- I hope you have some ether to test it, but I don't mind showing the system working for you.


One thing about the tests, I don't know how to control time inside them, so I couldn't do the full coverage of the withdraw function I had to test this part myself.


> Just want to say this was really fun and hope to hear from you soon enough!!!
