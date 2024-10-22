document.getElementById('logout-button')?.addEventListener('click', async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        const res = await fetch('http://localhost:8000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (res.status === 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = 'login.html';
        } else {
            alert('Logout failed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
