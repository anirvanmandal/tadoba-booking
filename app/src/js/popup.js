/* global chrome */

const zoneSelect = document.getElementById('zone-selector')
const shiftSelect = document.getElementById('shift-selector')

let tatkalInfo = {}

const saveInfo = () => {
  chrome.storage.sync.set({ tatkalInfo: tatkalInfo })
}

const setupPopup = () => {
  zoneSelect.value = tatkalInfo.zone
  shiftSelect.value = tatkalInfo.shift
}

const setupEventListeners = () => {
  shiftSelect.addEventListener('change', async (e) => {
    tatkalInfo.shift = e.currentTarget.value
    saveInfo()
  })

  zoneSelect.addEventListener('change', async (e) => {
    tatkalInfo.zone = e.currentTarget.value
    saveInfo()
  })
}

const fetchInitialData = () => {
  chrome.storage.sync.get('tatkalInfo', (data) => {
    if (data.tatkalInfo) {
      tatkalInfo = data.tatkalInfo
    }

    setupPopup()
  })
}

const main = () => {
  setupEventListeners()
  fetchInitialData()
}

main()
