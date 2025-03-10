function calculate() {
    // Get input values
    const principal = parseFloat(document.getElementById('principal').value);
    const years = parseFloat(document.getElementById('years').value);
    const currentRate = parseFloat(document.getElementById('currentRate').value)/100;
    const newRate = parseFloat(document.getElementById('newRate').value)/100;
    const weeklyPayment = parseFloat(document.getElementById('weeklyPayment').value);

    // Calculate monthly equivalents
    const months = years * 12;
    const monthlyPaymentCurrent = calculateMonthlyPayment(principal, currentRate, years);
    const monthlyPaymentNew = calculateMonthlyPayment(principal, newRate, years);
    const keptMonthlyPayment = weeklyPayment * 52 / 12;

    // Calculate savings and extra principal
    const currentInterest = calculateTotalInterest(principal, currentRate, monthlyPaymentCurrent);
    const newInterestMinimum = calculateTotalInterest(principal, newRate, monthlyPaymentNew);
    const newInterestKept = calculateTotalInterest(principal, newRate, keptMonthlyPayment);
    
    // Build results
    let resultsHTML = `
        <div class="result-item">
            <h3>Original Payment (${currentRate*100}%):</h3>
            $${monthlyPaymentCurrent.toFixed(2)}/month
        </div>

        <div class="result-item">
            <h3>New Minimum Payment (${newRate*100}%):</h3>
            $${monthlyPaymentNew.toFixed(2)}/month
            <div class="savings">($${(monthlyPaymentCurrent - monthlyPaymentNew).toFixed(2)}/month savings available)</div>
        </div>`;

    if (keptMonthlyPayment > monthlyPaymentNew) {
        const extraPrincipal = keptMonthlyPayment - monthlyPaymentNew;
        const interestSaved = currentInterest - newInterestKept;
        const principalPaidExtra = (keptMonthlyPayment - monthlyPaymentNew) * 12 * years;
        
        resultsHTML += `
            <div class="result-item savings">
                <h3>By Keeping Payments at $${weeklyPayment}/week ($${keptMonthlyPayment.toFixed(2)}/month):</h3>
                <div>Extra Principal Paid Monthly: $${extraPrincipal.toFixed(2)}</div>
                <div>Total Interest Saved: $${interestSaved.toFixed(2)}</div>
                <div>Total Principal Accelerated: $${principalPaidExtra.toFixed(2)}</div>
            </div>`;
    } else {
        resultsHTML += `
            <div class="result-item warning">
                Warning: Your current payment is below the new minimum payment
            </div>`;
    }

    document.getElementById('results').innerHTML = resultsHTML;
}

function calculateMonthlyPayment(principal, rate, years) {
    const monthlyRate = rate / 12;
    const months = years * 12;
    return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

function calculateTotalInterest(principal, rate, monthlyPayment) {
    let balance = principal;
    let totalInterest = 0;
    const monthlyRate = rate / 12;
    
    while (balance > 0) {
        const interest = balance * monthlyRate;
        totalInterest += interest;
        const principalPayment = monthlyPayment - interest;
        balance -= principalPayment;
    }
    
    return totalInterest;
}
