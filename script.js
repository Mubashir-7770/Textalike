// Get DOM elements
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const compareButton = document.querySelector(".compare-btn");
const clearButton = document.querySelector(".clear-btn");

// Main comparison function
function compareTexts() {
    const version1 = text1.value.trim();
    const version2 = text2.value.trim();

    if (!version1 && !version2) {
        showError("Please enter text in both fields to compare.");
        return;
    }

    // Don't compare if only one box has text
    if (!version1) {
        showError("Please enter text in Version 1");
        return;
    }
    
    if (!version2) {
        showError("Please enter text in Version 2");
        return;
    }

    // Split into words
    const words1 = version1.split(/(\s+)/); // Keep spaces
    const words2 = version2.split(/(\s+)/);

    // Create highlighted versions
    const highlighted1 = highlightDifferences(words1, words2, 'removed');
    const highlighted2 = highlightDifferences(words2, words1, 'added');

    // Calculate similarity
    const similarity = calculateSimilarity(version1, version2);

    // Display results
    displayResult(highlighted1, highlighted2, similarity);
}

// Show error messages
function showError(message) {
    clearResults(); // Remove any existing results
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'error-overlay';
    overlay.id = 'error-overlay';
    
    // Create error container
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-container';
    
    errorDiv.innerHTML = `
        <div class="error-header">
            <button class="error-cross" onclick="closeError()">&times;</button>
        </div>
        <div class="error-content">
            <div class="error-message">
                <p>⚠️ ${message}</p>
                <button class="error-close" onclick="closeError()">OK</button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(overlay);
    document.body.appendChild(errorDiv);
    
    // Close on overlay click
    overlay.addEventListener('click', closeError);
}

// Close error popup
function closeError() {
    const errorDiv = document.getElementById('error-message');
    const overlay = document.getElementById('error-overlay');
    
    if (errorDiv) errorDiv.remove();
    if (overlay) overlay.remove();
}

// Clear results
function clearResults() {
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    const overlay = document.getElementById('error-overlay');
    
    if (resultsDiv) {
        resultsDiv.remove();
    }
    if (errorDiv) {
        errorDiv.remove();
    }
    if (overlay) {
        overlay.remove();
    }
}

// Highlight differences
function highlightDifferences(wordsA, wordsB, className) {
    return wordsA.map(word => {
        // Skip whitespace
        if (/^\s+$/.test(word)) {
            return word;
        }
        
        // Check if word exists in other text
        const cleanWordA = word.toLowerCase().trim();
        const wordExists = wordsB.some(w => w.toLowerCase().trim() === cleanWordA);
        
        if (!wordExists && word.trim()) {
            return `<span class="${className}">${escapeHtml(word)}</span>`;
        }
        return escapeHtml(word);
    }).join('');
}

// Calculate similarity percentage
function calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    if (words1.length === 0 && words2.length === 0){
        print("Please enter text in both fields to compare.");
        return 100;
    }
    if (words1.length === 0 || words2.length === 0){
        print("Please enter text in both fields to compare.");
        return 0;
    }
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return Math.round((commonWords.length / totalWords) * 100);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display results
function displayResult(highlighted1, highlighted2, similarity) {
    let resultsDiv = document.getElementById('results');
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'results';
        resultsDiv.className = 'results-container';
        
        const buttonContainer = document.querySelector('.button-container');
        buttonContainer.after(resultsDiv);
    }
    
    resultsDiv.innerHTML = `
        <div class="similarity-score">
            <h3>Similarity: ${similarity}%</h3>
        </div>
        <div class="comparison-output">
            <div class="output-box">
                <h4>Original Text (Version 1)</h4>
                <div class="output">${highlighted1}</div>
            </div>
            <div class="output-box">
                <h4>Modified Text (Version 2)</h4>
                <div class="output">${highlighted2}</div>
            </div>
        </div>
        <div class="legend">
            <span><span class="removed">Red</span> = Removed</span>
            <span><span class="added">Green</span> = Added</span>
        </div>
    `;
}

// Event listeners
compareButton.addEventListener('click', function(e) {
    e.preventDefault();
    compareTexts();
});

clearButton.addEventListener('click', function(e) {
    e.preventDefault();
    text1.value = '';
    text2.value = '';
    clearResults();
});