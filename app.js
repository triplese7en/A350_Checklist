// ============================================
// SCRATCHPAD FUNCTIONALITY
// ============================================
// Scratchpad functionality
let canvas, ctx, isDrawing = false;
let currentColor = '#e5e7eb';
let lastX = 0, lastY = 0;

// Initialize scratchpad
function initScratchpad() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        loadDrawing(); // Reload drawing after resize
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for iPad/Apple Pencil
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Load saved data
    loadNotes();
    loadDrawing();
}

function toggleScratchpad() {
    const panel = document.getElementById('scratchpadPanel');
    panel.classList.toggle('open');
    
    // If opening and draw tab is active, resize canvas
    if (panel.classList.contains('open')) {
        setTimeout(() => {
            const drawTab = document.getElementById('drawTab');
            if (drawTab && drawTab.classList.contains('active') && canvas) {
                const container = canvas.parentElement;
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                loadDrawing();
            }
        }, 300);
    }
}

function switchTab(tab, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    if (tab === 'notes') {
        document.getElementById('notesTab').classList.add('active');
    } else {
        document.getElementById('drawTab').classList.add('active');
        // Resize canvas when switching to draw tab
        setTimeout(() => {
            if (canvas) {
                const container = canvas.parentElement;
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                loadDrawing();
            }
        }, 100);
    }
}

// Notes functionality
function loadNotes() {
    const notes = localStorage.getItem('scratchpadNotes');
    if (notes) {
        document.getElementById('scratchpadNotes').value = notes;
    }
}

function saveNotes() {
    const notes = document.getElementById('scratchpadNotes').value;
    try {
        localStorage.setItem('scratchpadNotes', notes);
    } catch (e) {
        console.error('Failed to save notes - storage quota exceeded:', e);
        // Only show alert once to avoid spam on every keystroke
        if (!window.notesStorageAlertShown) {
            alert('Could not save notes - storage space full');
            window.notesStorageAlertShown = true;
        }
    }
}

// Auto-save notes on input
document.addEventListener('DOMContentLoaded', function() {
    initScratchpad();
    const textarea = document.getElementById('scratchpadNotes');
    if (textarea) {
        textarea.addEventListener('input', saveNotes);
    }
});

// Drawing functionality
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveDrawingToStorage();
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    // Account for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    lastX = (touch.clientX - rect.left) * scaleX;
    lastY = (touch.clientY - rect.top) * scaleY;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    // Account for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

function handleTouchEnd(e) {
    e.preventDefault();
    stopDrawing();
}

function setDrawColor(color, element) {
    currentColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('scratchpadDrawing');
}

function saveDrawingToStorage() {
    const dataURL = canvas.toDataURL();
    try {
        localStorage.setItem('scratchpadDrawing', dataURL);
    } catch (e) {
        console.error('Failed to save drawing - storage quota exceeded:', e);
        alert('Could not save drawing - image too large for storage');
    }
}

function loadDrawing() {
    const dataURL = localStorage.getItem('scratchpadDrawing');
    if (dataURL) {
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataURL;
    }
}

function saveDrawing() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'scratchpad-' + new Date().toISOString().slice(0,10) + '.png';
    link.href = dataURL;
    link.click();
}

// Collapsible sections
function toggleSection(sectionId, event) {
    const group = document.getElementById(sectionId + '-group');
    const header = event ? event.currentTarget : null;
    
    group.classList.toggle('collapsed');
    if (header) {
        header.classList.toggle('collapsed');
    }
}

// Timer variables
let referenceTime = null;
let timerInterval = null;

// Update Zulu time
function updateZuluTime() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('zuluTime').textContent = `${hours}:${minutes}:${seconds}Z`;
}

// Update countdown timer
function updateCountdown() {
    if (!referenceTime) {
        document.getElementById('countdown').textContent = 'T+ 00:00:00';
        document.getElementById('countdown').className = 'ecam-countdown';
        return;
    }
    
    const now = new Date();
    const diff = Math.floor((now - referenceTime) / 1000); // difference in seconds
    const absDiff = Math.abs(diff);
    
    const hours = Math.floor(absDiff / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);
    const seconds = absDiff % 60;
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const prefix = diff < 0 ? 'T- ' : 'T+ ';
    
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = prefix + timeStr;
    
    // Update color based on T- or T+
    if (diff < 0) {
        countdownEl.className = 'ecam-countdown negative';
    } else {
        countdownEl.className = 'ecam-countdown positive';
    }
}

// Start timers
setInterval(updateZuluTime, 1000);
setInterval(updateCountdown, 1000);
updateZuluTime();
updateCountdown();

