import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CustomCamera = forwardRef(
  ({ getCamData, currentIndex, mirror, height, width }, ref) => {
    const [isInit, setInit] = useState(false);
    const [deviceId, setDeviceId] = useState(0);
    const [deviceList, setDeviceList] = useState([]);
    const [isMirror, setIsMirror] = useState(false);

    useImperativeHandle(ref, () => ({
      getSnap(canvasId) {
        let videoEl = document.getElementById('inputVideo')
        if (videoEl.paused || videoEl.ended) return null
        let canvas = document.getElementById(canvasId)
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        let ctx = canvas.getContext('2d')
        if (isMirror) {    
          ctx.translate(videoEl.videoWidth, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
        return image
      }
    }));


    useEffect(() => {
      const updateVideo = async (newIndex) => {
        const video = document.getElementById('inputVideo');
        const videoV = document.getElementById('custom-cam-video-container');
        const constraints = {
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
      if (currentIndex !== deviceId && isInit) {
        updateVideo(deviceList[currentIndex].deviceId)
        setDeviceId(currentIndex)
      } 
        
    }, [isInit, currentIndex, deviceId, deviceList])
    useEffect(() => {
      const launchVideo = async () => {
        const video = document.getElementById('inputVideo');
        let videoV = document.getElementById('custom-cam-video-container');
        if (height && width) video.style.cssText = videoV.style.cssText = `height: ${height}px !important; width: ${width}px !important`
        navigator.getMedia = (navigator.getUserMedia);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const listDevicesX =  await navigator.mediaDevices.enumerateDevices();
          const listDevices = await listDevicesX.filter(ea => ea.kind === 'videoinput')
          setDeviceList(listDevices)
          setDeviceId(listDevices.length-1)
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
      const init = async () => {
        await launchVideo()
        setInit(true)
      }
      init()
    }, [setInit, getCamData, height, width])
    useEffect(() => setIsMirror(mirror), [mirror, setIsMirror])
    return (
      <div className='main-cam-div' style={{ position: 'relative', height: '100%', width: '100%' }}>      
        <div id='custom-cam-video-container'>
          <video id="inputVideo" className={isMirror ? 'custom-cam-mirrored' : ''} autoPlay muted playsInline></video>
        </div>
      </div>
    );
  }
)

export default CustomCamera;
