// Wait for page to load before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get the text input boxes and buttons
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const compareButton = document.querySelector(".compare-btn");
    const clearButton = document.querySelector(".clear-btn");

    // Debug: Check if elements are found
    console.log('text1:', text1);
    console.log('text2:', text2);
    console.log('compareButton:', compareButton);
    console.log('clearButton:', clearButton);

    // Main function to compare texts
    function compareTexts() {
        const firstText = text1.value.trim();
        const secondText = text2.value.trim();

        // Check different error conditions with specific messages
        if (!firstText && !secondText) {
            showError("Please enter text in both fields to compare.");
            return;
        }
        if (!firstText) {
            showError("Please enter text in Version 1 field.");
            return;
        }
        if (!secondText) {
            showError("Please enter text in Version 2 field.");
            return;
        }

        // Compare the texts word by word and show results
        const differences = findDifferences(firstText, secondText);
        showResults(differences);
    }

    // Clear button function
    function clearTexts() {
        text1.value = '';
        text2.value = '';
        const results = document.getElementById('results');
        if (results) {
            results.remove();
        }
    }

    // Set up button click events
    compareButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Compare button clicked!');
        compareTexts();
    });

    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Clear button clicked!');
        clearTexts();
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-popup';
        
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.marginBottom = '15px';
        
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.className = 'error-ok-button';
        okButton.onclick = () => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        };
        
        errorDiv.appendChild(messageDiv);
        errorDiv.appendChild(okButton);
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds if user doesn't click OK
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

});

// Simple word-by-word comparison function

    function findDifferences(text1, text2) {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    const result = [];
    
    let i = 0, j = 0;
    
    while (i < words1.length || j < words2.length) {
        if (i >= words1.length) {
            // Only text2 has remaining words - they are added
            result.push({ type: 'added', word: words2[j] });
            j++;
        } else if (j >= words2.length) {
            // Only text1 has remaining words - they are removed
            result.push({ type: 'removed', word: words1[i] });
            i++;
        } else if (words1[i] === words2[j]) {
            // Words are the same
            result.push({ type: 'same', word: words1[i] });
            i++;
            j++;
        } else {
            // Words are different - mark as removed and added
            result.push({ type: 'removed', word: words1[i] });
            result.push({ type: 'added', word: words2[j] });
            i++;
            j++;
        }
    }
    
    return result;
}

// Function to display the comparison results
function showResults(differences){
    // Remove old results if any
    const oldResults = document.getElementById('results');
    if (oldResults) oldResults.remove();

    // Count changes
    let added = 0, removed = 0, same = 0;
    for (let i = 0; i < differences.length; i++) {
        if (differences[i].type === 'added') {
            added++;
        } else if (differences[i].type === 'removed') {
            removed++;
        } else {
            same++;
        }
    }

    // Calculate similarity percentage
    const total = added + removed + same;
    let similarity;
    if (total > 0) {
        similarity = Math.round((same / total) * 100);
    } else {
        similarity = 100;
    }

    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    resultsDiv.className = 'results-container';

    // Show statistics and comparison
    let statsHTML = '<div class="stats-container">';
    statsHTML += '<div class="stat-item">';
    statsHTML += '<span class="stat-number">' + added + '</span>';
    statsHTML += '<span class="stat-label">Words Added</span>';
    statsHTML += '</div>';
    statsHTML += '<div class="stat-item">';
    statsHTML += '<span class="stat-number">' + removed + '</span>';
    statsHTML += '<span class="stat-label">Words Removed</span>';
    statsHTML += '</div>';
    statsHTML += '<div class="stat-item">';
    statsHTML += '<span class="stat-number">' + similarity + '%</span>';
    statsHTML += '<span class="stat-label">Similarity</span>';
    statsHTML += '</div>';
    statsHTML += '</div>';
    
    let outputHTML = '<div class="comparison-output">';
    outputHTML += '<div class="output-box">';
    outputHTML += '<h4>Version 1</h4>';
    outputHTML += '<div class="char-diff">' + createHighlightedText(differences, 'version1') + '</div>';
    outputHTML += '</div>';
    outputHTML += '<div class="output-box">';
    outputHTML += '<h4>Version 2</h4>';
    outputHTML += '<div class="char-diff">' + createHighlightedText(differences, 'version2') + '</div>';
    outputHTML += '</div>';
    outputHTML += '</div>';
    
    resultsDiv.innerHTML = statsHTML + outputHTML;

        // Add results after the buttons
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.appendChild(resultsDiv);
}

// Function to create highlighted text for display
function createHighlightedText(differences, version) {
    let html = '';
    
    for (let i = 0; i < differences.length; i++) {
        const diff = differences[i];
        
        if (version === 'version1') {
            if (diff.type === 'same') {
                html += diff.word + ' ';
            } else if (diff.type === 'removed') {
                html += '<span class="word-removed">' + diff.word + '</span> ';
            }
            // Skip 'added' words for version1
        } else {
            // version2
            if (diff.type === 'same') {
                html += diff.word + ' ';
            } else if (diff.type === 'added') {
                html += '<span class="word-added">' + diff.word + '</span> ';
            }
            // Skip 'removed' words for version2
        }
    }
    
    if (html === '') {
        return 'No content';
    } else {
        return html;
    }
}