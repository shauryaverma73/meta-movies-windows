// SELECTORS
const loginForm = document.querySelector('#loginForm');
const logoutBtn = document.querySelector('#logoutBtn');

const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const forgotBtn = document.querySelector('#forgotSubmit');

const signupForm = document.querySelector('#signupForm');
const signupBtn = document.querySelector('#singupBtn');


// ADDITIONAL METHODS
const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.parentElement.removeChild(alert);
    }
};

const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};


// METHODS
const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/user/login',
            data: {
                email: email,
                password: password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/user/logout'
        });

        if (res.data.status === 'success') {
            location.assign('/');
        }
    } catch (err) {
        showAlert('error', 'Error Logout, Try Again');
    }

};

const forgotPassword = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/user/forgotPassword',
            data: {
                email: email
            }
        });
        console.log(res);
        if (res.data.status === 'success') {
            showAlert('success', 'Password reset email has been sent to your regisered email id');
            window.setTimeout(() => {
                location.assign('/');
            }, 2500);
        }
    } catch (err) {
        showAlert('error', 'Error Forget Password');
    }
};

const signUp = async (name, email, password, confirmPassword) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/user/signup',
            data: {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        });
        console.log(res);
        if (res.data.status === 'success') {
            showAlert('success', 'Successfully Registered');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Error Registering');
    }
};

// ACTIONS
if (loginForm) {
    document.querySelector('.sign__btn').addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

if (forgotPasswordForm) {
    forgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
    });
}

if (signupForm) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        signUp(name, email, password, confirmPassword);
    });
}