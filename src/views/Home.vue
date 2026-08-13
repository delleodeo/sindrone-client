<!-- FILE: client/src/views/Home.vue -->
<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              AI-Powered <span class="text-gradient">Citrus Disease</span> Detection
            </h1>
            <p class="hero-subtitle">
              Protect your dalandan crops with instant, AI-powered disease diagnosis. 
              Upload a leaf photo and get expert recommendations in seconds.
            </p>
            <div class="hero-actions">
              <router-link to="/detect" class="btn btn-primary btn-lg">
                Start Detection
                <span>📱</span>
              </router-link>
              <router-link to="/chat" class="btn btn-outline btn-lg">
                Ask AI Assistant
                <span>💬</span>
              </router-link>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="feature-demo">
              <div class="demo-card">
                <div class="demo-image">
                  <div class="image-placeholder">
                    <span class="leaf-icon">🍃</span>
                  </div>
                </div>
                <div class="demo-result">
                  <div class="result-header">
                    <span class="status-indicator success"></span>
                    <span>Analysis Complete</span>
                  </div>
                  <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: '87%' }"></div>
                  </div>
                  <p class="result-text">Healthy Citrus - 87% confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2>How AgriDrone Helps Filipino Farmers</h2>
          <p>Advanced AI technology made simple for everyday use</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📸</div>
            <h3>Instant Detection</h3>
            <p>Take a photo or upload an image of your dalandan leaf. Our AI analyzes it in seconds using advanced machine learning.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Accurate Diagnosis</h3>
            <p>Identify 4 key conditions: Healthy leaves, Black Spot, Canker, and Greening disease with high accuracy rates.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Expert Recommendations</h3>
            <p>Get detailed treatment and prevention guidance tailored to your specific diagnosis and farming conditions.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>AI Assistant</h3>
            <p>Ask questions anytime about citrus farming, disease management, and get personalized advice from our AI assistant.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🌱</div>
            <h3>Sustainable Farming</h3>
            <p>Emphasis on organic solutions, integrated pest management, and environmentally friendly practices.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Works perfectly on smartphones and tablets. Use it directly in the field while inspecting your crops.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section class="quick-start">
      <div class="container">
        <div class="section-header">
          <h2>Get Started in 3 Simple Steps</h2>
          <p>No training required - start protecting your crops today</p>
        </div>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Capture or Upload</h3>
              <p>Take a clear photo of a dalandan leaf or upload an existing image from your device.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>AI Analysis</h3>
              <p>Our trained model analyzes the image and identifies potential diseases or confirms healthy status.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Get Recommendations</h3>
              <p>Receive detailed guidance on treatment, prevention, and when to consult agricultural experts.</p>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <router-link to="/detect" class="btn btn-secondary btn-lg">
            Try Disease Detection Now
          </router-link>
        </div>
      </div>
    </section>

    <!-- Disease Info Section -->
    <section class="diseases-info">
      <div class="container">
        <div class="section-header">
          <h2>Diseases We Can Detect</h2>
          <p>Learn about common citrus diseases affecting dalandan crops</p>
        </div>
        
        <div class="diseases-grid">
          <div class="disease-card healthy">
            <div class="disease-icon">✅</div>
            <h3>Healthy Citrus</h3>
            <p>Normal, healthy dalandan leaves showing no signs of disease or pest damage.</p>
            <div class="severity-indicator low">Low Risk</div>
          </div>
          
          <div class="disease-card">
            <div class="disease-icon">🔵</div>
            <h3>Black Spot</h3>
            <p>Fungal disease causing dark spots on leaves and fruit, reducing crop quality.</p>
            <div class="severity-indicator medium">Medium Risk</div>
          </div>
          
          <div class="disease-card">
            <div class="disease-icon">🟠</div>
            <h3>Citrus Canker</h3>
            <p>Bacterial disease creating raised lesions, potentially requiring quarantine measures.</p>
            <div class="severity-indicator high">High Risk</div>
          </div>
          
          <div class="disease-card">
            <div class="disease-icon">🟡</div>
            <h3>Greening (HLB)</h3>
            <p>Severe bacterial disease causing yellow shoots and bitter fruit, often fatal to trees.</p>
            <div class="severity-indicator high">High Risk</div>
          </div>

          <div class="disease-card pest">
            <div class="disease-icon">🐛</div>
            <h3>Citrus psyllid</h3>
            <p>Curling/yellowing young leaves and stunted shoots; vector of citrus greening (HLB).</p>
            <div class="severity-indicator high">High Risk</div>
          </div>

          <div class="disease-card pest">
            <div class="disease-icon">🪱</div>
            <h3>Citrus leafminer</h3>
            <p>Winding tunnels or silvery trails on young leaves caused by larvae feeding under the leaf surface.</p>
            <div class="severity-indicator medium">Monitor</div>
          </div>

          <div class="disease-card pest">
            <div class="disease-icon">🪰</div>
            <h3>Citrus fruit fly</h3>
            <p>Larvae develop inside fruit causing rot and premature fruit drop; economic impact on yield and quality.</p>
            <div class="severity-indicator high">High Risk</div>
          </div>

          <div class="disease-card pest">
            <div class="disease-icon">🐜</div>
            <h3>Scale insects</h3>
            <p>Small, often immobile scales on leaves and branches; cause yellowing, weakening and honeydew deposits.</p>
            <div class="severity-indicator medium">Monitor</div>
          </div>

          <div class="disease-card pest">
            <div class="disease-icon">🧶</div>
            <h3>Citrus mealybug</h3>
            <p>White, cotton-like insects that excrete honeydew leading to sooty mold and reduced plant vigor.</p>
            <div class="severity-indicator medium">Monitor</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  
  mounted() {
    // Analytics or tracking could go here
    console.log('Home page loaded');
  }
};
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--green-50) 0%, var(--orange-50) 100%);
  padding: var(--spacing-2xl) 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--text);
}

