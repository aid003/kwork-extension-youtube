console.log("Content script loaded for YouTube");

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

const languages: DropdownOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' }
];

const detailLevels: DropdownOption[] = [
  { value: 'concise', label: 'Concise', description: 'Main points only' },
  { value: 'standard', label: 'Standard', description: 'Key moments with context' },
  { value: 'detailed', label: 'Detailed', description: 'Full chronological breakdown' }
];

function createDropdown(options: DropdownOption[], initialValue: string, icon: string) {
  const dropdown = document.createElement('div');
  dropdown.className = 'ai-dropdown';

  const selectedOption = options.find(opt => opt.value === initialValue) || options[0];
  
  const button = document.createElement('button');
  button.className = 'ai-dropdown-button';
  button.innerHTML = `
    <span class="ai-icon">${icon}</span>
    ${selectedOption.label}
    <span class="ai-icon arrow">
      <img src="${chrome.runtime.getURL('public/arrow-down.svg')}" alt="arrow" />
    </span>
  `;

  const content = document.createElement('div');
  content.className = 'ai-dropdown-content';

  options.forEach(option => {
    const item = document.createElement('div');
    item.className = 'ai-dropdown-item' + (option.value === initialValue ? ' selected' : '');
    item.innerHTML = `
      ${option.description ? `
        <div>
          <div>${option.label}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.7)">${option.description}</div>
        </div>
      ` : option.label}
    `;

    item.addEventListener('click', () => {
      // Update button text
      button.innerHTML = `
        <span class="ai-icon">${icon}</span>
        ${option.label}
        <span class="ai-icon arrow">
          <img src="${chrome.runtime.getURL('public/arrow-down.svg')}" alt="arrow" />
        </span>
      `;
      
      // Update selected state
      content.querySelectorAll('.ai-dropdown-item').forEach(el => {
        el.classList.remove('selected');
      });
      item.classList.add('selected');
      
      // Close dropdown
      dropdown.classList.remove('active');
    });

    content.appendChild(item);
  });

  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    
    // Close other dropdowns
    document.querySelectorAll('.ai-dropdown').forEach(el => {
      if (el !== dropdown) el.classList.remove('active');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });

  dropdown.appendChild(button);
  dropdown.appendChild(content);
  return dropdown;
}

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

  // First row - Language and Detail dropdowns
  const firstRow = document.createElement('div');
  firstRow.className = 'ai-controls-row';

  // Language Dropdown
  const langDropdown = createDropdown(languages, 'en', '🌐');

  // Detail Level Dropdown
  const detailDropdown = createDropdown(detailLevels, 'detailed', '📋');

  firstRow.appendChild(langDropdown);
  firstRow.appendChild(detailDropdown);

  // Second row - Summarize and Timestamps buttons
  const secondRow = document.createElement('div');
  secondRow.className = 'ai-controls-row';

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

  secondRow.appendChild(summarizeBtn);
  secondRow.appendChild(timestampsBtn);

  // Input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'ai-input';
  input.placeholder = 'Ask about the video...';

  // Append elements
  controls.appendChild(firstRow);
  controls.appendChild(secondRow);
  
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