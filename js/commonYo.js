let clientInfo

let authCookie

let userPointsInfo

let devMode = false

//================== URLs =================

let gets3Uri

let getHomesDetailedUri

let homeBaseuri

let chatBaseuri

let userBaseuri

//=========================================

function capitalizeFirstLetter(string) {
  console.log(string)
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function changeUserName(element) {
  element.text(clientInfo.nickName)
}

function traduzirLocation(location, tiny) {
  let tradutor = {
    beach: 'Destino de praia',
    country: 'Destino de campo',
    mountain: 'Destino de montanha',
    city: 'Destino de cidade',
    'Destino de cidade': 'city',
    'Destino de montanha': 'mountain',
    'Destino de campo': 'country',
    'Destino de praia': 'beach',
  }

  if (tiny != undefined && tradutor.hasOwnProperty(location)) {
    return capitalizeFirstLetter(tradutor[location].split(' ')[2])
  } else {
    return tradutor[location]
  }
}

function numberWithPeriod(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getCookie(name) {
  var dc = document.cookie
  var prefix = name + '='
  var begin = dc.indexOf('; ' + prefix)
  if (begin == -1) {
    begin = dc.indexOf(prefix)
    if (begin != 0) return null
  } else {
    begin += 2
    var end = document.cookie.indexOf(';', begin)
    if (end == -1) {
      end = dc.length
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end))
}

let checkCurrentUserNoBlock = function (cookieJs) {
  checkDevMode()

  let myCookie = getCookie('login_session')

  if (cookieJs != undefined) {
    let myCookieNew = cookieJs.get('login_session')

    if (myCookieNew != "" && myCookie != undefined) {
      myCookie = myCookieNew
    }

  }

  authCookie = myCookie

  if (authCookie != null) {
    clientInfo = JSON.parse(atob(authCookie.split('.')[1]))
  }
}

let checkCurrentUser = function (cookieJs) {
  checkDevMode()

  let myCookie = getCookie('login_session')

  if (cookieJs != undefined) {
    let myCookieNew = cookieJs.get('login_session')

    if (myCookieNew != "" && myCookie != undefined) {
      myCookie = myCookieNew
    }

  }

  authCookie = myCookie

  if (myCookie == null) {
    window.location.href = `https://${window.location.hostname}/home/?redirectUrl=${window.location.href}`
  } else {
    //console.log(`cliente ja esta logado ${myCookie}`)
    clientInfo = JSON.parse(atob(myCookie.split('.')[1]))
    let currentDate = new Date()
    if (
      (clientInfo.exp < currentDate.getTime() / 1000) |
      (clientInfo.clientType < 2)
    ) {
      window.location.href = `https://${window.location.hostname}/home/?redirectUrl=${window.location.href}`
    }
  }
}

function checkDevMode() {

  if (sessionStorage.getItem("devMode") == "yes" || document.location.hostname == "localhost" || document.location.hostname == "dev.yocasas.com.br") {
    devMode = true
  }

  return devMode
}

function getCurrentHomeBaseUri() {
  if (checkDevMode()) {
    homeBaseuri = `https://5mpfn9a77j.execute-api.us-east-2.amazonaws.com/dev`
  } else {
    homeBaseuri = 'https://eq3xwcj4zd.execute-api.sa-east-1.amazonaws.com/prod'
  }
  return homeBaseuri
}

function getCurrentCookie() {
  return authCookie
}

function setDevMode() {
  console.log('SET DEV MODE ')
  if (checkDevMode()) {
    console.log('false ')
    sessionStorage.setItem("devMode", "no");
    /*document.cookie =
      'dev_mode_enable=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'*/
  } else {
    console.log('true ')
    sessionStorage.setItem("devMode", "yes");
    //document.cookie = `dev_mode_enable=yes; max-age=86400; path=/`
  }
  document.location.reload(true)
}

function getCurrentChatBaseUri() {
  if (checkDevMode()) {
    chatBaseuri = 'https://pviaa2nfqa.execute-api.us-east-2.amazonaws.com/dev'
  } else {
    chatBaseuri = 'https://dhg9zd3gy1.execute-api.us-east-1.amazonaws.com/dev'
  }
  return chatBaseuri
}

function getCurrentUserBaseUri() {

  if (checkDevMode()) {
    userBaseuri = 'https://8e9nbq8rj1.execute-api.us-east-2.amazonaws.com/DEV'
  } else {
    userBaseuri = 'https://044er6jwuc.execute-api.us-east-1.amazonaws.com/dev-2'
  }
  return userBaseuri
}

function getCurrentS3Uri() {
  if (devMode) {
    gets3Uri =
      `${getCurrentHomeBaseUri()}/s3/getFile/v3`
  } else {
    gets3Uri =
      'https://of5h69nvm8.execute-api.us-east-1.amazonaws.com/dev/s3/getFile/v3'
  }

  return gets3Uri
}

function getCurrentDetailedUrl() {
  if (checkDevMode()) {
    console.log('ENTROU AQUI')
    getHomesDetailedUri =
      `${getCurrentHomeBaseUri()}/gethomes/detailed`
  } else {
    console.log('ENTROU ALI')
    getHomesDetailedUri =
      'https://of5h69nvm8.execute-api.us-east-1.amazonaws.com/dev/gethomes/detailed'
  }
  console.log('DEVMODE' + devMode)
  return getHomesDetailedUri
}

function getCurrentHomesUrl() {
  if (checkDevMode()) {
    getHomesDetailedUri =
      'https://5mpfn9a77j.execute-api.us-east-2.amazonaws.com/dev/'
  } else {
    getHomesDetailedUri =
      'https://of5h69nvm8.execute-api.us-east-1.amazonaws.com/dev/'
  }
  console.log('DEVMODE' + devMode)
  return getHomesDetailedUri
}






function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function toHumanDate(x) {
  let date = x
  if (typeof date == 'string') {
    date = new Date(date)
  }

  //return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());

  return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
}


function toIsoDate(x) {
  let date = x
  var day = date.split("/")[0];
  var month = date.split("/")[1];
  var year = date.split("/")[2];

  //return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());

  return year + '-' + ("0" + month).slice(-2) + '-' + ("0" + day).slice(-2);


}


let starsToPointsPerNight = function (multiplier) {
  const basePoint = 400
  switch (multiplier) {
    case 2:
      return basePoint * Math.pow(2, 0)
    case 3:
      return basePoint * Math.pow(2, 1)
    case 4:
      return basePoint * Math.pow(2, 2)
    case 5:
      return basePoint * Math.pow(2, 3)
    case 6:
      return basePoint * Math.pow(2, 4)
    case 7:
      return basePoint * Math.pow(2, 4) * 1.5

    default:
      return 0
  }
}

function getUserPoints() {
  token = authCookie
  if (token != null) {
  }
  return new Promise((resolve, reject) => {
    let data = {}
    let clientObject = {}
    if (token) {
      if (typeof token === typeof 'string') {
        var tokens = token.split('.')

        // console.log(atob(tokens[0])); //Alg, Type
        clientObject = JSON.parse(atob(tokens[1])) //Id, ClientType, Iat, exp
      }

      var clientId = clientObject.ClientId
      // objFormUser["ClientId"] = clientId
      data = {
        ClientId: clientId,
      }
    }

    //TODO: Usar os headers e nao clientid como argumento
    data = JSON.stringify(data)
    let getUserPointsUri =
      'https://044er6jwuc.execute-api.us-east-1.amazonaws.com/dev-2/points/get/summary'

    if (checkDevMode()) {
      getUserPointsUri =
        'https://8e9nbq8rj1.execute-api.us-east-2.amazonaws.com/DEV/points/get/summary'
    }
    $.ajax({
      url: getUserPointsUri,
      type: 'POST',
      data: data,
      headers: {
        Authorization: token,
      },
      contentType: 'application/json',
      success: function (data1, textStatus, jqXHR) {
        userPointsInfo = data1

        resolve(userPointsInfo)
      },
      error: function (jqXHR, textStatus, errorThrown) { },
    })
  })
}
