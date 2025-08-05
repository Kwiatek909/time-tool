// DOM Elements
const time1Input = document.getElementById('time1');
const time2Input = document.getElementById('time2');
const calculateBtn = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');
const resultDisplay = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// Parse time string to milliseconds
function parseTime(timeStr) {
    try {
        const parts = timeStr.split('.');
        if (parts.length !== 3) return null;
        
        const minutes = parseInt(parts[0]);
        const seconds = parseInt(parts[1]);
        const milliseconds = parseInt(parts[2]);
        
        if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) return null;
        
        const totalMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        return totalMs;
    } catch {
        return null;
    }
}

// Format milliseconds to time string
function formatTime(totalMs) {
    const minutes = Math.floor(totalMs / (60 * 1000));
    const remainingMs = totalMs % (60 * 1000);
    const seconds = Math.floor(remainingMs / 1000);
    const milliseconds = remainingMs % 1000;
    return `${minutes}.${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Calculate function
function calculate() {
    const time1 = time1Input.value.trim();
    const time2 = time2Input.value.trim();
    
    const ms1 = parseTime(time1);
    const ms2 = parseTime(time2);
    
    if (ms1 === null || ms2 === null) {
        showToast('Niepoprawny format czasu. Użyj formatu mm.ss.mmm', 'error');
        return;
    }
    
    const sum = ms1 + ms2;
    const formattedResult = formatTime(sum);
    
    resultDisplay.textContent = formattedResult;
    resultSection.style.display = 'flex';
}

// Copy result to clipboard
async function copyResult() {
    const result = resultDisplay.textContent;
    if (result) {
        try {
            await navigator.clipboard.writeText(result);
            showToast('Skopiowano!');
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = result;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Skopiowano!');
        }
    }
}

// Event listeners
calculateBtn.addEventListener('click', calculate);
copyBtn.addEventListener('click', copyResult);

// Allow Enter key to calculate
time1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
});

time2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
});