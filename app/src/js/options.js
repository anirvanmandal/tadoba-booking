/* global chrome */

import { Tabs } from 'foundation-sites'
import $ from 'jquery'

let tatkalInfo = {}
let passengerInfo = {}
let activitiesInfo = {}

const setupPassengerCount = (count) => {
  if (count) {
    document.getElementById('passenger-count').value = count
  }
}

const setupState = (state) => {
  if (state) {
    document.getElementById('state-selector').value = state
  }
}

const setupCity = (city) => {
  if (city) {
    document.getElementById('city-name').value = city
  }
}

const setupPassengerWrappers = (count) => {
  if (!count) {
    count = 1
  }

  for (let i = 1; i <= 6; i++) {
    if (i > count) {
      document.getElementById(`passenger-${i}-wrapper`).classList.add('hidden')
    } else {
      document.getElementById(`passenger-${i}-wrapper`).classList.remove('hidden')
    }
  }
}

const setupPassengerDetails = (count) => {
  for (let i = 1; i <= 6; i++) {
    if (i <= count) {
      let passengerDetails = passengerInfo[`passenger${i}`]
      if (!passengerDetails) {
        passengerDetails = {}
      }

      if (passengerDetails.name) {
        document.getElementById(`passenger-${i}-name`).value = passengerDetails.name
      }

      if (passengerDetails.age) {
        document.getElementById(`passenger-${i}-age`).value = passengerDetails.age
      }

      if (passengerDetails.gender) {
        document.getElementById(`passenger-${i}-gender`).value = passengerDetails.gender
      }

      if (passengerDetails.nationality) {
        document.getElementById(`passenger-${i}-nationality`).value = passengerDetails.nationality
      }

      if (passengerDetails.idProofType) {
        document.getElementById(`passenger-${i}-id-proof-type`).value = passengerDetails.idProofType
      }

      if (passengerDetails.idProofNumber) {
        document.getElementById(`passenger-${i}-id-proof-number`).value = passengerDetails.idProofNumber
      }
    }
  }
}

const buildPassengerDetails = () => {
  for (let i = 1; i <= 6; i++) {
    if (i <= passengerInfo.passengerCount) {
      const passengerDetails = {}
      passengerDetails.name = document.getElementById(`passenger-${i}-name`).value
      passengerDetails.age = document.getElementById(`passenger-${i}-age`).value
      passengerDetails.gender = document.getElementById(`passenger-${i}-gender`).value
      passengerDetails.nationality = document.getElementById(`passenger-${i}-nationality`).value
      passengerDetails.idProofType = document.getElementById(`passenger-${i}-id-proof-type`).value
      passengerDetails.idProofNumber = document.getElementById(`passenger-${i}-id-proof-number`).value
      passengerInfo[`passenger${i}`] = passengerDetails
    }
  }
}

const buildPassengerInfo = () => {
  passengerInfo = {}
  passengerInfo.passengerCount = document.getElementById('passenger-count').value
  passengerInfo.state = document.getElementById('state-selector').value
  passengerInfo.city = document.getElementById('city-name').value

  buildPassengerDetails()
}

const storeInfo = () => {
  chrome.storage.sync.set({ tatkalInfo: tatkalInfo, passengerInfo: passengerInfo, activitiesInfo: activitiesInfo }, () => {
    $('.settings-saved-callout').removeClass('hidden')
    $('#save-options').html('Save')

    setTimeout(() => {
      $('.settings-saved-callout').addClass('hidden')
    }, 2000)
  })
}

const buildActivitiesInfo = () => {
  activitiesInfo = {}
  activitiesInfo.cameraCount = document.getElementById('camera-count').value
}

const buildTatkalInfo = () => {
  tatkalInfo = {}
  tatkalInfo.zone = document.getElementById('zone-selector').value
  tatkalInfo.shift = document.getElementById('shift-selector').value
}

const saveInformation = () => {
  buildTatkalInfo()
  buildPassengerInfo()
  buildActivitiesInfo()
  storeInfo()
}

const setupEventListeners = () => {
  document.getElementById('passenger-count').addEventListener('change', async (e) => {
    setupPassengerWrappers(e.currentTarget.value)
  })

  document.getElementById('save-options').addEventListener('click', async (e) => {
    e.preventDefault()
    e.currentTarget.innerHTML = 'Saving ...'
    saveInformation()
  })
}

const setupCameraCount = (count) => {
  if (!count) {
    count = 0
  }

  document.getElementById('camera-count').value = count
}

const setupTatkalDetails = () => {
  document.getElementById('zone-selector').value = tatkalInfo.zone
  document.getElementById('shift-selector').value = tatkalInfo.shift
}

const setupOptions = () => {
  setupTatkalDetails(tatkalInfo)
  setupPassengerCount(passengerInfo.passengerCount)
  setupState(passengerInfo.state)
  setupCity(passengerInfo.city)
  setupPassengerWrappers(passengerInfo.passengerCount)
  setupPassengerDetails(passengerInfo.passengerCount)
  setupCameraCount(activitiesInfo.cameraCount)
}

const fetchInitialData = () => {
  chrome.storage.sync.get(['tatkalInfo', 'passengerInfo', 'activitiesInfo'], (data) => {
    if (data.tatkalInfo) {
      tatkalInfo = data.tatkalInfo
    }

    if (data.passengerInfo) {
      passengerInfo = data.passengerInfo
    }

    if (data.activitiesInfo) {
      activitiesInfo = data.activitiesInfo
    }

    setupOptions()
  })
}

const initializePage = () => {
  setupEventListeners()
  fetchInitialData()
}

const initializeTabs = () => {
  return new Tabs($('.js-vertical-tabs'), {})
}

const main = () => {
  initializePage()
  initializeTabs()
}

main()