.text-gradient {
  background: linear-gradient(135deg, var(--green-600), var(--orange-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
}

/* Feature Demo */
.feature-demo {
  display: flex;
  justify-content: center;
}

.demo-card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  max-width: 300px;
  width: 100%;
}

.demo-image {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: var(--spacing-xl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: var(--green-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.leaf-icon {
  font-size: 2rem;
}

.demo-result {
  text-align: center;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.success {
  background-color: var(--success);
}

.confidence-bar {
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  height: 8px;
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.confidence-fill {
  background: linear-gradient(90deg, var(--green-500), var(--green-400));
  height: 100%;
  border-radius: var(--radius);
  transition: var(--transition);
}

.result-text {
  font-weight: 600;
  color: var(--success);
  margin: 0;
}

/* Features Section */
.features {
  padding: var(--spacing-2xl) 0;
  background: var(--bg);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-header h2 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text);
}

.section-header p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background: var(--card);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.feature-card h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0;
}

/* Quick Start Section */
.quick-start {
  padding: var(--spacing-2xl) 0;
  background: var(--bg-secondary);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  text-align: left;
}

.step-number {
  width: 3rem;
  height: 3rem;
  background: var(--primary);
  color: var(--text-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text);
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0;
}

.cta-section {
  text-align: center;
}

/* Diseases Info Section */
.diseases-info {
  padding: var(--spacing-2xl) 0;
  background: var(--bg);
}

.diseases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.disease-card {
  background: var(--card);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: var(--transition);
  position: relative;
}

.disease-card:hover {
  box-shadow: var(--shadow-md);
}

.disease-card.healthy {
  border-color: var(--green-300);
  background: var(--success-bg);
}

.disease-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
}

.disease-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text);
}

.disease-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.severity-indicator {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.severity-indicator.low {
  background: var(--success-bg);
  color: var(--green-800);
}

.severity-indicator.medium {
  background: var(--warning-bg);
  color: #92400e;
}

.severity-indicator.high {
  background: var(--error-bg);
  color: #991b1b;
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-xl);
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: var(--spacing-xl) 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: var(--font-size-lg);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .features-grid,
  .diseases-grid {
    grid-template-columns: 1fr;
  }

  .step {
    text-align: center;
    flex-direction: column;
    align-items: center;
  }
}
</style>