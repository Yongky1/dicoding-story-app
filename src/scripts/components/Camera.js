class Camera {
  constructor(videoElementId) {
    this.stream = null;
    this.videoElementId = videoElementId;
    this.videoElement = null;
    this.isActive = false;
    this.facingMode = 'environment';
    this.capturedImage = null;
  }

  async start() {
    try {
      // Stop any existing stream
      this.stop();
      
      // Get video element
      this.videoElement = document.getElementById(this.videoElementId);
      if (!this.videoElement) {
        throw new Error(`Video element with id '${this.videoElementId}' not found in DOM`);
      }

      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Set up video element
      this.videoElement.srcObject = this.stream;
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play()
            .then(() => {
              this.isActive = true;
              this.videoElement.classList.remove('hidden');
              resolve(this.videoElement);
            })
            .catch(reject);
        };
        this.videoElement.onerror = reject;
      });

      return this.videoElement;
    } catch (error) {
      this.isActive = false;
      let errorMessage = 'Failed to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (window.isSecureContext === false) {
        errorMessage = 'Camera only works on HTTPS or localhost.';
      }
      console.error(errorMessage + ': ' + error.message);
      throw new Error(errorMessage + ': ' + error.message);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement.classList.add('hidden');
      this.videoElement.pause();
    }
    this.isActive = false;
  }

  async captureImage() {
    if (!this.isActive || !this.videoElement) {
      throw new Error('Camera is not active');
    }
    
    // Wait for video to be ready
    if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
      throw new Error('Camera is not ready. Please wait a moment and try again.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera after capturing
    this.stop();
    
    return this.capturedImage;
  }

  async switchCamera() {
    if (!this.isActive) {
      throw new Error('Camera is not active');
    }
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    await this.start();
  }

  getCapturedImage() {
    return this.capturedImage;
  }

  clearCapturedImage() {
    this.capturedImage = null;
  }

  destroy() {
    this.stop();
    this.clearCapturedImage();
  }
}

export default Camera;