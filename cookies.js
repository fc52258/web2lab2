

document.getElementById('loginForm2').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkbox2 = document.getElementById('checkbox2');
    const username2 = document.getElementById('username2').value;
    const password2 = document.getElementById('password2').value;
    //console.log(checkbox1)
    setSessionId();
    if(checkbox2.checked){
        authenticateUserCookie(username2, password2);
    }else{
        authenticateUserCookieStrong(username2, password2);
    }
});

function getSessionId() {
    const cookieArray = document.cookie.split(';');
    for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'sessionId') {
            return value;
        }
    }
    return null;
    }

function setSessionId() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(
        data => {
            //console.log(data.message, data.sessionId);
            document.cookie = `sessionId=${data.sessionId}; path=/; maxAge=1000; secure=true; httpOnly=false;`;
            //console.log(getSessionId());
        }
        )
      .catch(error => console.error('Error:', error));
}

function authenticateUserCookie(username, password) {
    fetch('http://localhost:3000/authCookie', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Uspješna prijava!');
        } else {
        alert(data.message);
        }
    })
    .catch(error => {
        console.error('Greška:', error);
    });
}


function authenticateUserCookieStrong(username, password) {
    const sessionId = getSessionId();
    fetch('http://localhost:3000/authCookieStrong', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, sessionId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Uspješna prijava!');
        } else {
        alert('Neuspješna prijava. Provjeri korisničko ime i šifru.');
        }
    })
    .catch(error => {
        console.error('Greška:', error);
    });
    }
    