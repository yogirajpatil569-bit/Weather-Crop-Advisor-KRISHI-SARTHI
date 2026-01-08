function showMessage(message, isError = false) {
    const el = document.getElementById('messageBox');
    el.innerText = message;
    el.style.display = 'block';
    el.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    setTimeout(() => el.style.display = 'none', 3500);
}

let isLoginMode = true;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('form-subtitle');
    const authButton = document.getElementById('auth-button');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const toggleText = document.getElementById('toggle-text');

    if (isLoginMode) {
        title.innerText = 'Login to Advisory';
        subtitle.innerText = 'Access personalized weather-based crop advice.';
        authButton.innerText = 'Login';
        confirmPasswordGroup.classList.add('hidden');
        document.getElementById('confirm-password').removeAttribute('required');
        toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-auth-mode" class="text-green-400 hover:text-green-300 font-medium transition duration-150">Sign Up</a>`;
    } else {
        title.innerText = 'Create an Account';
        subtitle.innerText = 'Join KRISHI SARATHI and get started with smart farming.';
        authButton.innerText = 'Sign Up';
        confirmPasswordGroup.classList.remove('hidden');
        document.getElementById('confirm-password').setAttribute('required', 'required');
        toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-auth-mode" class="text-green-400 hover:text-green-300 font-medium transition duration-150">Login</a>`;
    }
    document.getElementById('toggle-auth-mode').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });
}


function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email || !password) {
        showMessage("Please enter both email and password.", true);
        return;
    }

    if (!isLoginMode && password !== confirmPassword) {
        showMessage("Passwords do not match.", true);
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         showMessage("Please enter a valid email address.", true);
         return;
    }

    const action = isLoginMode ? 'Login' : 'Account created';
    showMessage(`${action} successful for ${email}! Redirecting...`, false);

    setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'advisory.html';
    }, 1000);
}

window.addEventListener('load', () => {
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    document.getElementById('toggle-auth-mode').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });
});