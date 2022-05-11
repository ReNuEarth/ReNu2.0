

import React from 'react';
import './App.css';
import type {Node} from 'react';
import { ethers } from 'ethers';
import Logo from './img/logo.png';
import Renu from './img/renu.png';
import AboutBg from './img/about-bg.png';
import AboutImg from './img/about-img.png';
import VideoBg from './img/video-bg.png';
import Srec from './img/srec.png';
import ScrollDown from './img/scroll-down.png';
import Wrec from './img/wrec.png';
import ChartBg from './img/chart-bg.png';
import SubscribeBg from './img/subscribe-bg.png';
import DocsBg from './img/docs-bg.png';

import Coin_RREC from './artifacts/contracts/Coin_RREC.sol/Coin_RREC.json';
import Coin_USDT from './artifacts/contracts/Coin_USDT.sol/Coin_USDT.json';
const Coin_RREC_Address = '0xe49b55Ea3B94Bb63D080f12C02aa22ABa4BF5b35';
const Coin_USDT_Address = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
function shortenName(text){
        if (text.length < 9){
                return text;
        }    
        return text.substr(0, 2) + '...' + text.substr(text.length - 4);
}

function cryptoAdmin(instance, item, name, onSuccess, onFail, ...args) {
  const provider = new ethers.providers.Web3Provider(instance)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(item.add, item.json.abi, signer)
  try {
    contract[name](...args).then(value=>{
      onSuccess(value);
    }).catch(err=>{
      onFail(err.message);
    });
  } catch (err) {
    onFail(err.message)
  }
}


function makeADecimalTextIntoLongText(decimalText, digits){
    var locOfDot = decimalText.indexOf('.');
    if (locOfDot === -1){
        return decimalText + makeDigits(digits);
    }else{
        var before = decimalText.substr(0, locOfDot);
        var after = decimalText.substr(locOfDot + 1);
        if (after.length > digits){
            return before + after.substr(0, digits);      
        }else{
            return before + after + makeDigits(digits - after.length);
        }
    }
}

function makeDigits(digits){
    var x = '';
    for (var i = 0; i < digits; i++){
        x += '0';
    }
    return x;
}

function isDecimalText(thisVal){
  if (thisVal){
    var regex3 = /^([0-9]+\.?[0-9]*|\.[0-9]+)$/
    return thisVal.match(regex3);    
  }
  return false;
}

