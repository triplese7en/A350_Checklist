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
