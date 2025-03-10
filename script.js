function calculate() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const currentRate = parseFloat(document.getElementById('currentRate').value);
    const newRate = parseFloat(document.getElementById('newRate').value);
    const years = parseInt(document.getElementById('years').value);
    const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;

    // Validate inputs
    if (!loanAmount || !currentRate || !newRate || !years) {
        alert("Please fill in all required fields");
        return;
    }

    // Calculate all scenarios
    const current = calculateAmortization(loanAmount, currentRate, years);
    const newPlan = calculateAmortization(loanAmount, newRate, years);
    const withExtra = calculateAmortization(loanAmount, newRate, years, extraPayment);

    // Calculate differences
    const interestSaved = (current.totalInterest - newPlan.totalInterest).toFixed(2);
    const monthlySavings = (current.monthlyPayment - newPlan.monthlyPayment).toFixed(2);
    const extraInterestSaved = (newPlan.totalInterest - withExtra.totalInterest).toFixed(2);
    const extraPrincipalPaid = (withExtra.totalPrincipal - newPlan.totalPrincipal).toFixed(2);

    // Display results
    document.getElementById('currentResults').innerHTML = `
        Monthly Payment: $${current.monthlyPayment}<br>
        Total Interest (${years} yrs): $${current.totalInterest}<br>
        Total Principal Paid: $${current.totalPrincipal}
    `;

    document.getElementById('newResults').innerHTML = `
        Monthly Payment: $${newPlan.monthlyPayment}<br>
        Total Interest (${years} yrs): $${newPlan.totalInterest}<br>
        Total Principal Paid: $${newPlan.totalPrincipal}<br>
        <strong>Monthly Savings:</strong> $${monthlySavings}<br>
        <strong>Total Interest Saved:</strong> $${interestSaved}
    `;

    document.getElementById('extraResults').innerHTML = `
        New Monthly Payment: $${(parseFloat(newPlan.monthlyPayment) + extraPayment).toFixed(2)}<br>
        Total Interest Saved with Extra: $${extraInterestSaved}<br>
        Additional Principal Paid: $${extraPrincipalPaid}<br>
        Total Principal Paid: $${withExtra.totalPrincipal}
    `;
}

function calculateAmortization(principal, annualRate, years, extraPayment = 0) {
    const monthlyRate = annualRate / 1200;
    const months = years * 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    let currentPrincipal = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    for (let month = 1; month <= months; month++) {
        if (currentPrincipal <= 0) break;
        
        const interest = currentPrincipal * monthlyRate;
        const basePrincipalPayment = monthlyPayment - interest;
        const totalPayment = monthlyPayment + extraPayment;
        const principalPayment = Math.min(basePrincipalPayment + extraPayment, currentPrincipal);
        
        totalInterest += interest;
        totalPrincipal += principalPayment;
        currentPrincipal -= principalPayment;
    }
    
    return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPrincipal: totalPrincipal.toFixed(2)
    };
}
