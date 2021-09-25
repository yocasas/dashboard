let clientInfo

let authCookie


function traduzirLocation(location) {


    let tradutor = {
        'beach': "Destino de praia",
        'country': "Destino de campo",
        'mountain': "Destino de montanha",
        'city': "Destino de cidade",
        "Destino de cidade": "city",
        "Destino de montanha": "mountain",
        "Destino de campo": "country",
        "Destino de praia": "beach"
    }
    return tradutor[location]
}

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


function toHumanDate(x) {
    let date = x
    if (typeof (date) == 'string') {
        date = new Date(date)
    }

    //return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());

    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();


}

function removeCookie() {
    document.cookie = "login_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}


let starsToPointsPerNight = function (multiplier) {

    const basePoint = 400
    switch (multiplier) {
        case -1:
            return basePoint * (Math.pow(2, 0))
        case 3:
            return basePoint * (Math.pow(2, 1))
        case 4:
            return basePoint * (Math.pow(2, 2))
        case 5:
            return basePoint * (Math.pow(2, 3))
        case 6:
            return basePoint * (Math.pow(2, 4))
        case -2:
            return basePoint * (Math.pow(2, 4)) * 1.5

        default:
            return 0
    }


}