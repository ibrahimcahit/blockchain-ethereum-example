const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile'); 

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of these accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) // Method of contract
        .deploy({ data: bytecode, arguments: ['Hi there!'] })  // Tell web3 that we want to deploy a new contract
        .send({ from: accounts[0], gas: '1000000' });          // Transaction and Gas fee
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
    
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, 'Hi there!');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, 'bye');
    });
});