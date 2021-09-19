let clientInfo




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
    

    if (myCookie == null) {
        window.onload(window.location.replace("/home"))
    } else {
        //console.log(`cliente ja esta logado ${myCookie}`)
        clientInfo = JSON.parse(atob(myCookie.split(".")[1]));
    }


    return clientInfo

}


let starsToPointsPerNight = function (multiplier) {

    switch (multiplier) {
        case -1:
            return 100
        case 3:
            return 200
        case 4:
            return 300
        case 5:
            return 400
        case 6:
            return 500
        case -2:
            return 600
    
        default:
            return 0
    }
    

}