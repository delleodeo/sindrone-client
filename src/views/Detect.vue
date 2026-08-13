<!-- FILE: client/src/views/Detect.vue -->
<template>
  <div class="detect-page">
    <div class="container container-sm">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Citrus Disease Detection</h1>
        <p>Upload or capture a dalandan leaf image for instant AI-powered diagnosis</p>
      </div>

      <!-- Detection Flow -->
      <div class="detection-flow">
        
        <!-- Step 1: Image Upload -->
        <div class="detection-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-header">
            <div class="step-number">1</div>
            <h2>Select Image</h2>
          </div>
          
          <ImageUploader 
            v-if="currentStep === 1"
            @image-selected="handleImageSelected"
            @error="handleError"
          />
          
          <!-- Show proceed button when image is selected in step 1 -->
          <div v-if="currentStep === 1 && selectedImage" class="proceed-section">
            <button @click="proceedToAnalysis" class="btn btn-primary btn-lg">
              Proceed to Analysis →
            </button>
          </div>
          
          <div v-else-if="currentStep > 1 && selectedImage" class="image-preview-small">
            <img :src="selectedImage.preview" alt="Selected leaf" />
            <button @click="resetDetection" class="btn btn-outline btn-sm">
              Choose Different Image
            </button>
          </div>
        </div>

        <!-- Step 2: AI Analysis -->
        <div class="detection-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-header">
            <div class="step-number">2</div>
            <h2>AI Analysis</h2>
          </div>
          
          <div v-if="currentStep === 2" class="analysis-section">
            <div v-if="isAnalyzing" class="analysis-progress">
              <div class="spinner-container">
                <div class="spinner"></div>
              </div>
              <p>Analyzing image with AI model...</p>
              <div class="progress-steps">
                <div class="progress-step" :class="{ active: analysisStep >= 1 }">Loading model</div>
                <div class="progress-step" :class="{ active: analysisStep >= 2 }">Processing image</div>
                <div class="progress-step" :class="{ active: analysisStep >= 3 }">Running prediction</div>
              </div>
            </div>

            <div v-else-if="analysisError" class="analysis-error">
              <div class="alert alert-error">
                <strong>Analysis Failed:</strong> {{ analysisError }}
              </div>
              <button @click="runAnalysis" class="btn btn-primary">
                Try Again
              </button>
            </div>

            <div v-else class="analysis-ready">
              <p>Image loaded and ready for analysis</p>
                <div class="analysis-actions">
                  <button @click="runAnalysis" class="btn btn-primary btn-lg">
                    Analyze Image
                    <span>🔍</span>
                  </button>
                  <button @click="runPestScan" class="btn btn-accent btn-lg">
                    Scan for Pests
                    <span>🪲</span>
                  </button>
                </div>
            </div>
          </div>

          <!-- Analysis Complete Preview -->
          <div v-else-if="currentStep > 2 && predictionResult" class="analysis-complete">
            <PredictionCard 
              :result="predictionResult"
              :show-detailed="false"
            />
          </div>
        </div>

        <!-- Step 3: Results & Recommendations -->
        <div class="detection-step" :class="{ active: currentStep >= 3 }">
          <div class="step-header">
            <div class="step-number">3</div>
            <h2>Results & Recommendations</h2>
          </div>
          
          <div v-if="currentStep === 3" class="results-section">
            
            <!-- Detailed Prediction Results -->
            <div class="prediction-section">
              <PredictionCard 
                v-if="predictionResult"
                :result="predictionResult"
                :show-detailed="true"
              />
            </div>

            <!-- Recommendation Loading/Display -->
            <div class="recommendation-section">
              <div v-if="isLoadingRecommendation" class="loading-recommendation">
                <div class="spinner"></div>
                <p>Loading treatment recommendations...</p>
              </div>

              <div v-else-if="recommendationError" class="recommendation-error">
                <div class="alert alert-warning">
                  <strong>Recommendations Unavailable:</strong> {{ recommendationError }}
                </div>
                <button @click="loadRecommendation" class="btn btn-outline">
                  Try Loading Again
                </button>
              </div>

              <RecommendationCard 
                v-else-if="recommendation"
                :recommendation="recommendation"
                :disease-key="predictionResult.topPrediction.diseaseKey"
              />
            </div>

            <!-- Action Buttons -->
            <div class="results-actions">
              <button @click="enhanceWithAI" class="btn btn-secondary" :disabled="isEnhancing">
                <span v-if="isEnhancing" class="spinner"></span>
                {{ isEnhancing ? 'Enhancing...' : 'Get AI-Enhanced Advice' }}
              </button>
              
              <router-link to="/chat" class="btn btn-outline">
                Ask Follow-up Questions
              </router-link>
              
              <button @click="resetDetection" class="btn btn-outline">
                Analyze Another Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUploader from '../components/ImageUploader.vue';
