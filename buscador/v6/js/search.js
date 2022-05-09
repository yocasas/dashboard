let activeFilters = {

}


function logKey(e) {
    console.log(` ${e.code}`);
}

let maxPage = 0
let currentPage = 0
let pageSize = -1
let resultFromApi = []


function createAndPopulate(locationType, dbResponse) {

    function range(size, startAt = 0) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    function getS3file(name, image, element) {
        let imgSrc = image.find("#img_source")

        if (element.b64img == undefined) {
            checkCurrentUserNoBlock()
            //''

            $.ajax({
                url: getCurrentS3Uri(),
                type: "POST",
                data: JSON.stringify({
                    "pic-name": name
                }),
                contentType: "application/json",
                success: (x) => {
                    element.b64img = `${x}`
                    imgSrc.attr("src", element.b64img)
                    imgSrc.on('load', function () {
                        $(this).parent().find(".loader").addClass("hidden")
                        $(this).removeClass("hidden")
                    });
                },
            })
        } else {
            image.find(".loader").addClass("hidden")
            imgSrc.removeClass("hidden")
            imgSrc.attr("src", element.b64img)
        }


    }


    let homesShow = $("#homes_show")
    let defaultHome = $("#show_home_default")
    homesShow.find(".show_home").remove()
    $("#result_quantity").text(
        `${locationType != undefined ? "" + traduzirLocation(locationType) : "Destinos"}: ${resultFromApi.length} casas encontradas`
    )
    dbResponse.forEach(element => {

        let homeClone = defaultHome.clone()
        getS3file(element["picturesS3Urls"][
            0
        ], homeClone.find("#imagem_casa"), element)
        homeClone.find('#nickName').text(element["nickName"]);
        if (element[`state`] != "" && element[`state`] != undefined) {
            homeClone.find('#Location').text(
                `${element["city"]}, ${element["state"]}, ${element["country"]}`);
        } else {
            homeClone.find('#Location').text(`${element["city"]}, ${element["country"]}`);
        }

        let stars = range(element["multiplier"], 1)
        homeClone.attr("onclick", `location.href='/dashboard/casa/detalhes/?homeId=${element['homeId']}'`)
        /*stars.forEach(startId => {
            let rank = homeClone.find('#rank')
            rank.find(`#${startId}`).removeClass("far");
            rank.find(`#${startId}`).addClass("fas");
        })*/

        if (element["multiplier"] < 7 && element["multiplier"] > 2) {
            homeClone.find('#3-6').removeClass('hidden')
            let stars = range(element["multiplier"], 1)
            homeClone.attr("onclick",
                `location.href='/dashboard/casa/detalhes/?homeId=${element['homeId']}'`)
            stars.forEach(startId => {
                let rank = homeClone.find('#rank')
                rank.find(`#${startId}`).removeClass("far");
                rank.find(`#${startId}`).addClass("fas");
            })
        } else if (element["multiplier"] == 7) {
            homeClone.find('#7').removeClass('hidden')
        } else if (element["multiplier"] == 2) {
            homeClone.find('#2').removeClass('hidden')
        }

        let points = starsToPointsPerNight(element["multiplier"])
        homeClone.find('#points').text(numberWithCommas(points));
        homeClone.removeClass("hidden");
        homeClone.addClass("show_home");
        homeClone.attr("id", "show_home");
        homesShow.append(homeClone)
    });
}

let facilities = []

let workers = ["housekeeper", "poolkeeper", "cooker", "security", "janitor"]


