import Cheerio from 'cheerio'
import $ from 'jquery'

let dom = ''
let tatKalData = []
const firstRow = []
const secondRow = []
const thirdRow = []

const setupTable = () => {
  for (let i = 0; i < tatKalData.length; i++) {
    const row = tatKalData[i]
    for (let j = 0; j < row.length; j++) {
      $(`#row-${i + 1} .cell-${j + 1}`).html(row[j])
    }
  }

  $('.table-container').removeClass('hidden')
  $('.loader').addClass('hidden')
}

const setupEvents = () => {
  document.getElementById('open-booking').addEventListener('click', (e) => {
    chrome.tabs.create({ url: $(e.currentTarget).data('href') })
    return false
  })

  document.getElementById('js-options-link').addEventListener('click', (e) => {
    chrome.tabs.create({ url: '/app/views/options.html' })
    return false
  })
}

const main = () => {
  setupEvents()
  $.ajax({
    url: 'https://booking.mytadoba.org/safari/tatkal/',
    success: (data) => {
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
      setupTable()
    }
  })
}

main()
