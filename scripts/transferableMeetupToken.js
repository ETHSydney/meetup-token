
var TransferableMeetupTokenBinary = "606060405260048054600160a060020a03191633600160a060020a0316179055341561002a57600080fd5b6040516107a13803806107a18339810160405280805190910190505b6001818051610059929160200190610061565b505b50610101565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a257805160ff19168380011785556100cf565b828001600101855582156100cf579182015b828111156100cf5782518255916020019190600101906100b4565b5b506100dc9291506100e0565b5090565b6100fe91905b808211156100dc57600081556001016100e6565b5090565b90565b610691806101106000396000f300606060405236156100a15763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b381146100a657806318160ddd146100ca5780631e9a6950146100ef57806323b872dd146101135780633ffa884c1461013d57806370a082311461016457806395d89b4114610195578063a9059cbb14610220578063dd62ed3e14610244578063ffa1ad741461027b575b600080fd5b34156100b157600080fd5b6100c8600160a060020a03600435166024356102a0565b005b34156100d557600080fd5b6100dd610305565b60405190815260200160405180910390f35b34156100fa57600080fd5b6100c8600160a060020a036004351660243561030c565b005b341561011e57600080fd5b6100c8600160a060020a03600435811690602435166044356103ac565b005b341561014857600080fd5b6100c8600435600160a060020a036024351660443561041d565b005b341561016f57600080fd5b6100dd600160a060020a036004351661049a565b60405190815260200160405180910390f35b34156101a057600080fd5b6101a86104b9565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101e55780820151818401525b6020016101cc565b50505050905090810190601f1680156102125780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561022b57600080fd5b6100c8600160a060020a0360043516602435610562565b005b341561024f57600080fd5b6100dd600160a060020a0360043581169060243516610572565b60405190815260200160405180910390f35b341561028657600080fd5b6100dd61059f565b60405190815260200160405180910390f35b600160a060020a03338116600081815260036020908152604080832094871680845294909152908190208490557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259084905190815260200160405180910390a35b5050565b6000545b90565b60045433600160a060020a0390811691161461032757600080fd5b600160a060020a0382166000908152600260205260409020548190101561034d57600080fd5b600080548290038155600160a060020a03831680825260026020526040808320805485900390557fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b5050565b600160a060020a03808416600090815260036020908152604080832033909416835292905220548111156103df57600080fd5b600160a060020a03808416600090815260036020908152604080832033909416835292905220805482900390556104178383836105c3565b5b505050565b60045433600160a060020a0390811691161461043857600080fd5b6000805482018155600160a060020a03831680825260026020526040918290208054840190559084907f3e1d8156c61243a0352920516bb9c7d0517fca750d6d6afebc0bed0d457a609b9084905190815260200160405180910390a35b505050565b600160a060020a0381166000908152600260205260409020545b919050565b6104c1610653565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105575780601f1061052c57610100808354040283529160200191610557565b820191906000526020600020905b81548152906001019060200180831161053a57829003601f168201915b505050505090505b90565b6103013383836105c3565b5b5050565b600160a060020a038083166000908152600360209081526040808320938516835292905220545b92915050565b7f455243323020302e342e362d6f307261676d616e306f0000000000000000000081565b600160a060020a0383166000908152600260205260409020548111156105e857600080fd5b600160a060020a038084166000818152600260205260408082208054869003905592851680825290839020805485019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b505050565b602060405190810160405260008152905600a165627a7a72305820ea888660af90885e491528b5ce6d5d5a5fde134d9f60c52530035d7845730beb0029";

var TransferableMeetupToken = eth.contract([{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_meetupId","type":"uint256"},{"name":"_addr","type":"address"},{"name":"_amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining_","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_symbol","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_meetupId","type":"uint256"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]);
var transferableMeetupToken = TransferableMeetupToken.at('0x00c55d37fc5a9af0b1e4f9d81f7834802f6c46fb');

var Account1 = {address: "0xd728cee2648a642fda9dc1218d2d5746848400ba", initAmount: null, password: "meetup", name: "Account1"};
var Account2 = {address: "0xf55583ff8461db9dfbbe90b5f3324f2a290c3356", initAmount: 0, password: "meetup", name: "Account2"};
var accounts = [Account1, Account2];

var accountPassword = 'meetup';

function createTransferableMeetupToken() {
  web3.eth.defaultAccount = Account1.address;

  var symbol = "TransSydEth";

  var transferableMeetupToken = TransferableMeetupToken.new(symbol, {from:web3.eth.accounts[0], data: TransferableMeetupTokenBinary, gas: 300000}, function(e, result) {
      if (e || !result) {
        console.log(symbol + ", error creating new contract, " + e);
      } else {
        if (result && !result.address) {
          console.log(symbol + ", transaction hash from creating new contract, " + result.transactionHash);

          // wait half a second
          setTimeout(function() {
            var transaction = eth.getTransactionReceipt(result.transactionHash);
            console.log(symbol + ', contract address,' + transaction.contractAddress);
            callback(null, transaction.contractAddress);
          }, 20000);
        } else {
          console.log(symbol + ", contract address, " + result.address);
          callback(null, result.address);
        }
      }
  });
}

//Error encoding arguments: TypeError: First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.

function displayProperties() {
    console.log('TransferableMeetupToken at address ' + transferableMeetupToken.address + ' has symbol ' + transferableMeetupToken.totalSupply() + ' and total supply ' + transferableMeetupToken.symbol())
}

function displayBalances() {
  // for each account
  accounts.forEach(function(account) {
    // print the account name, AgriCoin balance and eth balance
    console.log(account.name + 
      "\t" + account.address +
      "\TransferableMeetupToken: " + transferableMeetupToken.balanceOf(account.address) + 
      "\teth: " + web3.fromWei(eth.getBalance(account.address), "ether"));
  });
}

function issue(meetupId, toAddress, amount) {
    web3.eth.defaultAccount = Account1.address;
    transferableMeetupToken.issue(meetupId, toAddress, amount);
}
// issue(4321, Account1.address, 3);
// issue(1234, Account2.address, 10);

function unlockAllAccounts() {
    eth.accounts.forEach(function(address) {
        personal.unlockAccount(address, accountPassword, 0);
    });
}

function transferEthToAll() {
  eth.accounts.forEach(function(account, i) {
    eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[i], value: web3.toWei(10, "ether")})
  })
}

//eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[3], value: web3.toWei(100, "ether")})