import PredictionCard from '../components/PredictionCard.vue';
import RecommendationCard from '../components/RecommendationCard.vue';
import citrusModel from '../utils/tfModel.js';
import { getRecommendation, generateAIRecommendation } from '../utils/api.js';

export default {
  name: 'Detect',
  
  components: {
    ImageUploader,
    PredictionCard,
    RecommendationCard
  },

  data() {
    return {
      currentStep: 1,
      selectedImage: null,
      isAnalyzing: false,
        isPestScanning: false,
      analysisStep: 0,
      analysisError: null,
      predictionResult: null,
      recommendation: null,
      isLoadingRecommendation: false,
      recommendationError: null,
      isEnhancing: false
    };
  },

  mounted() {
    // Preload the AI model
    this.preloadModel();
  },

  methods: {
    async preloadModel() {
      try {
        await citrusModel.loadModel();
        console.log('Model preloaded successfully');
      } catch (error) {
        console.warn('Model preload failed:', error.message);
      }
    },

    handleImageSelected(imageData) {
      this.selectedImage = imageData;
      // Don't auto-advance to step 2, let user see the preview first
      this.resetAnalysis();
    },

    proceedToAnalysis() {
      if (this.selectedImage) {
        this.currentStep = 2;
      }
    },

    handleError(error) {
      if (window.showToast) {
        window.showToast(error, 'error');
      }
    },

    async runAnalysis() {
      if (!this.selectedImage) return;

      this.isAnalyzing = true;
      this.analysisError = null;
      this.analysisStep = 1;

      try {
        // Step 1: Load model (if not already loaded)
        if (!citrusModel.isReady()) {
          await citrusModel.loadModel();
        }
        this.analysisStep = 2;

        // Step 2: Process image
        await new Promise(resolve => setTimeout(resolve, 500)); // Show processing step
        this.analysisStep = 3;

        // Step 3: Run prediction
        const result = await citrusModel.predictFromFile(this.selectedImage.file);
        
        this.predictionResult = result;
        this.currentStep = 3;
        
        // Auto-load recommendation
        this.loadRecommendation();

        if (window.showToast) {
          window.showToast('Analysis complete!', 'success');
        }

      } catch (error) {
        console.error('Analysis failed:', error);
        this.analysisError = error.message;
        
        if (window.showToast) {
          window.showToast('Analysis failed: ' + error.message, 'error');
        }
      } finally {
        this.isAnalyzing = false;
      }
    },

    // New: simulated pest scan handler
    async runPestScan() {
      if (!this.selectedImage) return;

      this.isPestScanning = true;
      this.analysisError = null;

      try {
        const result = await citrusModel.predictPestFromFile(this.selectedImage.file);
        this.predictionResult = result;
        this.currentStep = 3;

        // Clear recommendation since pests may have different guidance
        this.recommendation = null;

        if (window.showToast) {
          window.showToast('Pest scan complete (simulated confidences)', 'info');
        }
      } catch (error) {
        console.error('Pest scan failed:', error);
        this.analysisError = error.message;
        if (window.showToast) {
          window.showToast('Pest scan failed: ' + error.message, 'error');
        }
      } finally {
        this.isPestScanning = false;
      }
    },

    async loadRecommendation() {
      if (!this.predictionResult) return;

      const diseaseKey = this.predictionResult.topPrediction.diseaseKey;
      this.isLoadingRecommendation = true;
      this.recommendationError = null;

      try {
        const response = await getRecommendation(diseaseKey);
        this.recommendation = response.data;
        
      } catch (error) {
        console.error('Failed to load recommendation:', error);
        this.recommendationError = error.message;
        // Local fallbacks: healthy message or pest-based guidance
        try {
          if (diseaseKey === 'healthy') {
            this.recommendation = {
              summary: 'No disease detected. Plant appears healthy.',
              symptoms: [],
              causes: [],
              treatmentSteps: [],
              preventionSteps: ['Continue good cultural practices: regular watering, balanced fertilization, and monitoring.'],
              whenToEscalate: [],
              severity: 'low',
              disclaimer: 'This is a visual check; if you suspect issues, seek expert diagnosis.'
            };
            this.recommendationError = null;
          } else {
            const pest = citrusModel.pestList?.find(p => p.diseaseKey === diseaseKey);
            if (pest) {
              this.recommendation = {
                summary: `Detected likely pest: ${pest.displayName}. ${pest.description}`,
                symptoms: [pest.description],
                causes: ['Pest infestation - monitor surrounding plants and fruits'],
                treatmentSteps: [
                  'Manually remove affected parts where practical',
                  'Apply targeted insecticidal soap or approved pesticide according to label',
                  'Introduce natural predators if available (biocontrol)'
                ],
                preventionSteps: [
                  'Regularly inspect new plants and fruit',
                  'Maintain good sanitation and remove fallen debris',
                  'Avoid excessive nitrogen fertilization which attracts sap-feeding pests'
                ],
                whenToEscalate: ['Widespread infestation across multiple trees', 'Significant fruit drop or crop loss'],
                severity: 'medium',
                disclaimer: 'Local guidance only. Consult extension services for regulated pesticide advice.'
              };
              this.recommendationError = null;
            }
          }
        } catch (fallbackError) {
          console.error('Local recommendation fallback failed:', fallbackError);
        }

        // Try to generate fallback recommendation (AI)
        try {
          const aiResponse = await generateAIRecommendation(diseaseKey, {
            confidence: Math.round(this.predictionResult.topPrediction.confidence * 100),
            severity: this.getSeverityFromDisease(diseaseKey)
          });
          this.recommendation = aiResponse.data;
          this.recommendationError = null; // Clear error since AI fallback worked
          
          if (window.showToast) {
            window.showToast('AI-generated recommendations loaded', 'info');
          }
        } catch (aiError) {
          console.error('AI recommendation fallback failed:', aiError);
        }
        
      } finally {
        this.isLoadingRecommendation = false;
      }
    },

    async enhanceWithAI() {
      if (!this.predictionResult || this.isEnhancing) return;

      const diseaseKey = this.predictionResult.topPrediction.diseaseKey;
      this.isEnhancing = true;

      try {
        const response = await generateAIRecommendation(diseaseKey, {
          confidence: Math.round(this.predictionResult.topPrediction.confidence * 100),
          severity: this.getSeverityFromDisease(diseaseKey),
          userContext: 'User requested enhanced recommendations'
        });

        this.recommendation = response.data;
        
        if (window.showToast) {
          window.showToast('AI-enhanced recommendations loaded!', 'success');
        }

      } catch (error) {
        console.error('AI enhancement failed:', error);
        
        if (window.showToast) {
          window.showToast('Unable to enhance recommendations at this time', 'error');
        }
      } finally {
        this.isEnhancing = false;
      }
    },

    getSeverityFromDisease(diseaseKey) {
      const severityMap = {
        'healthy': 'low',
        'black-spot': 'medium', 
        'canker': 'high',
        'greening': 'high'
      };
      return severityMap[diseaseKey] || 'medium';
    },

    resetAnalysis() {
      this.predictionResult = null;
      this.recommendation = null;
      this.isAnalyzing = false;
      this.analysisStep = 0;
      this.analysisError = null;
      this.isLoadingRecommendation = false;
      this.recommendationError = null;
      this.isEnhancing = false;
    },

    resetDetection() {
      this.currentStep = 1;
      this.selectedImage = null;
      this.resetAnalysis();
    }
  }
};
</script>

