// Accessible form handling for the waitlist
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waitlistForm');
    if (!form) return;

    const email = document.getElementById('email');
    const submitBtn = form.querySelector('button[type="submit"]');
    const success = document.getElementById('successMessage');

    const setBusy = (isBusy) => {
        if (submitBtn) submitBtn.disabled = isBusy;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!email) return;
        const value = email.value.trim();

        if (!isValidEmail(value)) {
            // reportValidity gives a native hint if available
            if (typeof email.reportValidity === 'function') {
                email.reportValidity();
            } else {
                alert('Please enter a valid email address.');
            }
            return;
        }

        setBusy(true);
        const originalText = submitBtn?.textContent;
        if (submitBtn) submitBtn.textContent = 'Joining…';

        try {
            // TODO: replace with your real API endpoint
            await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value }),
            });

            form.reset();
            // Hide form and show accessible success region
            form.style.display = 'none';
            if (success) {
                success.hidden = false;
                // Move focus to success message for screen readers
                success.focus && success.focus();
            }
        } catch (err) {
            console.error(err);
            // Non-intrusive inline error could be implemented here.
            alert('Something went wrong — please try again.');
        } finally {
            setBusy(false);
            if (submitBtn) submitBtn.textContent = originalText || 'Join the Waitlist';
        }
    });

    function isValidEmail(v) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v);
    }
});