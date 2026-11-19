import { useState, useEffect } from 'react'

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    os: '',
    architecture: ''
  })

  useEffect(() => {
    const detectDevice = async () => {
      const userAgent = navigator.userAgent
      const platform = navigator.platform

      let os = 'Unknown OS'
      let architecture = 'Unknown'

      if (platform.indexOf('Mac') > -1 || userAgent.indexOf('Macintosh') > -1) {
        os = 'macOS'

        try {
          const glCanvas = document.createElement('canvas')
          const gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl')

          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            if (debugInfo) {
              const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              if (renderer.toLowerCase().includes('apple') || renderer.toLowerCase().includes('m1') || renderer.toLowerCase().includes('m2') || renderer.toLowerCase().includes('m3')) {
                architecture = 'Apple Silicon'
              } else if (renderer.toLowerCase().includes('intel')) {
                architecture = 'Intel'
              } else {
                architecture = 'Apple Silicon'
              }
            } else {
              architecture = 'Apple Silicon'
            }
          } else {
            architecture = 'Apple Silicon'
          }
        } catch (e) {
          architecture = 'Apple Silicon'
        }
      } else if (platform.indexOf('Win') > -1 || userAgent.indexOf('Windows') > -1) {
        os = 'Windows'
        if (userAgent.indexOf('Win64') > -1 || userAgent.indexOf('x64') > -1) {
          architecture = 'x64'
        } else if (userAgent.indexOf('ARM') > -1) {
          architecture = 'ARM64'
        } else {
          architecture = 'x86'
        }
      } else if (platform.indexOf('Linux') > -1) {
        os = 'Linux'
        if (userAgent.indexOf('x86_64') > -1 || userAgent.indexOf('x64') > -1) {
          architecture = 'x64'
        } else if (userAgent.indexOf('ARM') > -1 || userAgent.indexOf('aarch64') > -1) {
          architecture = 'ARM64'
        } else {
          architecture = 'x86'
        }
      } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        os = 'iOS'
        architecture = 'ARM64'
      } else if (/Android/.test(userAgent)) {
        os = 'Android'
        architecture = 'ARM'
      }

      setDeviceInfo({ os, architecture })
    }

    detectDevice()
  }, [])

  return deviceInfo
}
