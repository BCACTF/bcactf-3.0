const unameElem = document.getElementById("uname");
const pwdElem = document.getElementById("pwd");

document.addEventListener('keyup', (e)=>{
    switch (e.key) {
        case "Enter":
            handleInput();
            break;
    }
});

function handleInput() {
    let uname=unameElem.value;
    if (uname != "admin") {
        alert("You're not admin");
        return;
    }

    let pwd = pwdElem.value;
    let encodedPwd = fancyEncode(pwd);

    setCookie("pwd", encodedPwd, 365);

    window.location.replace("adminEditor.html");

}

//dont worry about the intricacies of the setCookie and getCookie functions
//just understand what they do and how to use them 
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;samesite=None;secure;";
}
function getCookie(cookiename) {
    let name = cookiename + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function fancyEncode(str) {
    let newString = "";
    for (i=0;i<=str.length-1;i++) {
        newString += str.charCodeAt(i) + "e";
    }
    return newString;
}