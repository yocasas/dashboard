async function addMessage(chatId, messageContent, hostId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${getCurrentChatBaseUri()}/messages/add`,
            type: 'POST',
            headers: {
                Authorization: authCookie,
            },
            data: JSON.stringify({
                chatId: chatId,
                messageContent: messageContent,
                clientId: clientInfo.ClientId,
                isHost: false,
                clientIdHost: hostId,
            }),
            contentType: 'application/json',

            success: (msgsString) => {
                let msgs = JSON.parse(msgsString)
                resolve(msgsString)
            },
        })
    })
}

function abrirChat(messageId) {
    //TODO here
    if (authCookie) {
        if ($('#totalPointsAfter').text() <= 0) {
            selectedModal = '.modalWarning'
            textModal = "Você precisa de mais pontos para reservar. Contate um administrador."
            toggleModal(selectedModal, textModal)
            return
        }
    } else {
        selectedModal = '.modalWarning'
        textModal = `Torne-se um membro Yô para se comunicar com este anfitrião. <a onclick="location.href='/onboarding/'"
              class="cursor-pointer underline">Clique aqui</a> para iniciar ou continuar o preenchimento do seu pré-cadastro.`
        toggleModal(selectedModal, textModal)

        // window.location.href = `/onboarding/`
        return

    }
    if (currentHomeInfo.clientId == clientInfo.ClientId) {
        alert("Não é possivel criar um chat com voce mesmo")
        return
    }
    window.scrollTo(0, 0)
    $('.loading').parent().removeClass('hidden')
    $('html, body').css({
        overflow: 'hidden',
        height: '100%',
    })

    if (authCookie == null) {
        checkCurrentUser()
        return false
    } else {
        if (clientInfo.clientType < 2) {
            checkCurrentUser()
            return false
        }
    }

    let chatSettings = {
        hostId: currentHomeInfo.clientId,
        guestId: clientInfo.ClientId,
        guestPicture: 'chat_con.png',
        hostPicture: 'chat_con.png',
        requestedDate: selectedDates,
        hostName: currentHomeInfo.contactName,
        guestName: clientInfo.nickName,
        homeNickName: currentHomeInfo.nickName,
        homeId: currentHomeInfo.homeId,
    }

    $.ajax({
        url: `${getCurrentChatBaseUri()}/createchat`,
        type: 'POST',
        headers: {
            Authorization: authCookie,
        },
        data: JSON.stringify(chatSettings),
        contentType: 'application/json',

        success: (resp) => {
            respObj = JSON.parse(resp)
            addMessage(
                respObj['data']['chatId'],
                `Olá, estou interessado em me hospedar na sua casa de ${toHumanDate(
                    selectedDates[0],
                )} a ${toHumanDate(selectedDates[1])}. Vamos conversar?`,
                currentHomeInfo.clientId,
            ).then((x) => {
                $('.loading').parent().addClass('hidden')
                window.scrollTo(0, 0)
                $('#showWarn').removeClass('hidden')
                $('html, body').css({
                    overflow: 'hidden',
                    height: '100%',
                })
            })

            //$('#showWarn').removeClass('hidden')
            //window.location.href = "/dashboard/chat/"
        },
    })
}

function checkData(data) {
    return data != undefined && data.length > 0
}

function setHomeInfos(element) {
    $('#nickName').text(`${element['nickName']}`)
    if (
        element['underReview'] != undefined &&
        element['underReview']
    ) {
        $('#openChat').text('Solicitar reserva')
        //$('#reservationCalculator').toggleClass('hidden')
    }
    if (element[`state`] != '' && element[`state`] != undefined) {
        //$("#location").text(`${element["city"]}, ${element["state"]}, ${element["country"]}`)
        $('#location').text(
            `${element['city']}, ${element['state']}, ${element['country']}`,
        )
    } else {
        $('#location').text(`${element['city']}, ${element['country']}`)
    }

    $('#locationTypeHost').text(element['locationType'])
    $('.locationType').text(traduzirLocation(element['locationType']))
    $('.locationTypeMobile').text(
        traduzirLocation(element['locationType'], 1),
    )

    $('#inCondominium').text(element[`inCondominium`] ? 'Sim' : 'Não')
    $('#floorSpace').text(element[`floorSpace`])
    $('#airportDistance').text(element[`airportDistance`])
    $('#uncoveredParking').text(element[`uncoveredParking`])
    $('#coveredParking').text(element[`coveredParking`])
    $('#map')
        .prepend(`<iframe  class="w-full h-s-1/2" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCkZNXLlRijWEbGtos2oL60_EIaofq_XKY&q=${element['zipCode']}"">
            </iframe>`)
    $(`#infoWorkers`).text(
        checkData(element[`infoWorkers`]) ?
            element[`infoWorkers`] :
            'Sem informações',
    )
    $(`#feeCleaning`).text(
        element[`feeCleaning`] != undefined && element[`feeCleaning`] != '' ?
            element[`feeCleaning`] :
            'Sem informações',
    )
    $(`#beachDistance`).text(
        element[`beachDistance`] != undefined && element[`beachDistance`] != '' ?
            element[`beachDistance`] :
            'Sem informações',
    )
    $(`#infoAC`).text(
        checkData(element[`totalAc`]) ?
            element[`totalAc`] :
            'Sem informações',
    )
    $(`#carEntrance`).text(
        checkData(element[`accessPath`]) ?
            element[`accessPath`] :
            'Sem informações',
    )
    $(`#description`).text(element[`description`])
    $(`#curatedDetails`).text(
        checkData(element[`curatedDetails`]) ?
            element[`curatedDetails`] :
            'Sem informações',
    )
    console.log(element[`curatedDetails`])
    $(`#extraRestriction`).text(
        checkData(element[`extraRestriction`]) ?
            element[`extraRestriction`] :
            'Sem informações',
    )

    if (element[`curated`]) {
        $(`.nonCuratedOnly`).addClass('hidden')
    } else {
        $(`.curatedOnly`).addClass('hidden')
    }
}




