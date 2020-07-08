import React, { useState, useEffect, useCallback } from 'react';
// import './App.css';
import CustomCamera from './CustomCam';

function App() {
  const [isMrror, setIsMirror] = useState(false)
  const [camData, setCamData] = useState({
    currentIndex: 0,
    list: [],
  });
  const getC = useCallback((a) => setCamData(a), [setCamData]) 
  const updateM = () => isMrror ? setIsMirror(false) : setIsMirror(true)

  const handleChangeCam = (val) => {
    let ax = camData
    ax.currentIndex = Number(val)
    console.log(ax)
    setCamData(ax)
  }

  useEffect(()=> {
    if (camData.list.length !== 0) console.log(camData)
  }, [camData])
  return (
    <div id='App'>
      <button onClick={() => updateM()}> Mirror : {isMrror.toString() }</button>
      <div>
          {/* <select value={camData.currentIndex} onChange={(e) => handleChangeCam(e.target.value)}> */}
          <select value={camData.currentIndex} onChange={(e) => setCamData({currentIndex: Number(e.target.value), list: camData.list})}>
            {
              camData.list.map((ea_device,i) => (
                <option value={i} key={i}>{ea_device.label}</option>
              ))
            }
          </select>
        </div>
      <CustomCamera
        getCamData={getC}
        currentIndex={camData.currentIndex}
        mirror={isMrror}
        width={1280}
        height={720}
        // onChangeCamer(e)=> console.log(e)a={}
      />
    </div>
    
  );
}

export default App;
