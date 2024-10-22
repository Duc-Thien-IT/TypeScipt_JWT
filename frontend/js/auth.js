document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:8000/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.status === 200) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken); // Lưu refresh token nếu cần
            window.location.href = 'index.html';
        } else {
            alert(data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (res.status === 200) {
            alert('Registration successful. Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
