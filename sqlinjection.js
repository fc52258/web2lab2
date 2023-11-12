document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkbox1 = document.getElementById('checkbox1');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //console.log(checkbox1)

    if(checkbox1.checked){
        authenticateUser(username, password);
    }else{
        authenticateUserStrong(username, password);
    }
});

function authenticateUser(username, password) {
    fetch('https://web2lab2-ukts.onrender.com/auth', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data.userId, data.userName, data.passWord)
        if (data.success) {
        alert(`Uspješna prijava!\nInfo dohvata iz baze: "user_id: ${data.userId}, username: ${data.userName}, pass: ${data.passWord}"`);
        } else {
        alert('Neuspješna prijava. Provjeri korisničko ime i šifru.');
        }
    })
    .catch(error => {
        console.error('Greška:', error);
    });
}


function authenticateUserStrong(username, password) {
        fetch('https://web2lab2-ukts.onrender.com/authStrong', {
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
            alert('Neuspješna prijava. Provjeri korisničko ime i šifru.');
            }
        })
        .catch(error => {
            console.error('Greška:', error);
        });
    }
    