const App = (): Node => {


  const [usdtValue, setUsdtValue] = React.useState('0');
  const [rrecValue, setRRecValue] = React.useState('0');
  const [instance, setInstance] = React.useState(false);
  const [account, setAccount] = React.useState(false);
  const [chainId, setChainId] = React.useState(ethers.BigNumber.from('0'));
  const [messages, setMessages] = React.useState({});
  function clickActionc2_aa118475_j(e){
    connectWallet(); 
  }

  function changeUsdt(e){
    setUsdtValue(e.target.value);
    if (isDecimalText(e.target.value)){
      var p = +e.target.value/4.93;
      setRRecValue(p.toFixed(3).toString());
    }
  }
  function changeRrec(e){
    setRRecValue(e.target.value);
    if (isDecimalText(e.target.value)){
      var p = +e.target.value*4.93;
      setUsdtValue(p.toFixed(3).toString());
    }
  }

  function clickActionc2_5d8a8341_j(e){

    var valueX = rrecValue;
    if (!isDecimalText(rrecValue)){
      window.alert("Need a decimal value for RREC amount");
      return;
    }else if (+rrecValue <= 0){
      window.alert("Need a value bigger than 0");
      return;
    }
    messages['c2_5d8a8341'] = <div>Connecting to your wallet. Your wallet should pop up soon...</div>; setMessages({...messages}); 

    cryptoAdmin(instance, {add:Coin_USDT_Address, json:Coin_USDT}, 'approve', function(value){
      messages['c2_5d8a8341'] = <div>Approving withdrawal of USDC...</div>; setMessages({...messages}); 
      const provider = new ethers.providers.Web3Provider(instance);

      var approvePiece = new ethers.Contract(Coin_USDT_Address, Coin_USDT.abi, provider.getSigner());
      var approveFilter = approvePiece.filters.Approval(account, Coin_RREC_Address);

      approvePiece.once(approveFilter, (from, to, amount)=>{ 
        var x = ethers.BigNumber.from('493').mul(ethers.BigNumber.from( makeADecimalTextIntoLongText(valueX, ethers.BigNumber.from('18').toNumber()) )).div(ethers.BigNumber.from('100000000000000')).toString();
        if (from === account && to === Coin_RREC_Address && amount.toString() === x){
        messages['c2_5d8a8341'] =  <div>Seeking your approval to Mint</div>; setMessages({...messages}); 
        cryptoAdmin(instance, {add:Coin_RREC_Address, json:Coin_RREC}, 'mint', function(value){
          messages['c2_5d8a8341'] = <div>Minting...</div>; setMessages({...messages}); 
          const provider = new ethers.providers.Web3Provider(instance);
          var transferPiece = new ethers.Contract(Coin_RREC_Address, Coin_RREC.abi, provider.getSigner());
          var transferFilter = transferPiece.filters.Transfer('0x0000000000000000000000000000000000000000', account);

          transferPiece.once(transferFilter, (from, to, amount)=>{ if (from === '0x0000000000000000000000000000000000000000' && to === account && amount.toString() === ethers.BigNumber.from( makeADecimalTextIntoLongText(valueX, ethers.BigNumber.from('18').toNumber()) ).toString()){
            messages['c2_5d8a8341'] = null; setMessages({...messages}); 
            window.alert('Minted');
          }});
        }, function(e0){
          window.alert(e0);
          messages['c2_5d8a8341'] = null; setMessages({...messages}); 
        }, ethers.BigNumber.from( makeADecimalTextIntoLongText(valueX, ethers.BigNumber.from('18').toNumber()) ), {value:ethers.BigNumber.from('0').mul(ethers.BigNumber.from( makeADecimalTextIntoLongText(valueX, ethers.BigNumber.from('18').toNumber()) )).div(ethers.BigNumber.from('1000000000000000000'))});
      }});
    }, function(e0){
      window.alert(e0);
      messages['c2_5d8a8341'] = null; setMessages({...messages}); 
    }, Coin_RREC_Address,ethers.BigNumber.from('493').mul(ethers.BigNumber.from( makeADecimalTextIntoLongText(valueX, ethers.BigNumber.from('18').toNumber()) )).div(ethers.BigNumber.from('100000000000000'))); 
  }


  async function connectWallet(){
    if (account){
      return;
    }

    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const Fortmatic = window.Fortmatic;

    const providerOptions = {
      walletconnect: { 
        package: WalletConnectProvider,
        options: { infuraId: '8043bb2cf99347b1bfadfb233c5325c0'}
      },
      fortmatic: {
        package: Fortmatic,
        options: {key: 'pk_test_391E26A3B43A3350'}
      }
    };

    const web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
    });
    web3Modal.clearCachedProvider();

    const d = new Date();
    let time = d.getTime();

    try {
      const instance = await web3Modal.connect(); 
      setInstance(instance);

      // Subscribe to accounts change
      instance.on('accountsChanged', (accounts) => {
        if (accounts.length > 0){
          setAccount(accounts[0]); document.account = accounts[0]; 
        }else{
          setAccount(false); document.account = false; setInstance(false); 
        }
      });

      instance.on('chainChanged', (chainId) => {
        setChainId(chainId); 
      });
      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()
      signer.getAddress().then(function(account){
        window.alert('Connected! Click the same button to mint');
        setAccount(account);
        document.account = account;
        provider.getNetwork().then(function(network){
          setChainId(ethers.BigNumber.from(network.chainId));
        })
      }).catch((err)=>{
        console.log(err);
      });



    } catch(e) {
      const d1 = new Date();
      let time1 = d1.getTime();
      if (time1 - time < 100){
        if (e.message === 'User Rejected'){
          window.alert('It seems you had been previously asked to connect to a site via metamask but the query was not completed. Please open up Metamask (by clicking on the top right icon) and click Connect in the pop-up. If that fails, please refresh this page.')
        }
      }
      return;
    }
  }

  var actionText;
  var clickAction = function(e){
  }
  console.log(account);
  // <DecimalInputRecall key={0} defaultValue={2} styleFn={function(value){return {placeholder:'Placeholder Text', editable:true}}} gVs={[]} setInputValues={setInputValues} inputValues={inputValues} idNos={'c2_0f401dd1'}/>
  if (!account){
    actionText = 'Connect Wallet';
    clickAction = clickActionc2_aa118475_j;
  }else if (!ethers.BigNumber.from(137).eq(chainId)){
    actionText = 'Please connect to the Polygon Mainnet';
    clickAction = function(e){
      window.alert("Please open your wallet to change the network");
    }
  }else{
    actionText = <div>Mint Coin{messages['c2_5d8a8341']}</div>
    clickAction = clickActionc2_5d8a8341_j
  }

  return <div className="wrapper">

    <header className="header">
      <a href="#" className="logo">
        <div className="logo__img"><img src={Logo}/></div>
      </a>
    </header>

    <div className="fixed-menu">
      <div className="fixed-menu__header">
        <a href="#" className="logo">
          <div className="logo__img"><img src={Logo}/></div>
        </a>

      </div>

      <div className="fixed-menu__content">

        <div className="">
          <a href="#" className="btn btn--big btn--blue mt-7">Connect Wallet</a>
        </div>


      </div>
    </div>

    <section className="promo">

      <div className="container">
        <div className="row">
          <div className="col-12 promo__content" >
            <h1><img src={Renu} className="renu"/></h1>

            <p className="bannertext">
              Powering Web3 with <u>Renewable Energy</u></p>
            

            <div className="row justify-content-center mt-31" style={{zIndex: 99999999999}}>
              <div className="col-lg-5" style={{padding:'10px'}}>
                         <div className="downloadeth" >
              
                <div className="row usdbg"  style={{margin:'10px'}}>
                 <div className="col-lg-4 col-4 mt-7" >
                   <h6>From</h6>USDC
                 </div>
                 <div className="col-lg-8 col-8 mt-7">
                   <input type="text" className="input" placeholder="0" value={usdtValue} onChange={changeUsdt}/>
              </div>
               </div>

               <div className="row usdbg"  style={{margin:'10px'}}>
              <div className="col-lg-4 col-4 mt-7">
                <h6>To</h6>RREC
              </div>
              <div className="col-lg-8 col-8 mt-7">
                <input type="text" className="input" placeholder="~ 0" value={rrecValue} onChange={changeRrec}/>
             </div>
            </div>

            
            <div className="row usdbg"  style={{margin:'10px'}}>
              <div className="col-lg-4 col-4 mt-7 ">
                <h6>Rate</h6>
              </div>
              <div className="col-lg-8 col-8 mt-7">
                <h5 className="">$4.93 USDC per RREC</h5>
             </div>
             
            </div>
            <div className="">
              <button className="swap" onClick={clickAction}>{actionText}</button> 
            </div>
             </div>
            </div>
          </div>
          </div>
        </div>

      </div>
      <img src={AboutBg} data-jarallax-element="40" alt="" className="about__bg" style={{zIndex: -1}}/>
    </section>



    <section className="section about" id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div
              className="section-header section-header--animated section-header--tire section-header--small-margin">
              <h2>A renewable <span>energy certificate</span>
              </h2>
            </div>
            <div className="about__animated-content">
              <p>
                REC (pronounced: rěk) is a tradable, market-based
                instrument that represents the legal property rights to the “renewable-ness” — or
                non-power (i.e., environmental) attributes — of renewable electricity generation. A REC
                is created for every megawatt hour (MWh) of electricity generated and delivered to the
                grid from a renewable energy resource. Electricity cannot be considered renewable
                without a REC to substantiate its renewable-ness. <br/><br/>—<strong> United States Environmental Protection Agency
                </strong></p>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1 align-items-center">
            <img src={AboutImg} className="about__img img-responsive" alt=""/>
          </div>
        </div>
      </div>
    
    </section>


    <section className="economy">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 ">
            

            <div className="section-header section-header--animated section-header--center section-header--medium-margin">
              <h4>How ReNu Works</h4>
              <h2>How ReNu Works</h2>
            </div>
            <p><span className="numbers">1.</span>
              Our RREC tokens are backed by the highest quality solar and wind projects in North America (2018 vintage and newer RECs). 
        Purchase the amount of RECs you need above with USDC.


            </p>
            <p><span className="numbers">2.</span> We immediately buy and retire high quality RECs in traditional, off-chain markets,
              ensuring that each token is 1 to 1 backed by a corresponding, high quality REC
              from a North American solar or wind project.
            </p>
            <p><span className="numbers">3.</span>
              A 3rd party auditor does weekly verification, ensuring that the amount of RREC tokens is exactly the same amount of wind RECs and solar RECs retired
              in our registry accounts.
            </p>
            <p><span className="numbers">4.</span>
              When you’re ready to retire your RECs, follow the steps in our docs to burn your
              REC tokens and guarantee that the electricity you have consumed is from
              renewable sources. 
              </p>
            

          
          </div>
          
        </div>
      </div>
      <img src={VideoBg} alt="" className="economy__bg"/>
    </section>






    <section className="section token" id="token">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="section-header section-header--animated section-header--center section-header--medium-margin">
              <h4>TOKENS FROM 2 RENEWABLE SOURCES
              </h4>
              <h2>TOKENS FROM 2 RENEWABLE SOURCES

              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 aos-init aos-animate">
            <div className="text-center">
            <img src={Srec} className="about__img img-responsive" alt="" style={{maxHeight:"250px", display:"inline-block"}}/>
          </div>
            <div className="token__desc">
              <div className="token__desc-title">SOLAR
              </div>
              <div className="token__desc-text">
                <p>Curated solar renewable energy certificates from the best projects in North America (2018+ RECs)</p>
              
              </div>
            </div>
          </div>
          <div className="col-lg-6 align-items-center">
            <div className="text-center">
            <img src={Wrec} className="about__img img-responsive" alt="" style={{maxHeight:"250px", display:"inline-block"}}/>
          </div>
        
            <div className="token__desc">
              <div className="token__desc-title">WIND
              </div>
              <div className="token__desc-text">
                <p>Curated wind renewable energy certificates from the best projects in North America (2018+ RECs) </p>
              
            
            </div>
          </div>
          </div>
        </div>

          
        </div>
        <img src={VideoBg} alt="" className="economy__bg"/>
    </section>

    <section className="data token-data section section--no-pad-bot" style={{display:"none"}}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div
              className="section-header section-header--animated section-header--medium-margin section-header--center">
              <h4>Our data</h4>
              <h2>WHERE DOES THE MONEY GO?
              </h2>

            </div>
          </div>
        </div>
        <div className="row chart__row align-items-center">
          <div className="col-lg-6">
            <div className="chart">
              <img className="chart__bg" src={ChartBg} alt=""/>
              <div className="chart__wrap">
                <canvas id="myChart" width="400" height="400"></canvas>
                <div className="upimg">
                </div>
              </div>


            </div>
          </div>
          <div className="col-lg-6 token-data__animated-content">

            <p>When recs are purchased, money goes directly to
              Emissions free projects. Power producers are
              Connected to the grid, so its impossible to tell by
              Which means your electricity is generated. Emissions
              Free projects are awarded recs by sanctioned
              Registries. They can sell these as an extra income
              Stream for the project, allowing the buyer to own
              The rights to the energy produced by that project,
              And promote further renewable investment</p>
          </div>
        </div>
      </div>
      <img src={DocsBg} data-jarallax-element="40" alt="" className="docs__bg"/>

    </section>



    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <a href="#" className="logo">
              <img className="logo__img logo__img--big" src={Logo} alt=""/>

            </a>
            <div className="copyright">© 2022, ReNu.Earth </div>
          </div>
          <div className="col-lg-3">
            <div className="social-block">
              <div className="social-block__title">
                About
              </div>

              <ul className="social-list">
                <li className="social-list__item">

                  <a href="https://renuearth.medium.com/" className="social-list__link">
                    <i className=" fontello-icon fab fa-medium">
                     Medium
                    </i>
                  </a>
                </li>
                <li className="social-list__item">
                  <a href="" className="social-list__link">
                    <i className=" fontello-icon fab fa-discord">
                     Discord       
                    </i>
                  </a>
                </li>
                <li className="social-list__item">
                  <a href="#" className="social-list__link">
                    <i className=" fontello-icon fas fa-book">
                     GitBook       
                    </i>
                  </a>
                </li>
                <li className="social-list__item">
                  <a href="https://twitter.com/renu_earth" className="social-list__link">
                    <i className=" fontello-icon fab fa-twitter">
                     Twitter        
                    </i>
                  </a>
                </li>
                <li className="social-list__item">
                  <a href="#" className="social-list__link">
                    <i className=" fontello-icon fab fa-linkedin">
                     LinkedIn        
                    </i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>

  </div>


}

    // <section className="section contact">
    //   <div className="container">
    //     <div className="row">
    //       <div className="col">
    //         <div className="section-header section-header--center section-header--medium-margin">
    //           <h4>Contact us</h4>
    //           <h2>Get in Touch</h2>
    //         </div>
    //         <form action="#" className="form contact-form" id="contact-form">
    //           <input type="text" name="Name" className="form__input" placeholder="Name"/>
    //           <input type="email" name="Email" className="form__input" placeholder="Email"/>
    //           <input type="text" name="Email" className="form__input" placeholder="Subject"/>
    //           <textarea name="Message" className="form__textarea" placeholder="Message"></textarea>
    //           <button className="form__btn btn btn--uppercase btn--orange"><span>send</span></button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    //   <img src={SubscribeBg} className="contact-bg" alt=""/>
    // </section>

export default App;
