console.log("Content script loaded for YouTube");

function createWhiteSquare() {
  const square = document.createElement('div');
  square.id = 'yt-extension-square';
  square.style.cssText = `
    width: 100%;
    height: 200px;
    background-color: white;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  return square;
}

function injectSquare() {
  const relatedSection = document.querySelector('#related.style-scope.ytd-watch-flexy');
  if (relatedSection) {
    const square = createWhiteSquare();
    relatedSection.insertAdjacentElement('afterbegin', square);
    console.log('Square injected successfully');
  } else {
    setTimeout(injectSquare, 1000);
  }
}

// Start injection process
injectSquare(); 