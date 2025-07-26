
const tokenAddress = "0x55d398326f99059fF775485246999027B3197955";
const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

let provider, signer, tokenContract;

async function connect() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    document.getElementById("wallet").innerText = "Connected: " + (await signer.getAddress());
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    updateBalance();
  } else {
    alert("Please install MetaMask!");
  }
}

async function updateBalance() {
  const address = await signer.getAddress();
  const rawBal = await tokenContract.balanceOf(address);
  document.getElementById("balance").innerText = rawBal.toString();
}

async function sendToken() {
  const to = document.getElementById("to").value;
  const amount = parseInt(document.getElementById("amount").value);
  try {
    const tx = await tokenContract.transfer(to, amount);
    await tx.wait();
    document.getElementById("status").innerText = "✅ Sent successfully!";
    updateBalance();
  } catch (err) {
    document.getElementById("status").innerText = "❌ Error: " + err.message;
  }
}
