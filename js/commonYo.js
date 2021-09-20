let clientInfo

let authCookie




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
    
    authCookie = myCookie

    if (myCookie == null) {
        window.onload(window.location.replace("/home"))
    } else {
        //console.log(`cliente ja esta logado ${myCookie}`)
        clientInfo = JSON.parse(atob(myCookie.split(".")[1]));
    }


    return clientInfo

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


let starsToPointsPerNight = function (multiplier) {

    const basePoint = 400
    switch (multiplier) {
        case -1:
            return basePoint*(Math.pow(2,0))
        case 3:
            return basePoint*(Math.pow(2,1))
        case 4:
            return basePoint*(Math.pow(2,2))
        case 5:
            return basePoint*(Math.pow(2,3))
        case 6:
            return basePoint*(Math.pow(2,4))
        case -2:
            return basePoint*(Math.pow(2,4))*1.5
    
        default:
            return 0
    }
    

}