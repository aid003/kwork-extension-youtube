import browser from "webextension-polyfill";

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
    <span class="ai-icon-left">${icon}</span>
    ${selectedOption.label}
    <span class="ai-icon-right arrow-icon"><img src="${browser.runtime.getURL("arrow-down.svg")}"/></span>
  `;

  const content = document.createElement('div');
  content.className = 'ai-dropdown-content';

  options.forEach(option => {
    const item = document.createElement('div');
    item.className = 'ai-dropdown-item' + (option.value === initialValue ? ' selected' : '');
    item.innerHTML = `
      <div style="display: flex; align-items: center; width: 100%;">
        <span class="checkmark" style="width: 16px; text-align: center;">${option.value === initialValue ? '✓' : ''}</span>
        ${option.description ? `
          <div style="flex: 1;">
            <div class="title">${option.label}</div>
            <div class="description">${option.description}</div>
          </div>
        ` : `<div class="title" style="flex: 1;">${option.label}</div>`}
      </div>
    `;

    item.addEventListener('click', () => {
      // Update button text
      button.innerHTML = `
        <span class="ai-icon-left">${icon}</span>
        <span>${option.label}</span>
        <span class="ai-icon-right arrow-icon"><img src="${browser.runtime.getURL("arrow-down.svg")}"/></span>
      `;
      
      // Update selected state and checkmark
      content.querySelectorAll('.ai-dropdown-item').forEach(el => {
        el.classList.remove('selected');
        // Update checkmark
        const checkmarkSpan = el.querySelector('.checkmark');
        if (checkmarkSpan) {
          checkmarkSpan.textContent = '';
        }
      });
      item.classList.add('selected');
      // Add checkmark to newly selected item
      const checkmarkSpan = item.querySelector('.checkmark');
      if (checkmarkSpan) {
        checkmarkSpan.textContent = '✓';
      }
      
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
  header.textContent = 'Video Summarizer';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'ai-summarizer-controls';

  // First row - Language and Detail dropdowns
  const firstRow = document.createElement('div');
  firstRow.className = 'ai-controls-row';

  // Language Dropdown
  const langDropdown = createDropdown(languages, 'en', `<img src="${browser.runtime.getURL("language.svg")}"/>`);

  // Detail Level Dropdown
  const detailDropdown = createDropdown(detailLevels, 'detailed', `<img src="${browser.runtime.getURL("settings.svg")}"/>`);
  detailDropdown.style.marginLeft = '15px';

  firstRow.appendChild(langDropdown);
  firstRow.appendChild(detailDropdown);

  // Second row - Summarize and Timestamps buttons
  const secondRow = document.createElement('div');
  secondRow.className = 'ai-controls-row';
  secondRow.style.display = 'flex';
  secondRow.style.gap = '12px';
  secondRow.style.width = '100%';

  let selectedMode: 'summarize' | 'timestamps' | 'question' | null = null;

  // Buttons
  const summarizeBtn = document.createElement('button');
  summarizeBtn.className = 'ai-button';
  summarizeBtn.style.flex = '1';
  summarizeBtn.innerHTML = `
    <span class="ai-icon">✨</span>
    Summarize
  `;

  const timestampsBtn = document.createElement('button');
  timestampsBtn.className = 'ai-button';
  timestampsBtn.style.flex = '1';
  timestampsBtn.innerHTML = `
    <span class="ai-icon">⏱️</span>
    Timestamps
  `;

  // Button click handlers
  summarizeBtn.addEventListener('click', () => {
    summarizeBtn.classList.toggle('selected');
    timestampsBtn.classList.remove('selected');
    selectedMode = summarizeBtn.classList.contains('selected') ? 'summarize' : null;
  });

  timestampsBtn.addEventListener('click', () => {
    timestampsBtn.classList.toggle('selected');
    summarizeBtn.classList.remove('selected');
    selectedMode = timestampsBtn.classList.contains('selected') ? 'timestamps' : null;
  });

  secondRow.appendChild(summarizeBtn);
  secondRow.appendChild(timestampsBtn);

  // Input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'ai-input-container';

  // Loading spinner
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'ai-loading-spinner';
  inputContainer.appendChild(loadingSpinner);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'ai-input';
  input.placeholder = 'Ask about the video...';

  const sendButton = document.createElement('button');
  sendButton.className = 'ai-send-button';
  sendButton.innerHTML = `<img src="${browser.runtime.getURL("button-send.svg")}"/>`;

  // Send button click handler
  sendButton.addEventListener('click', async () => {
    // For question mode, we need text input
    if (!selectedMode && !input.value.trim()) {
      return; // Don't do anything if no mode selected and input is empty
    }

    // If no mode is selected and there's text in input, treat it as a question
    if (!selectedMode && input.value.trim()) {
      selectedMode = 'question';
    }

    // Show loading state
    sendButton.classList.add('hidden');
    loadingSpinner.classList.add('visible');
    input.disabled = true;
    input.classList.add('loading');
    const originalPlaceholder = input.placeholder;
    input.placeholder = '';

    let loadingText;
    switch (selectedMode) {
      case 'timestamps':
        loadingText = '          Loading timestamps...';
        break;
      case 'summarize':
        loadingText = '          Generating summary...';
        break;
      case 'question':
      default:
        loadingText = '          Getting your answer...';
        break;
    }
    input.value = loadingText;

    try {
      // Here you would make your API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      
      // Handle response...
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request');
    } finally {
      // Reset loading state
      sendButton.classList.remove('hidden');
      loadingSpinner.classList.remove('visible');
      input.disabled = false;
      input.classList.remove('loading');
      input.value = '';
      input.placeholder = originalPlaceholder;
      // Reset mode if it was a question
      if (selectedMode === 'question') {
        selectedMode = null;
      }
    }
  });

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);

  // Append elements
  controls.appendChild(firstRow);
  controls.appendChild(secondRow);
  
  container.appendChild(header);
  container.appendChild(controls);
  container.appendChild(inputContainer);

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
    setTimeout(injectSummarizer, 1000);
  }
}

function handleNavigation() {
  const existingSummarizer = document.getElementById('ai-video-summarizer');
  if (existingSummarizer) {
    existingSummarizer.remove();
  }
  
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