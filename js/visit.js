document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('fieldset');
    const dateInput = document.getElementById('rdate');
    const timeSelect = document.getElementById('rtime');
    const visitorsInput = document.getElementById('rnum');
    const submitBtn = document.querySelector('input[type="submit"]');
    const resetBtn = document.querySelector('input[type="reset"]');
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.display = 'none';
    errorDiv.style.color = 'red';
    form.appendChild(errorDiv);
    
    function showError(text) {
        errorDiv.textContent = text;
        errorDiv.style.display = 'block';
    }
    
    function hideError() {
        errorDiv.style.display = 'none';
    }
    
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        hideError(); 
        
        if (!dateInput.value) {
            showError('Date not completed, please re-enter.');
            return;
        }
        
        if (!timeSelect.value) {
            showError('Please select a time slot.');
            return;
        }
        
        const visitorsValue = visitorsInput.value.trim();
        if (!visitorsValue) {
            showError('Please enter number of visitors.');
            return;
        }
        
        const visitorsNum = parseInt(visitorsValue);
        
        if (isNaN(visitorsNum) || !Number.isInteger(visitorsNum) || visitorsNum < 1) {
            showError('Please enter a valid number of people!');
            return;
        }
        
        const timeText = timeSelect.options[timeSelect.selectedIndex].text;
        
        try {
            const result = reserve(dateInput.value, timeText, visitorsNum);
            
            if (result === true) {
                alert('Your reservation is successful!');
            } else {
                alert('Sorry, the reservation is full!');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred. Please try again.');
        }
    });
    
    resetBtn.addEventListener('click', function() {
        hideError();
    });
});