function populateHomes(e) {

    let searchWorkers = []

    let searchFacilities = []

    $('.checkbox-round:checked').each((x, ele) => {
        if (workers.includes(ele.value)) {
            searchWorkers.push(ele.value)
        } else {
            searchFacilities.push(ele.value)
        }
    })

    let bathrooms = parseInt($(`#bathrooms`).text())
    let bedrooms = parseInt($(`#bedrooms`).text())

    if (e == undefined) {
        e = traduzirLocation($("#location_type").text())
    }

    let locationType = e //$("#locationType")[0].innerHTML.replace(/\s+/g, '')
    $("#filtro_busca").text(traduzirLocation(locationType))
    $("#location_type").text(traduzirLocation(locationType))


    $("#filtro_busca_mobile").text(traduzirLocation(locationType))

    let maxGuests = parseInt($(`#total_guests`).text())

    let data = {
        "LocationType": e,
        "maxPeople": maxGuests,
        "facilities": searchFacilities,
        "workers": searchWorkers,
        "minBathrooms": bathrooms,
        "minBedrooms": bedrooms,
        "nAdm": true
    }


    let getHomesDetailedUri = `${getCurrentHomeBaseUri()}/gethomes/detailed`
    if (authCookie == null) {
        getHomesDetailedUri = `${getCurrentHomeBaseUri()}/gethomes`

    }
    $.ajax({
        url: getHomesDetailedUri,
        type: "POST",
        data: JSON.stringify(data),

        headers: {
            "Authorization": authCookie == null ? undefined : authCookie
        },
        contentType: "application/json",



        success: function (x) {

            maxPage = 0
            currentPage = 0

            if (window.innerWidth >= 640 && window.innerWidth < 767) {
                pageSize = x.length
            }
            if (window.innerWidth >= 640 && window.innerWidth < 767) {
                pageSize = 4
            } else if (window.innerWidth >= 768 && window.innerWidth < 1535) {
                pageSize = 6
            } else if (window.innerWidth >= 1536) {
                pageSize = 6
            } else {
                pageSize = x.length //TODO infinite scrolling
            }

            maxPage = Math.ceil((x.length) / pageSize)


            let pages = $(`#pages`)




            let pageIcon = pages.find('#0')

            $(`.page`).slice(1).remove()



            for (let index = 0; index < maxPage - 1; index++) {
                let pageClone = pageIcon.clone()
                pageClone.removeClass('button_bg')
                pageClone.addClass('border')
                pageClone.addClass('borda_filtro')
                pageClone.attr('id', index + 1)
                pages.append(pageClone)
            }

            let allPages = $(`.page`) //TODO set click on first page


            allPages.removeClass('button_bg')
            allPages.addClass('border')
            allPages.addClass('borda_filtro')
            allPages.eq(0).removeClass('border')
            allPages.eq(0).addClass('button_bg')




            resultFromApi = x

            $(document).on("click", ".page", function () {
                let allPages = $(`.page`)
                allPages.removeClass('button_bg')
                allPages.addClass('border')
                allPages.addClass('borda_filtro')

                $(this).addClass('button_bg')
                $(this).removeClass('border')
                $(this).removeClass('border')

                currentPage = parseInt($(this).attr(`id`))

                nextItem = (currentPage + 1) * pageSize

                let dbResponse = resultFromApi.slice(currentPage * pageSize, nextItem >
                    resultFromApi.length ? resultFromApi.length : nextItem)

                createAndPopulate(locationType, dbResponse)

            })


            nextItem = (currentPage + 1) * pageSize

            let dbResponse = resultFromApi.slice(currentPage * pageSize, nextItem > resultFromApi
                .length ? resultFromApi.length : nextItem)

            createAndPopulate(locationType, dbResponse)

        }
    })
}


function changeVisibility(e, cr) {
    if ($(`#${e}`).attr("class").split(/\s+/).indexOf("hidden") == -1) {
        $(`#${e}`).addClass("hidden")
    } else {
        $(`#${e}`).removeClass("hidden")
    }

    if (e == "more_filters") {
        $(' body').toggleClass("overflow-hidden");
    }

}

function removeCookie() {
    document.cookie = "login_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function eliminar() {
    changeVisibility('more_filters', 'more_filters_filter')
    $(`.filtro_busca`).addClass("borda_filtro")
    $(`.filtro_busca`).removeClass("borda_filtro_sel")
}