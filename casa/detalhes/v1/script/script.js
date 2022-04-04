Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000)
  return this
}

function fixTimeZone(date) {
  let dateSave = new Date(date.getTime())
  return dateSave.addHours(dateSave.getTimezoneOffset() / 60)
}

function generateAvaliableObj(sortedDatesJSON) {
  let sortedDatesString = JSON.parse(JSON.stringify(sortedDatesJSON))

  if (sortedDatesString.length == 0) {
    return {
      start: new Date(0),
      end: new Date(0),
    }
  }

  let sortedDates = sortedDatesString.map((x) => new Date(x))
  let sortedDates1 = sortedDatesString.map((x) => new Date(x))
  //console.log(typeof sortedDates[0])

  let fullDates = []

  if (sortedDates.length > 1) {
    let initDate = new Date(0)
    let startDate = new Date(0)
    let endDate = new Date(0)

    sortedDates.forEach((lastDate) => {
      initDate = new Date(endDate.getTime())
      initDate.setDate(initDate.getDate() + 1)
      if (
        initDate.getDate() == lastDate.getDate() &&
        initDate.getFullYear() == lastDate.getFullYear() &&
        initDate.getMonth() == lastDate.getMonth()
      ) {
        endDate = new Date(lastDate.getTime())
      } else {
        if (startDate >= new Date()) {
          let startDateSave = fixTimeZone(startDate)
          let endDateSave = fixTimeZone(endDate)

          fullDates.push({
            start: startDateSave,
            end: endDateSave,
          })
        } else if (endDate >= new Date()) {
          let startDateSave = fixTimeZone(new Date())
          let endDateSave = fixTimeZone(endDate)

          fullDates.push({
            start: startDateSave,
            end: endDateSave,
          })
        }

        startDate = new Date(lastDate.getTime())
        endDate = new Date(lastDate.getTime())
      }
    })

    if (startDate >= new Date()) {
      let startDateSave = fixTimeZone(startDate)
      let endDateSave = fixTimeZone(sortedDates[sortedDates.length - 1])

      fullDates.push({
        start: startDateSave,
        end: endDateSave,
      })
    } else if (endDate >= new Date()) {
      let startDateSave = fixTimeZone(new Date())
      let endDateSave = fixTimeZone(sortedDates[sortedDates.length - 1])

      fullDates.push({
        start: startDateSave,
        end: endDateSave,
      })
    }
  } else {
    fullDates.push({
      start: new Date(0),
      end: new Date(0),
    })
  }
  return fullDates
}
