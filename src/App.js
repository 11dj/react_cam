import React, { useRef, useState, useCallback } from 'react';
import './App.css';
import CustomCam from './CustomCam';

function App() {
  const [isMrror, setIsMirror] = useState(false)
  const [isActive, setIsActive] = useState(null)
  const [getImage, setImage] = useState(null)
  const [camData, setCamData] = useState({
    currentIndex: 0,
    list: [],
  });
  const getCamData = useCallback((a) => {setCamData(a); console.log(a)}, [setCamData]) 
  const updateM = () => isMrror ? setIsMirror(false) : setIsMirror(true)
  const CustomCamRef = useRef();

  const toggleActive = () => {
    CustomCamRef.current.toggleCamActive()
    setIsActive(!isActive)
  }

  const switchCam = (val) => {
    CustomCamRef.current.switchCam(val)
    setCamData({currentIndex: val, list: camData.list})
  }

  const handleCapture = () => {
    let result = CustomCamRef.current.getSnap()
    console.log(result)
    setImage(result.base64)
    const canvas = document.getElementById("canvas-div");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = result.base64
  }
  const handleCapture2 = () => {
    let result = CustomCamRef.current.getCanvas("canvas-div")
    console.log(result)
  }

  return (
    <div id='App'>
      <button onClick={() => toggleActive()}>{ isActive ? 'Play' : 'Pause' }</button>
      <button onClick={() => handleCapture2()} disabled={isActive}>Capture</button>
      <button onClick={() => updateM()}> Mirror : {isMrror.toString() }</button>
      <div>
          {/* <select value={camData.currentIndex} onChange={(e) => setCamData({currentIndex: Number(e.target.value), list: camData.list})}> */}
          <select value={camData.currentIndex} onChange={(e) => switchCam(Number(e.target.value))}>
            {
              camData.list.map((ea_device, i) => (
                <option value={i} key={i}>{ea_device.label}</option>
              ))
            }
          </select>
        </div>
      <CustomCam
        ref={CustomCamRef}
        getCamData={getCamData}
        // currentIndex={camData.currentIndex}
        // mirror={isMrror}
        width={1024}
        height={576}
      />
      <img className='img-div' src={getImage} alt=""/>
      <canvas className='canvas-div' id='canvas-div'/>
      
    </div>
    
  );
}

export default App;
