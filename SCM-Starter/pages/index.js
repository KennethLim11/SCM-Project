import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit1 = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const depositAmount = async() => {
    if (atm) {
      const amount = parseFloat(document.getElementById('deposit').value);
      if (!isNaN(amount) && amount > 0) {
        let tx = await atm.deposit(amount);
        await tx.wait();
        getBalance();
      } else {
        alert('Please enter a valid amount.');
      }
    }
  }

  const withdraw1 = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdrawAmount = async() => {
    if (atm) {
      const amount = parseFloat(document.getElementById('withdraw').value);
      if (!isNaN(amount) && amount > 0) {
        let tx = await atm.withdraw(amount);
        await tx.wait();
        getBalance();
      } else {
        alert('Please enter a valid amount.');
      }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={{backgroundColor: "#EDF2F4", color: "black"}}>
        <p style={{fontSize: "30px", margin: "2%"}}>Your Account: {account}</p>
        <p style={{fontSize: "35px", margin: "3%"}}>Your Balance: {balance}</p>
        <button style={{borderRadius: "10px", width: "9%", margin: "1%", padding: "10px", backgroundColor: "#5C6378", color: "white"}} onClick={deposit1}>Deposit 1 ETH</button>
        <button style={{borderRadius: "10px", width: "9%", margin: "1%", padding: "10px", backgroundColor: "#A0182A", color: "white"}} onClick={withdraw1}>Withdraw 1 ETH</button>
        
        <div>
          <label style={{fontSize: "20px"}}>Enter Quantity:</label>
          <input style={{margin: "1%"}} type="number" id="deposit"/>
          <button style={{borderRadius: "10px", width: "7%", padding: "5px", backgroundColor: "#5C6378", color: "white"}} onClick={depositAmount}>Deposit</button>
        </div>
        <div>
          <label style={{fontSize: "20px"}} for="quantity">Enter Quantity:</label>
          <input style={{margin: "1%"}} type="number" id="withdraw"/>
          <button style={{borderRadius: "10px", width: "7%", padding: "5px", backgroundColor: "#A0182A", color: "white"}} onClick={withdrawAmount}>Withdraw</button>
        </div>
        
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container" style={{backgroundColor: "#D80032", color: "black"}}>
      <header>
        <h1 style={{fontSize: "50px", textTransform: "uppercase"}}>Welcome to the Metacrafters ATM!</h1>
     
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
