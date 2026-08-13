<!-- FILE: client/src/components/PredictionCard.vue -->
<template>
  <div class="prediction-card">
    <div class="prediction-header">
      <h3>🔍 AI Analysis Results</h3>
      <div class="analysis-timestamp">
        <span>{{ formatTimestamp(result.timestamp) }}</span>
      </div>
    </div>

    <!-- Top Prediction (Primary Result) -->
    <div class="top-prediction">
      <div class="prediction-main">
        <div class="disease-info">
          <div class="disease-icon">{{ getDiseaseIcon(result.topPrediction.diseaseKey) }}</div>
          <div class="disease-details">
            <h4 class="disease-name">{{ result.topPrediction.displayName }}</h4>
            <p class="disease-key">{{ result.topPrediction.diseaseKey }}</p>
          </div>
        </div>
        
        <div class="confidence-section">
          <div class="confidence-value" :class="getConfidenceClass(result.topPrediction.confidence)">
            {{ formatConfidence(result.topPrediction.confidence) }}%
          </div>
          <div class="confidence-label">Confidence</div>
        </div>
      </div>

      <div class="confidence-bar-container">
        <div class="confidence-bar">
          <div 
            class="confidence-fill"
            :class="getConfidenceClass(result.topPrediction.confidence)"
            :style="{ width: formatConfidence(result.topPrediction.confidence) + '%' }"
          ></div>
        </div>
        <div class="confidence-text">
          {{ getConfidenceDescription(result.topPrediction.confidence) }}
        </div>
      </div>
    </div>

    <!-- Detailed Results (All Predictions) -->
    <div v-if="showDetailed && result.allPredictions.length > 1" class="detailed-predictions">
      <h4>📊 Detailed Analysis</h4>
      
      <div class="predictions-list">
        <div 
          v-for="(prediction, index) in result.allPredictions" 
          :key="index"
          class="prediction-item"
          :class="{ 
            'is-top': index === 0,
            'low-confidence': prediction.confidence < 0.1 
          }"
        >
          <div class="prediction-info">
            <span class="prediction-icon">{{ getDiseaseIcon(prediction.diseaseKey) }}</span>
            <span class="prediction-name">{{ prediction.displayName }}</span>
          </div>
          
          <div class="prediction-confidence">
            <div class="mini-confidence-bar">
              <div 
                class="mini-confidence-fill"
                :style="{ width: formatConfidence(prediction.confidence) + '%' }"
              ></div>
            </div>
            <span class="confidence-percent">{{ formatConfidence(prediction.confidence) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Model Information -->
    <div v-if="showDetailed" class="model-info">
      <details class="model-details">
        <summary>🤖 Model Information</summary>
        <div class="model-content">
          <div class="model-stat">
            <span class="stat-label">Input Shape:</span>
            <span class="stat-value">{{ result.modelInfo.inputShape?.join('×') || 'Unknown' }}</span>
          </div>
          <div class="model-stat">
            <span class="stat-label">Classes:</span>
            <span class="stat-value">{{ result.modelInfo.classes?.length || 0 }} diseases</span>
          </div>
          <div class="model-stat">
            <span class="stat-label">Analysis Time:</span>
            <span class="stat-value">{{ getAnalysisTime() }}</span>
          </div>
        </div>
      </details>
    </div>

    <!-- Severity Indicator -->
    <div class="severity-section">
      <div class="severity-indicator" :class="getSeverityClass(result.topPrediction.diseaseKey)">
        <span class="severity-icon">{{ getSeverityIcon(result.topPrediction.diseaseKey) }}</span>
        <span class="severity-text">{{ getSeverityText(result.topPrediction.diseaseKey) }} Risk</span>
      </div>
      
      <p class="severity-description">
        {{ getSeverityDescription(result.topPrediction.diseaseKey) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PredictionCard',

  props: {
    result: {
      type: Object,
      required: true
    },
    showDetailed: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    getDiseaseIcon(diseaseKey) {
      const icons = {
        'healthy': '✅',
        'black-spot': '🔵',
        'canker': '🟠',
        'greening': '🟡'
      };
      return icons[diseaseKey] || '❓';
    },

    formatConfidence(confidence) {
      return Math.round(confidence * 100);
    },

    getConfidenceClass(confidence) {
      const percent = confidence * 100;
      if (percent >= 80) return 'high-confidence';
      if (percent >= 60) return 'medium-confidence';
      return 'low-confidence';
    },

    getConfidenceDescription(confidence) {
      const percent = confidence * 100;
      if (percent >= 90) return 'Very High Confidence';
      if (percent >= 80) return 'High Confidence';
      if (percent >= 70) return 'Good Confidence';
      if (percent >= 60) return 'Moderate Confidence';
      if (percent >= 40) return 'Low Confidence';
      return 'Very Low Confidence';
    },

    getSeverityClass(diseaseKey) {
      const severity = this.getSeverityLevel(diseaseKey);
      return `severity-${severity}`;
    },

    getSeverityLevel(diseaseKey) {
      const severityMap = {
        'healthy': 'low',
        'black-spot': 'medium',
        'canker': 'high', 
        'greening': 'high'
      };
      return severityMap[diseaseKey] || 'medium';
    },

    getSeverityIcon(diseaseKey) {
      const severity = this.getSeverityLevel(diseaseKey);
      const icons = {
        'low': '🟢',
        'medium': '🟡',
        'high': '🔴'
      };
      return icons[severity];
    },

    getSeverityText(diseaseKey) {
      const severity = this.getSeverityLevel(diseaseKey);
      return severity.charAt(0).toUpperCase() + severity.slice(1);
    },

    getSeverityDescription(diseaseKey) {
      const descriptions = {
        'healthy': 'Your plant appears healthy. Continue good care practices.',
        'black-spot': 'Moderate disease that requires attention. Treatment recommended.',
        'canker': 'Serious bacterial disease. Immediate action and expert consultation needed.',
        'greening': 'Severe disease requiring urgent intervention. Contact agricultural services.'
      };
      return descriptions[diseaseKey] || 'Consult agricultural expert for proper assessment.';
    },

    formatTimestamp(timestamp) {
      try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Just now';
      }
    },

    getAnalysisTime() {
      // This could be calculated from actual timing data if available
      return '< 1 second';
    }
  }
};
</script>

<style scoped>
.prediction-card {
  background: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.prediction-header {
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prediction-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text);
}

.analysis-timestamp {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* Top Prediction */
.top-prediction {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.prediction-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.disease-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.disease-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.disease-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text);
}

.disease-key {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 500;
}

.confidence-section {
  text-align: center;
}

.confidence-value {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: var(--spacing-xs);
}

.confidence-value.high-confidence {
  color: var(--success);
}

.confidence-value.medium-confidence {
  color: var(--warning);
}

.confidence-value.low-confidence {
  color: var(--error);
}

.confidence-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Confidence Bar */
.confidence-bar-container {
  margin-bottom: var(--spacing-lg);
}

.confidence-bar {
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  height: 12px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.confidence-fill {
  height: 100%;
  border-radius: var(--radius);
  transition: var(--transition);
}

.confidence-fill.high-confidence {
  background: linear-gradient(90deg, var(--success), var(--green-400));
}

.confidence-fill.medium-confidence {
  background: linear-gradient(90deg, var(--warning), #fbbf24);
}

.confidence-fill.low-confidence {
  background: linear-gradient(90deg, var(--error), #f87171);
}

.confidence-text {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

/* Detailed Predictions */
.detailed-predictions {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.detailed-predictions h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text);
}

.predictions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
  background: var(--bg-secondary);
  transition: var(--transition);
}

.prediction-item.is-top {
  background: var(--success-bg);
  border: 1px solid var(--green-200);
  font-weight: 600;
}

.prediction-item.low-confidence {
  opacity: 0.6;
}

.prediction-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.prediction-icon {
  font-size: var(--font-size-lg);
}

.prediction-name {
  font-size: var(--font-size-sm);
}

.prediction-confidence {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mini-confidence-bar {
  width: 60px;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.mini-confidence-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.confidence-percent {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 35px;
  text-align: right;
}

/* Model Information */
.model-info {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.model-details summary {
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  user-select: none;
}

.model-details summary:hover {
  color: var(--primary);
}

.model-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.model-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: var(--font-size-sm);
  color: var(--text);
  font-weight: 600;
}

/* Severity Section */
.severity-section {
  padding: var(--spacing-xl);
}

.severity-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.severity-low {
  background: var(--success-bg);
  color: var(--green-800);
}

.severity-medium {
  background: var(--warning-bg);
  color: #92400e;
}

.severity-high {
  background: var(--error-bg);
  color: #991b1b;
}

.severity-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .prediction-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .prediction-main {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .disease-info {
    justify-content: center;
  }

  .disease-icon {
    font-size: 2rem;
  }

  .confidence-value {
    font-size: 2rem;
  }

  .model-content {
    grid-template-columns: 1fr;
  }

  .prediction-item {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .prediction-confidence {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .top-prediction,
  .detailed-predictions,
  .severity-section {
    padding: var(--spacing-lg);
  }

  .prediction-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
}
</style>