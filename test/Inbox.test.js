const assert  = require('assert');
const ganache = require('ganache-cli');			// Test network object
const Web3    = require('web3'); 				// Require the Web3 code. Need to capitalize to signify it as an Object
const { interface, bytecode } = require('../compile'); // Require the compiled interface and bytecode from compile.js

const provider = ganache.provider();
const web3    = new Web3(provider); 	// Creates the web3 instance of the Web3 object using ganache

let accounts;
let inbox;

const initialString = 'Yo Yey!';

beforeEach(async () => {
	// Get all accounts in the network
	accounts = await web3.eth.getAccounts();
	inbox = await new web3.eth.Contract(JSON.parse(interface))
					.deploy({ data: bytecode, arguments: [initialString] })
					.send({ from: accounts[0], gas: '1000000' });

	inbox.setProvider(provider);
});

describe('Inbox', () => {
  	it('deploys a contract', () => {
  		assert.ok(inbox.options.address);
  	});

  	it('has a default message', async () => {
  		const message = await inbox.methods.message().call();
  		assert.equal(message, initialString)
  	});

  	it('can set a message', async () => {
  		const newMessage = 'New Message';
  		await inbox.methods.setMessage(newMessage).send({from: accounts[0], gas: '1000000'});
  		const message = await inbox.methods.message().call();
  		assert.equal(message, newMessage)
  	});
});