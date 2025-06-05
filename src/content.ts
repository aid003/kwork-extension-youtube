console.log("Content script loaded for YouTube");

function createSummarizer() {
  const container = document.createElement('div');
  container.id = 'ai-video-summarizer';
  container.className = 'ai-summarizer-container';

  // Header
  const header = document.createElement('div');
  header.className = 'ai-summarizer-header';
  header.textContent = 'AI Video Summarizer';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'ai-summarizer-controls';

  // Language Dropdown
  const langDropdown = document.createElement('button');
  langDropdown.className = 'ai-dropdown-button';
  langDropdown.innerHTML = `
    <span class="ai-icon">🌐</span>
    English
    <span class="ai-icon">▼</span>
  `;

  // Detail Level Dropdown
  const detailDropdown = document.createElement('button');
  detailDropdown.className = 'ai-dropdown-button';
  detailDropdown.innerHTML = `
    <span class="ai-icon">📋</span>
    Detailed
    <span class="ai-icon">▼</span>
  `;

  // Buttons
  const summarizeBtn = document.createElement('button');
  summarizeBtn.className = 'ai-button ai-button-primary';
  summarizeBtn.innerHTML = `
    <span class="ai-icon">✨</span>
    Summarize
  `;

  const timestampsBtn = document.createElement('button');
  timestampsBtn.className = 'ai-button';
  timestampsBtn.innerHTML = `
    <span class="ai-icon">⏱️</span>
    Timestamps
  `;

  // Input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'ai-input';
  input.placeholder = 'Ask about the video...';

  // Append elements
  controls.appendChild(langDropdown);
  controls.appendChild(detailDropdown);
  controls.appendChild(summarizeBtn);
  controls.appendChild(timestampsBtn);
  
  container.appendChild(header);
  container.appendChild(controls);
  container.appendChild(input);

  return container;
}

function injectSummarizer() {
  // Check if summarizer already exists
  if (document.getElementById('ai-video-summarizer')) {
    return;
  }

  const relatedSection = document.querySelector('#related.style-scope.ytd-watch-flexy');
  if (relatedSection) {
    const summarizer = createSummarizer();
    relatedSection.insertAdjacentElement('afterbegin', summarizer);
    console.log('Summarizer injected successfully');
  } else {
    // If element not found, try again after a short delay
    setTimeout(injectSummarizer, 1000);
  }
}

// Function to handle navigation
function handleNavigation() {
  // Remove existing summarizer if it exists
  const existingSummarizer = document.getElementById('ai-video-summarizer');
  if (existingSummarizer) {
    existingSummarizer.remove();
  }
  
  // Start new injection
  injectSummarizer();
}

// Initial injection
injectSummarizer();

// Listen for YouTube SPA navigation
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && 
        document.location.pathname === '/watch' && 
        !document.getElementById('ai-video-summarizer')) {
      handleNavigation();
      break;
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 