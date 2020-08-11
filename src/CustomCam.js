import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    height: '100%',
    width: 'auto'
  },
  container: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: 'auto !important',
    // height: '100% !important', 
    overflow: 'hidden',
  },
  video: {
    minWidth: '100%',
    minHeight: '100%',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: '0'
  },
  mirror: {
    transform: 'translate(-50%,-50%) scale(-1,1) !important'
  },
  canvas: {
    display: 'none'
  }
}))

const CustomCamera = forwardRef(
  ({ getCamData, currentIndex, mirror, height, width }, ref) => {
    const [isInit, setInit] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [deviceList, setDeviceList] = useState([]);
    const [isMirror, setIsMirror] = useState(false);

    useImperativeHandle(ref, () => ({
      getSnap() {
        let videoEl = document.getElementById('inputVideo')
        if (videoEl.paused || videoEl.ended) return null
        let canvas = document.getElementById('custom-cam-video-canvas')
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        let ctx = canvas.getContext('2d')
        if (isMirror) {    
          ctx.translate(videoEl.videoWidth, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
        const base64 = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
        return { base64, size: [videoEl.videoWidth, videoEl.videoHeight] }
      },
      getCanvas(canvasId, dimensions) {
        const { width: ws, height: hs } = dimensions
        const rs = ws/hs
        let videoEl = document.getElementById('inputVideo')
        const { videoWidth: wc, videoHeight: hc } = videoEl
        const rc = wc/hc
        let cropCanvas = ({ x, y, width, height }) => {
          let destCanvas = document.getElementById(canvasId)
          destCanvas.width = width;
          destCanvas.height = height;
          const dcx = destCanvas.getContext("2d")
          if (isMirror) {
            dcx.translate(wc, 0)
            dcx.scale(-1, 1)
          }
          dcx.drawImage(
            videoEl,
              x,y,width,height,  // source rect with content to crop
              0,0,width,height); // newCanvas, same size as source rect
          return destCanvas;
        }
        if (videoEl.paused || videoEl.ended) return null
        let canvas = document.getElementById(canvasId)
        canvas.width = wc;
        canvas.height = hc;
        let ctx = canvas.getContext('2d')
        let wo, ho, xo, yo
        wo = rc > 1 ? hc*rs : wc
        ho = rc > 1 ? hc : wc/rs
        xo = rc > 1 ? (wc - wo)/2 : 0
        yo = rc > 1 ? 0 : (hc - ho)/2
        canvas = cropCanvas({
          x: xo,
          y: yo,
          width: wo,
          height: ho,
        });
        ctx = canvas.getContext("2d"); 
        return ctx
      },
      toggleCamActive() {
        let videoEl = document.getElementById('inputVideo')
        videoEl.paused ? videoEl.play() : videoEl.pause()
      },
      toggleMirror() {
        setIsMirror(!isMirror)
      },
      switchCam(cam) {
        console.log(cam)
        setDeviceId(cam)
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
      if (deviceId !== null && !isInit) {
        updateVideo(deviceList[deviceId].deviceId)
      } 
    }, [isInit, deviceId, deviceList])
    useEffect(() => {
      const launchVideo = async () => {
        const video = document.getElementById('inputVideo');
        let videoV = document.getElementById('custom-cam-video-container');
        console.log(`videoV ${videoV?.clientWidth} ${videoV?.clientHeight}`)
        if (height && width) {
          // for mobile
          if (height > width) video.style.cssText = `width: auto !important`
          // for desktop
          else video.style.cssText = `width: auto !important`
          videoV.style.cssText = `height: ${height}px !important; width: ${width}px !important`
          // videoV.style.cssText = `height: ${height}px !important; width: ${width}px !important`
          // video.style.cssText = videoV.style.cssText = `height: ${height}px !important; width: ${width}px !important`
      }
        navigator.getMedia = (navigator.getUserMedia);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const constraints = {
            audio: false,
            video: {
              width: { min: 1280, ideal: videoV?.clientWidth, max: 1920 },
              height: { min: 720, ideal: videoV?.clientHeight, max: 1080 },
              // width: { ideal: 1920 },
              // height: { ideal: 1080 } 
            }
          }
          navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {
          const listDevicesX =  await navigator.mediaDevices.enumerateDevices();
          const listDevices = await listDevicesX.filter(ea => ea.kind === 'videoinput')
          setDeviceList(listDevices)
          let currentDevice = stream.getTracks()
          const currentDeviceX = listDevices.filter(ea => ea.label === currentDevice[0].label)[0]
          const currentIndex = listDevices.indexOf(currentDeviceX)
          getCamData({
            currentIndex,
            list: listDevices,
            size: [videoV?.clientWidth, videoV?.clientHeight]
          })
          video.srcObject = stream;
          video.play();
          });
        }
      }
      const init = async () => {
        await launchVideo()
        setInit(false)
      }
      init() 
    }, [setInit, getCamData, height, width])
    useEffect(() => {if (mirror !== null) setIsMirror(mirror)}, [mirror, setIsMirror])
    const classes = useStyles()
    return (
      <div className={classes.root}>      
        <div id='custom-cam-video-container' className={classes.container}>
          <video id="inputVideo" className={`${classes.video} ${isMirror ? classes.mirror : ''}`} autoPlay muted playsInline></video>
          <canvas id='custom-cam-video-canvas' className={classes.canvas} />
        </div>
      </div>
    );
  }
)

export default CustomCamera;
