import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function CustomCamera({ getCamData, currentIndex, mirror, height, width }) {
  const [isInit, setInit] = useState(false);
  const [deviceId, setDeviceId] = useState(0);
  const [deviceList, setDeviceList] = useState([]);
  const [isMirror, setIsMirror] = useState(false);

  const setMirror = () => isMirror ? setIsMirror(false) : setIsMirror(true)

//   const getInx = useCallback((a) => setCamData(a), [setCamData]) 
  
  useEffect(() => {
        const updateVideo = async (newIndex) => {
            console.log('updateVideo')
            const video = document.getElementById('inputVideo');
            const videoV = document.getElementById('video-container');
            var constraints = {
            audio: false,
            video: {
                deviceId: { exact: newIndex },
                width: { min: 1024, ideal: videoV?.clientWidth, max: 1920 },
                height: { min: 576, ideal: videoV?.clientHeight, max: 1080 },
            }
            }
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            video.play();
            });
        }
      if (deviceId > -1 && isInit) {
          console.log('hh')
        updateVideo(deviceList[deviceId].deviceId)
        setIsMirror(false)
        getCamData({
            currentIndex: Number(deviceId),
            list: deviceList,
        })
      }
  }, [isInit, deviceId, deviceList, getCamData])

  useEffect(() => {
        console.log(currentIndex)
        setDeviceId(currentIndex)

  }, [isInit, currentIndex])
  useEffect(() => {
    // const setCamList = (val) => getCameraList(val)
    // console.log(mirror)
    const launchVideo = async () => {
      const video = document.getElementById('inputVideo');
      let videoV = document.getElementById('video-container');
      if (height && width) video.style.cssText = videoV.style.cssText = `height: ${height}px !important; width: ${width}px !important`
      navigator.getMedia = (navigator.getUserMedia);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const listDevicesX =  await navigator.mediaDevices.enumerateDevices();
        const listDevices = await listDevicesX.filter(ea => ea.kind === 'videoinput')
        setDeviceList(listDevices)
        // setCamList(listDevices)
        setDeviceId(listDevices.length-1)
        // currentCamId(listDevices.length-1)
        getCamData({
            currentIndex: listDevices.length-1,
            list: listDevices,
        })
        const constraints = {
          audio: false,
          video: {
              deviceId: { exact: listDevices[listDevices.length-1].deviceId },
              width: { min: 1024, ideal: videoV?.clientWidth, max: 1920 },
              height: { min: 576, ideal: videoV?.clientHeight, max: 1080 },
          }
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          video.srcObject = stream;
          video.play();
        });
      }
    }
    const updateVideo = async (newIndex) => {
            console.log('updateVideo')
            const video = document.getElementById('inputVideo');
            const videoV = document.getElementById('video-container');
            var constraints = {
            audio: false,
            video: {
                deviceId: { exact: newIndex },
                width: { min: 1024, ideal: videoV?.clientWidth, max: 1920 },
                height: { min: 576, ideal: videoV?.clientHeight, max: 1080 },
            }
            }
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            video.play();
            });
        }
    const init = async () => {
        console.log('intit')
        await launchVideo()
        setInit(true)
    }
    init()
  }, [setInit, getCamData, height, width])
  useEffect(() => setIsMirror(mirror), [mirror, setIsMirror])
  return (
    <div className='main-cam-div'>      
      <div id='video-container'>
        <video id="inputVideo" className={isMirror ? 'mirrored' : ''} autoPlay muted playsInline></video>
      </div>
      <div className='setting-cam-div'>
        <div>
          <select value={deviceId} onChange={(e) => setDeviceId(Number(e.target.value))}>
            {
              deviceList.map((ea_device,i) => (
                <option value={i} key={i}>{ea_device.label}</option>
              ))
            }
          </select>
        </div>
        <button onClick={() => setMirror()}>Mirror</button>
      </div>
    </div>
    
  );
}

export default CustomCamera;
