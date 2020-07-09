import React, { useRef, useState, useCallback } from 'react';
import './App.css';
import CustomCam from './CustomCam';

function App() {
  const [isMrror, setIsMirror] = useState(false)
  const [getImage, setImage] = useState(null)
  const [camData, setCamData] = useState({
    currentIndex: 0,
    list: [],
  });
  const getC = useCallback((a) => setCamData(a), [setCamData]) 
  const updateM = () => isMrror ? setIsMirror(false) : setIsMirror(true)

  const CustomCamRef = useRef();

  const handleCapture = () => {
    let t = CustomCamRef.current.getSnap('snap-div')
    setImage(t)
  }

  return (
    <div id='App'>
      <button onClick={() => handleCapture()}>Capture</button>
      <button onClick={() => updateM()}> Mirror : {isMrror.toString() }</button>
      <div>
          <select value={camData.currentIndex} onChange={(e) => setCamData({currentIndex: Number(e.target.value), list: camData.list})}>
            {
              camData.list.map((ea_device,i) => (
                <option value={i} key={i}>{ea_device.label}</option>
              ))
            }
          </select>
        </div>
      <CustomCam
        ref={CustomCamRef}
        getCamData={getC}
        currentIndex={camData.currentIndex}
        mirror={isMrror}
        width={1024}
        height={576}
      />
      <canvas className='snap-div' id='snap-div'/>
      <img className='img-div' src={getImage} alt=""/>
      
    </div>
    
  );
}

export default App;
