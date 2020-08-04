import React, { useRef, useState, useCallback, useEffect } from 'react';
import './App.css';
import CustomCam from './CustomCam';

function App() {
  const [isActive, setIsActive] = useState(null)
  const [infoA, setInfoA] = useState({
    os: '',
    browser: ''
  })
  // const [getImage, setImage] = useState(null)
  const [camData, setCamData] = useState({
    currentIndex: 0,
    list: [],
  });
  const getCamData = useCallback((a) => {setCamData(a); console.log(a)}, [setCamData]) 
  const CustomCamRef = useRef();

  const toggleActive = () => {
    CustomCamRef.current.toggleCamActive()
    setIsActive(!isActive)
  }

  const switchCam = (val) => {
    CustomCamRef.current.switchCam(val)
    setCamData({currentIndex: val, list: camData.list})
  }

  // const handleCaptureImg = () => {
  //   let result = CustomCamRef.current.getSnap()
  //   console.log(result)
  //   setImage(result.base64)
  //   const canvas = document.getElementById("canvas-div");
  //   const ctx = canvas.getContext("2d");
  //   const image = new Image();
  //   image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  //   image.src = result.base64
  // }
  const handleCaptureCanvas = () => {
    let result = CustomCamRef.current.getCanvas("canvas-div")
    console.log(result)
  }

  useEffect(()=> {
    console.log(navigator)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth/100}px`);
    var browser = (() => {
      var test = function(regexp) {return regexp.test(window.navigator.userAgent)}
      switch (true) {
        case test(/edg/i): return "Microsoft Edge";
        case test(/trident/i): return "Microsoft Internet Explorer";
        case test(/firefox|fxios/i): return "Mozilla Firefox";
        case test(/opr\//i): return "Opera";
        case test(/ucbrowser/i): return "UC Browser";
        case test(/samsungbrowser/i): return "Samsung Browser";
        case test(/chrome|crios/i): return "Chrome";
        case test(/safari/i): return "Safari";
        default: return "Other";
      }
    })();
    infoA.os = navigator.platform
    infoA.browser = browser
    setInfoA(infoA)
    // if (infoA.os === 'iPhone' && infoA.browser === 'Chrome')
    // eslint-disable-next-line
  } ,[])
  
  const getInfoClient = (type) => {
    if (type === 'platform') {
      return navigator.platform
    } else if (type === 'browser') {
      return (() => {
        let test = function(regexp) {return regexp.test(window.navigator.userAgent)}
        switch (true) {
          case test(/edg/i): return "Microsoft Edge";
          case test(/trident/i): return "Microsoft Internet Explorer";
          case test(/firefox|fxios/i): return "Mozilla Firefox";
          case test(/opr\//i): return "Opera";
          case test(/ucbrowser/i): return "UC Browser";
          case test(/samsungbrowser/i): return "Samsung Browser";
          case test(/chrome|crios/i): return "Chrome";
          case test(/safari/i): return "Safari";
          default: return "Other";
        }
      })();
    }
  }

  const Camera = () => (
    <CustomCam
      ref={CustomCamRef}
      getCamData={getCamData}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )



  const NotCamera = () => (<div className='na-div'>
    <div>your browser is not available</div>
    <div> please try again </div>
    <div>for Mac and Windows, use Chrome only</div>
    <div>for iPhone, iPad, use Safari only</div>
    <div>for Android, use Chrome only</div>
  </div>)

  const checkAvailable = (info) => {
    if ((getInfoClient('platform') === 'iPhone' || getInfoClient('platform') === 'iPad')  && getInfoClient('browser') === 'Chrome') return false
    else return true
  }

  return (
    <div id='App'>
      <div className='options-div'>
        <button onClick={() => toggleActive()}>{ isActive ? 'Play' : 'Pause' }</button>
        <button onClick={() => handleCaptureCanvas()} disabled={isActive}>Capture</button>
        <button onClick={() => CustomCamRef.current.toggleMirror()}> Mirror </button>
        <select value={camData.currentIndex} onChange={(e) => switchCam(Number(e.target.value))}>
            {
              camData.list.map((ea_device, i) => (
                <option value={i} key={i}>{ea_device.label}</option>
              ))
            }
          </select>
      </div>
      <div className='info-div'>
        <div>OS : {getInfoClient('OS')}</div>
        <div>Browser : {getInfoClient('browser')}</div>
      </div>
      <div>
          {/* <select value={camData.currentIndex} onChange={(e) => setCamData({currentIndex: Number(e.target.value), list: camData.list})}> */}         
        </div>
        {checkAvailable() ? Camera() : NotCamera()}      
      <canvas className='canvas-div' id='canvas-div'/>
      {/* <img className='img-div' src={getImage} alt=""/> */}
    </div>
    
  );
}

export default App;