<style scoped>
.detect-page {
  padding: var(--spacing-2xl) 0;
  min-height: 80vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text);
}

.page-header p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: 0;
}

/* Detection Flow */
.detection-flow {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.detection-step {
  background: var(--card);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: var(--transition);
  opacity: 0.6;
}

.detection-step.active {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  opacity: 1;
}

.detection-step.completed {
  border-color: var(--success);
  opacity: 0.9;
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.step-number {
  width: 3rem;
  height: 3rem;
  background: var(--border-light);
  color: var(--text-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 700;
  flex-shrink: 0;
  transition: var(--transition);
}

.detection-step.active .step-number {
  background: var(--primary);
  color: var(--text-light);
}

.detection-step.completed .step-number {
  background: var(--success);
  color: var(--text-light);
}

.step-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text);
}

/* Image Preview Small */
.image-preview-small {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.image-preview-small img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 2px solid var(--success);
}

/* Analysis Section */
.analysis-section {
  text-align: center;
}

.analysis-progress {
  padding: var(--spacing-2xl) 0;
}

.spinner-container {
  margin-bottom: var(--spacing-lg);
}

.analysis-progress p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.progress-step {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  transition: var(--transition);
}

.progress-step.active {
  background: var(--primary);
  color: var(--text-light);
}

.analysis-ready,
.analysis-error {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.analysis-ready p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.analysis-complete {
  padding: var(--spacing-lg) 0;
}

/* Results Section */
.results-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.prediction-section {
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-xl);
}

.loading-recommendation,
.recommendation-error {
  text-align: center;
  padding: var(--spacing-xl);
}

.loading-recommendation p,
.recommendation-error p {
  margin-bottom: var(--spacing-lg);
}

.results-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .step-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .detection-step {
    padding: var(--spacing-lg);
  }

  .image-preview-small {
    flex-direction: column;
    text-align: center;
  }

  .progress-steps {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .results-actions {
    flex-direction: column;
    align-items: center;
  }

  .results-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}

/* Loading animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.analysis-progress {
  animation: pulse 2s infinite;
}

/* Proceed section */
.proceed-section {
  margin-top: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

.proceed-section .btn {
  font-size: var(--font-size-lg);
  font-weight: 600;
}
</style>