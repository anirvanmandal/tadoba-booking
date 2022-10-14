import Cheerio from 'cheerio'

let dom = ''
let tatKalData = []
const firstRow = []
const secondRow = []
const thirdRow = []

const fetchData = () => {
  fetch('https://booking.mytadoba.org/safari/tatkal/')
    .then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status)
        return
      }
      response.text().then(function (data) {
        dom = Cheerio.load(data)
        const cells = dom('#av-grid tr th')
        for (let i = 0; i < 12; i++) {
          if (i < 4) {
            firstRow.push(Cheerio.load(cells[i]).text())
          } else if (i < 8) {
            secondRow.push(Cheerio.load(cells[i]).text())
          } else {
            thirdRow.push(Cheerio.load(cells[i]).text())
          }
        }

        tatKalData = [firstRow, secondRow, thirdRow]
        let sendNotification = false
        for (let i = 1; i <= 2; i++) {
          for (let j = 1; j <= 3; j++) {
            if (parseInt(tatKalData[i][j]) >= 0) {
              sendNotification = true
              break
            }
          }
        }

        if (sendNotification) {
          chrome.notifications.create('tadoba-tatkal-notification', {
            type: 'basic',
            iconUrl: './assets/images/logo_128.png',
            title: 'Tatkal Slot Available',
            message: 'A Tatkal slot is now available. Click to view booking',
            priority: 2,
            requireInteraction: true
          })
        }
      })
    })
    .catch((err) => {
      console.log('Fetch Error :-S', err)
    })
}

const verifyTatkalAvailability = () => {
  fetchData()

  setTimeout(verifyTatkalAvailability, 15 * 60 * 1000)
  console.log('sleeping for 15 min')
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background worker installed')
  verifyTatkalAvailability()
})

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://booking.mytadoba.org/safari/tatkal/' })
})
