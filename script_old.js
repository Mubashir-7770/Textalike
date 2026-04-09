// Get the text input boxes and buttons
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const compareButton = document.querySelector(".compare-btn");
const clearButton = document.querySelector(".clear-btn");

// Main function to compare texts
function compareTexts() {
    // Get text from both boxes
    const firstText = text1.value.trim();
    const secondText = text2.value.trim();

    // Check if both boxes have text
    if (!firstText || !secondText) {
        return showError("Please enter text in both boxes to compare.");
    }

    // Compare the texts and show results
    const differences = findDifferences(firstText, secondText);
    showResults(differences, firstText, secondText);
}

// Simple character-by-character comparison function
function findDifferences(text1, text2) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < text1.length || j < text2.length) {
        if (i >= text1.length) {
            // Only text2 has remaining characters - they are added
            result.push({ type: 'added', char: text2[j] });
            j++;
        } else if (j >= text2.length) {
            // Only text1 has remaining characters - they are removed  
            result.push({ type: 'removed', char: text1[i] });
            i++;
        } else if (text1[i] === text2[j]) {
            // Characters are the same
            result.push({ type: 'same', char: text1[i] });
            i++;
            j++;
        } else {
            // Characters are different - mark as removed and added
            result.push({ type: 'removed', char: text1[i] });
            result.push({ type: 'added', char: text2[j] });
            i++;
            j++;
        }
    }
    
    return result;
}

// Function to display the comparison results
function showResults(differences, text1, text2) {
    // Remove old results if any
    const oldResults = document.getElementById('results');
    if (oldResults) oldResults.remove();

    // Count changes
    let added = 0, removed = 0, same = 0;
    differences.forEach(diff => {
        if (diff.type === 'added') added++;
        else if (diff.type === 'removed') removed++;
        else same++;
    });

    // Calculate similarity percentage
    const total = added + removed + same;
    const similarity = total > 0 ? Math.round((same / total) * 100) : 100;

    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    resultsDiv.className = 'results-container';

    // Show statistics
    resultsDiv.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <span class="stat-number">${added}</span>
                <span class="stat-label">Characters Added</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${removed}</span>
                <span class="stat-label">Characters Removed</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${similarity}%</span>
                <span class="stat-label">Similarity</span>
            </div>
        </div>
        <div class="comparison-output">
            <div class="output-box">
                <h4>Version 1</h4>
                <div class="char-diff">${createHighlightedText(differences, 'version1')}</div>
            </div>
            <div class="output-box">
                <h4>Version 2</h4>
                <div class="char-diff">${createHighlightedText(differences, 'version2')}</div>
            </div>
        </div>
        <div class="comparison-output">
            <div class="output-box">
                <h4>Version 1</h4>
                <div class="char-diff">${createHighlightedText(differences, 'version1')}</div>
            </div>
            <div class="output-box">
                <h4>Version 2</h4>
                <div class="char-diff">${createHighlightedText(differences, 'version2')}</div>
            </div>
        </div>`;

    // Add results after the buttons
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.insertAdjacentElement('afterend', resultsDiv);
}

// Function to create highlighted text for display
function createHighlightedText(differences, version) {
    let html = '';
    
    differences.forEach(diff => {
        if (version === 'version1') {
            if (diff.type === 'same') {
                html += diff.char;
            } else if (diff.type === 'removed') {
                html += `<span class="char-removed">${diff.char}</span>`;
            }
            // Skip 'added' characters for version1
        } else { // version2
            if (diff.type === 'same') {
                html += diff.char;
            } else if (diff.type === 'added') {
                html += `<span class="char-added">${diff.char}</span>`;
            }
            // Skip 'removed' characters for version2
        }
    });
    
    return html || '<em class="no-content">No content</em>';
}

// Simple error popup function
function showError(message) {
    alert(message); // Simple alert for beginner-friendly version
}

// Clear button function
function clearTexts() {
    text1.value = '';
    text2.value = '';
    const results = document.getElementById('results');
    if (results) results.remove();
}

// Set up button click events
compareButton.addEventListener('click', function(e) {
    e.preventDefault();
    compareTexts();
});

clearButton.addEventListener('click', function(e) {
    e.preventDefault();
    clearTexts();
});