function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}




let checkCurrentUser = function () {

    let myCookie = getCookie("login_session");
    let clientInfo

    if (myCookie == null) {
        //window.onload(window.location.replace("/home"))
    } else {
        console.log(`cliente ja esta logado ${myCookie}`)
        clientInfo = JSON.parse(myCookie.split(".")[1]);
    }

    return clientInfo

}