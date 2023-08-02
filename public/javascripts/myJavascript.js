function myloginFunc() {
    let loginData = {
        username: document.getElementById('user').value,
        password: document.getElementById('pass').value
    };

    let myxhttp = new XMLHttpRequest();

    myxhttp.open('POST', '/login');
    myxhttp.setRequestHeader('content-type', 'application/json');
    myxhttp.send(JSON.stringify(loginData));
}


function mySignUpFunc(){
    let signUpData = {
        username: document.getElementById('userSignUp').value,
        password: document.getElementById('passSignUp').value
    };

    let myxhttp = new XMLHttpRequest();
    myxhttp.open('POST', '/signup');
    myxhttp.setRequestHeader('content-type', 'application/json');
    myxhttp.send(JSON.stringify(signUpData));
}

Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!',
        userData: {
            username: 'empty',
            password: 'empty'
        },
        users: []
      };
    },
    methods: {
      seeUsers() {
        let vm = this;
        let myxhttp = new XMLHttpRequest();
        myxhttp.onreadystatechange = function(){
            if(myxhttp.readyState == 4 || myxhttp.readyState == 200){
                let getResponse = JSON.parse(JSON.stringify(myxhttp.responseText));
                vm.message = getResponse;
            }
        };
        myxhttp.open('GET', '/userList', true);
        myxhttp.send();
      }
    }
  }).mount('#signUpID');