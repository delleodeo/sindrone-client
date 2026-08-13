// FILE: client/src/utils/tfModel.js
import * as tf from '@tensorflow/tfjs';

class CitrusDiseaseModel {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.isLoading = false;
    
    // Class names in the order they appear in the Teachable Machine model
    this.classNames = [
      'Healthy',
      'Black Spot', 
      'Canker',
      'Greening'
    ];
    
    // Using the Teachable Machine shareable link
    this.modelUrl = 'https://teachablemachine.withgoogle.com/models/_sIGGWs5K/';
    
    // Disease label mappings
    this.diseaseMapping = {
      'healthy': 'healthy',
      'black spot': 'black-spot', 
      'canker': 'canker',
      'greening': 'greening'
    };

    // Display names
    this.diseaseDisplayNames = {
      'healthy': 'Healthy Citrus',
      'black-spot': 'Citrus Black Spot',
      'canker': 'Citrus Canker',
      'greening': 'Citrus Greening (HLB)'
    };

    // Pest list for simulated pest-scanning mode
    this.pestList = [
      { className: 'Citrus psyllid', diseaseKey: 'citrus-psyllid', displayName: 'Citrus psyllid (Diaphorina citri)', description: 'Curling/yellowing young leaves; stunted shoots; can transmit citrus greening' },
      { className: 'Citrus leafminer', diseaseKey: 'citrus-leafminer', displayName: 'Citrus leafminer (Phyllocnistis citrella)', description: 'Winding tunnels/silvery trails on young leaves' },
      { className: 'Citrus fruit fly', diseaseKey: 'citrus-fruit-fly', displayName: 'Citrus fruit fly (Bactrocera spp.)', description: 'Larvae inside fruit, fruit rot and premature fruit drop' },
      { className: 'Scale insects', diseaseKey: 'scale-insects', displayName: 'Scale insects', description: 'Small scales on leaves/branches; yellowing and weakening' },
      { className: 'Citrus mealybug', diseaseKey: 'citrus-mealybug', displayName: 'Citrus mealybug (Planococcus citri)', description: 'White cotton-like insects; honeydew and sooty mold' }
    ];
  }

  // Load the TensorFlow.js model from Teachable Machine
  async loadModel() {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      console.log('Loading Teachable Machine model from URL...');
      
      // Load model from Teachable Machine shareable link
      this.model = await tf.loadLayersModel(this.modelUrl + 'model.json');
      this.isLoaded = true;
      this.isLoading = false;
      
      console.log('Model loaded successfully:', {
        inputShape: this.model.inputs[0].shape,
        classes: this.classNames
      });
      
      return true;

    } catch (error) {
      this.isLoading = false;
      console.error('Failed to load model:', error);
      throw new Error(`Model loading failed: ${error.message}`);
    }
  }

  // Preprocess image for model prediction (Teachable Machine style)
  preprocessImage(imageElement) {
    return tf.tidy(() => {
      // Teachable Machine expects specific preprocessing:
      // 1. Resize to 224x224
      // 2. Normalize to [-1, 1] range (not [0, 1])
      const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224]) // Teachable Machine standard size
        .toFloat()
        .div(127.5) // Normalize to [0, 2]
        .sub(1) // Shift to [-1, 1] range (Teachable Machine standard)
        .expandDims(); // Add batch dimension
      
      return tensor;
    });
  }

  // Normalize label to disease key
  normalizeDiseaseKey(label) {
    const normalizedLabel = label.toLowerCase().trim();
    return this.diseaseMapping[normalizedLabel] || normalizedLabel.replace(/\s+/g, '-');
  }

  // Get display name for disease key
  getDisplayName(diseaseKey) {
    return this.diseaseDisplayNames[diseaseKey] || diseaseKey;
  }

  // Predict disease from image element
  async predictDisease(imageElement) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      console.log('Running prediction...');
      
      // Preprocess image
      const preprocessedImage = this.preprocessImage(imageElement);
      
      // Run prediction
      const predictions = this.model.predict(preprocessedImage);
      
      // Get the prediction data
      const predictionData = await predictions.data();
      
      // Clean up tensors
      preprocessedImage.dispose();
      predictions.dispose();
      
      // Create results array with class names and probabilities
      const results = this.classNames.map((className, index) => ({
        className,
        confidence: predictionData[index],
        diseaseKey: this.normalizeDiseaseKey(className),
        displayName: this.getDisplayName(this.normalizeDiseaseKey(className))
      }));
      
      // Sort predictions by confidence (highest first)
      const sortedPredictions = results.sort((a, b) => b.confidence - a.confidence);

      const result = {
        topPrediction: sortedPredictions[0],
        allPredictions: sortedPredictions,
        timestamp: new Date().toISOString(),
        modelInfo: {
          inputShape: this.model.inputs[0].shape,
          classes: this.classNames
        }
      };

      console.log('Prediction completed:', result);
      return result;

    } catch (error) {
      console.error('Prediction failed:', error);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  // Predict from image file
  async predictFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please provide an image file.'));
        return;
      }

      const img = new Image();
      img.onload = async () => {
        try {
          const result = await this.predictDisease(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };

      // Create object URL for image
      img.src = URL.createObjectURL(file);
    });
  }

  // Predict from image URL or data URL
  async predictFromURL(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // For CORS if needed
      
      img.onload = async () => {
        try {
          const result = await this.predictDisease(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image from URL'));
      };

      img.src = imageUrl;
    });
  }

  // Simulated pest scan (fake confidence values for now)
  async predictPestFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please provide an image file.'));
        return;
      }

      const img = new Image();
      img.onload = async () => {
        try {
          // Generate pseudo-random confidences (not real predictions)
          const rnd = () => Math.min(0.99, Math.max(0.02, Math.random()));
          const results = this.pestList.map(p => ({
            className: p.className,
            confidence: rnd(),
            diseaseKey: p.diseaseKey,
            displayName: p.displayName,
            description: p.description
          }));

          const sorted = results.sort((a, b) => b.confidence - a.confidence);

          resolve({
            topPrediction: sorted[0],
            allPredictions: sorted,
            timestamp: new Date().toISOString(),
            modelInfo: {
              inputShape: [224, 224, 3],
              classes: this.pestList.map(p => p.className)
            }
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Check if model is ready for prediction
  isReady() {
    return this.isLoaded;
  }

  // Get model status
  getStatus() {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      supportedDiseases: Object.keys(this.diseaseDisplayNames)
    };
  }

  // Cleanup resources
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isLoaded = false;
    }
  }
}

// Export singleton instance
const citrusModel = new CitrusDiseaseModel();

// Auto-load model on first import (with error handling)
citrusModel.loadModel().catch(error => {
  console.warn('Model auto-loading failed:', error.message);
  console.log('Model will be loaded on first prediction attempt');
});

export default citrusModel;