// Modal functions
function openTimerModal() {
    document.getElementById('timerModal').style.display = 'block';
    
    // Pre-fill with current reference time if set
    if (referenceTime) {
        const hours = referenceTime.getUTCHours();
        const minutes = referenceTime.getUTCMinutes();
        const seconds = referenceTime.getUTCSeconds();
        document.getElementById('hourInput').value = String(hours).padStart(2, '0');
        document.getElementById('minuteInput').value = String(minutes).padStart(2, '0');
        document.getElementById('secondInput').value = String(seconds).padStart(2, '0');
    } else {
        // Default to current time
        const now = new Date();
        document.getElementById('hourInput').value = String(now.getUTCHours()).padStart(2, '0');
        document.getElementById('minuteInput').value = String(now.getUTCMinutes()).padStart(2, '0');
        document.getElementById('secondInput').value = String(now.getUTCSeconds()).padStart(2, '0');
    }
}

function closeTimerModal() {
    document.getElementById('timerModal').style.display = 'none';
}

function setTimer() {
    const hours = parseInt(document.getElementById('hourInput').value) || 0;
    const minutes = parseInt(document.getElementById('minuteInput').value) || 0;
    const seconds = parseInt(document.getElementById('secondInput').value) || 0;
    
    // Create reference time in UTC
    const now = new Date();
    referenceTime = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        hours,
        minutes,
        seconds
    ));
    
    updateCountdown();
    closeTimerModal();
}

function resetTimer() {
    referenceTime = null;
    updateCountdown();
    closeTimerModal();
}

function setQuickTime(minutesFromNow) {
    const now = new Date();
    const targetTime = new Date(now.getTime() + minutesFromNow * 60000);
    
    document.getElementById('hourInput').value = String(targetTime.getUTCHours()).padStart(2, '0');
    document.getElementById('minuteInput').value = String(targetTime.getUTCMinutes()).padStart(2, '0');
    document.getElementById('secondInput').value = String(targetTime.getUTCSeconds()).padStart(2, '0');
}

// Close modal when clicking outside
function handleModalClick(event) {
    const modal = document.getElementById('timerModal');
    if (event.target === modal) {
        closeTimerModal();
    }
}

// Remove if exists, then add (prevents duplicate listeners on hot-reload)
window.removeEventListener('click', handleModalClick);
window.addEventListener('click', handleModalClick);

// Checklist functionality
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const totalItems = checkboxes.length;

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const item = this.closest('.checklist-item');
        const status = item.querySelector('.item-status');
        
        if (this.checked) {
            item.classList.add('completed');
            status.textContent = 'DONE';
            status.classList.remove('status-pending');
            status.classList.add('status-complete');
        } else {
            item.classList.remove('completed');
            status.textContent = 'PEND';
            status.classList.remove('status-complete');
            status.classList.add('status-pending');
        }
        
        updateProgress();
    });
});

function updateProgress() {
    // Update PRELIM section
    const prelimCheckboxes = document.querySelectorAll('#prelim-group input[type="checkbox"]');
    const prelimChecked = document.querySelectorAll('#prelim-group input[type="checkbox"]:checked').length;
    const prelimTotal = prelimCheckboxes.length;
    const prelimPercentage = (prelimChecked / prelimTotal) * 100;
    document.getElementById('prelimProgressBar').style.width = prelimPercentage + '%';
    document.getElementById('prelimProgressText').textContent = `${prelimChecked}/${prelimTotal} Complete`;
    
    // Update CRZ section
    const crzCheckboxes = document.querySelectorAll('#crz-group input[type="checkbox"]');
    const crzChecked = document.querySelectorAll('#crz-group input[type="checkbox"]:checked').length;
    const crzTotal = crzCheckboxes.length;
    const crzPercentage = (crzChecked / crzTotal) * 100;
    document.getElementById('crzProgressBar').style.width = crzPercentage + '%';
    document.getElementById('crzProgressText').textContent = `${crzChecked}/${crzTotal} Complete`;
    
    // Update DESCENT section
    const descentCheckboxes = document.querySelectorAll('#descent-group input[type="checkbox"]');
    const descentChecked = document.querySelectorAll('#descent-group input[type="checkbox"]:checked').length;
    const descentTotal = descentCheckboxes.length;
    const descentPercentage = (descentChecked / descentTotal) * 100;
    document.getElementById('descentProgressBar').style.width = descentPercentage + '%';
    document.getElementById('descentProgressText').textContent = `${descentChecked}/${descentTotal} Complete`;
}

function resetChecklist() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const item = checkbox.closest('.checklist-item');
        const status = item.querySelector('.item-status');
        
        item.classList.remove('completed');
        status.textContent = 'PEND';
        status.classList.remove('status-complete');
        status.classList.add('status-pending');
    });
    
    updateProgress();
}

// Collapse all sections on initial load
function initializeCollapsedSections() {
    const allGroups = document.querySelectorAll('.checklist-group');
    const allHeaders = document.querySelectorAll('.phase-header');
    
    allGroups.forEach(group => {
        group.classList.add('collapsed');
    });
    
    allHeaders.forEach(header => {
        header.classList.add('collapsed');
    });
}

// Initialize collapsed sections on page load
window.addEventListener('DOMContentLoaded', initializeCollapsedSections);

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
