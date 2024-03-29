/* global chrome */

import * as dayjs from 'dayjs'

const customerLoginLink = 'nmr-logged-out'

const phoneID = 'input_8_1'

const dateSelectorID = 'input_29_1'
const zoneSelectorID = 'input_29_2'
const shiftSelectorID = 'input_29_3'
const termsCheckboxID = 'input_29_8_1'
const transparencyCheckboxID = 'input_29_11_1'

const stateSelectID = 'input_6_78'
const passengerCountID = 'input_6_11'
const cityInputID = 'input_6_79'

const respectWildlifeCheckboxID = 'input_6_76_1'
const respectPeopleCheckboxID = 'input_6_77_1'
const privacyPolicyCheckboxID = 'input_6_75_1'
const vaccinationStatusCheckboxID = 'input_6_80_1'

const passengerInputs = {
  passenger_1: {
    name: 'input_6_12',
    age: 'input_6_14',
    gender: 'input_6_15',
    nationality: 'input_6_28',
    idProofType: 'input_6_18',
    idProofNumber: 'input_6_19'
  },
  passenger_2: {
    name: 'input_6_29',
    age: 'input_6_30',
    gender: 'input_6_31',
    nationality: 'input_6_32',
    idProofType: 'input_6_33',
    idProofNumber: 'input_6_34'
  },
  passenger_3: {
    name: 'input_6_41',
    age: 'input_6_40',
    gender: 'input_6_39',
    nationality: 'input_6_38',
    idProofType: 'input_6_45',
    idProofNumber: 'input_6_43'
  },
  passenger_4: {
    name: 'input_6_51',
    age: 'input_6_50',
    gender: 'input_6_49',
    nationality: 'input_6_48',
    idProofType: 'input_6_47',
    idProofNumber: 'input_6_46'
  },
  passenger_5: {
    name: 'input_6_64',
    age: 'input_6_63',
    gender: 'input_6_70',
    nationality: 'input_6_67',
    idProofType: 'input_6_66',
    idProofNumber: 'input_6_65'
  },
  passenger_6: {
    name: 'input_6_68',
    age: 'input_69',
    gender: 'input_6_62',
    nationality: 'input_6_61',
    idProofType: 'input_6_60',
    idProofNumber: 'input_6_59'
  }
}

const cameraCountSelectID = 'input_7_6'
const plasticUsageID = 'choice_7_28_1'
const insuranceRejectRadioID = 'choice_7_26_1'
const electronicUsageCheckboxID = 'input_7_25_1'

const TATRTermsCheckboxID = 'input_11_2_1'
const TATRConsentCheckboxID = 'input_11_4_1'

const dateFormat = 'DD/MM/YYYY'

const tatkalDetailsRegex = /\/safari\/tatkal\/*/
const peopleDetailsRegex = /\/people-details\/*/
const activitiesRegex = /\/activities\//
const reviewOrderRegex = /\/review-order\//
const loginRegex = /\/login\//

let tatkalInfo = {}
let passengerInfo = {}
let activitiesInfo = {}
let loginInfo = {}

const fetchTatkalInfo = () => {
  chrome.storage.sync.get('tatkalInfo', (data) => {
    if (data.tatkalInfo) {
      tatkalInfo = data.tatkalInfo
      setZone()
      setShift()
    }
  })
}

const fetchLoginInfo = () => {
  chrome.storage.sync.get('loginInfo', (data) => {
    if (data.loginInfo) {
      loginInfo = data.loginInfo
      setPhone()
    }
  })
}

const setInputValue = (value, selectorID) => {
  if (value) {
    document.getElementById(selectorID).value = value
  } else {
    console.log(`${value} for ${selectorID} is not set in the plugin options`)
  }
}

const setDate = () => {
  const safariDate = dayjs().add(3, 'day')
  document.getElementById(dateSelectorID).value = safariDate.format(dateFormat)
}

const setZone = () => {
  setInputValue(tatkalInfo.zone, zoneSelectorID)
}

const setShift = () => {
  setInputValue(tatkalInfo.shift, shiftSelectorID)
}

const setPhone = () => {
  setInputValue(loginInfo.phone, phoneID)
}

const agreeTerms = () => {
  document.getElementById(termsCheckboxID).checked = true
  document.getElementById(transparencyCheckboxID).checked = true
}

const setTatkalDetails = () => {
  setDate()
  fetchTatkalInfo()
  agreeTerms()
}

const setState = () => {
  setInputValue(passengerInfo.state, stateSelectID)
}

const setCity = () => {
  setInputValue(passengerInfo.city, cityInputID)
}

const triggerPassengerCountChange = () => {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('change', true, true)
  event.eventName = 'change'
  document.getElementById(passengerCountID).dispatchEvent(event)
}

const setPassengerCount = () => {
  setInputValue(passengerInfo.passengerCount, passengerCountID)
  triggerPassengerCountChange()
}

const setPassengerDetails = () => {
  for (let i = 1; i <= 6; i++) {
    if (i <= passengerInfo.passengerCount) {
      const passengerDetails = passengerInfo[`passenger${i}`]

      if (passengerDetails) {
        setInputValue(passengerDetails.name, passengerInputs[`passenger_${i}`].name)
        setInputValue(passengerDetails.age, passengerInputs[`passenger_${i}`].age)
        setInputValue(passengerDetails.gender, passengerInputs[`passenger_${i}`].gender)
        setInputValue(passengerDetails.nationality, passengerInputs[`passenger_${i}`].nationality)
        setInputValue(passengerDetails.idProofType, passengerInputs[`passenger_${i}`].idProofType)
        setInputValue(passengerDetails.idProofNumber, passengerInputs[`passenger_${i}`].idProofNumber)
      }
    }
  }
}

const fetchPassengerInfo = () => {
  chrome.storage.sync.get('passengerInfo', (data) => {
    if (data.passengerInfo) {
      passengerInfo = data.passengerInfo
      setPassengerCount()
      setState()
      setCity()
      setPassengerDetails()
    }
  })
}

const checkPassengerCheckboxes = () => {
  document.getElementById(respectWildlifeCheckboxID).checked = true
  document.getElementById(respectPeopleCheckboxID).checked = true
  document.getElementById(privacyPolicyCheckboxID).checked = true
  document.getElementById(vaccinationStatusCheckboxID).checked = true
}

const setPassengerInformation = () => {
  fetchPassengerInfo()
  checkPassengerCheckboxes()
}

const setLoginPageDetails = () => {
  fetchLoginInfo()
}

const setCameraCount = () => {
  setInputValue(activitiesInfo.cameraCount, cameraCountSelectID)
}

const fetchActivitiesInformation = () => {
  chrome.storage.sync.get('activitiesInfo', (data) => {
    if (data.activitiesInfo) {
      activitiesInfo = data.activitiesInfo
      setCameraCount()
    }
  })
}

const selectInsuranceRadio = () => {
  document.getElementById(insuranceRejectRadioID).click()
}

const checkActivitiesCheckboxes = () => {
  document.getElementById(electronicUsageCheckboxID).click()
  document.getElementById(plasticUsageID).click()
}

const setActivitiesInformation = () => {
  fetchActivitiesInformation()
  selectInsuranceRadio()
  checkActivitiesCheckboxes()
}

const setReviewOrderInformation = () => {
  document.getElementById(TATRTermsCheckboxID).click()
  document.getElementById(TATRConsentCheckboxID).click()
}

const isTatkalBookingsPage = () => {
  return tatkalDetailsRegex.test(document.location.pathname)
}

const isPassengerDetailsPage = () => {
  return peopleDetailsRegex.test(document.location.pathname)
}

const isActivitiesPage = () => {
  return activitiesRegex.test(document.location.pathname)
}

const isReviewOrderPage = () => {
  return reviewOrderRegex.test(document.location.pathname)
}

const isLoginPage = () => {
  return loginRegex.test(document.location.pathname)
}

const isNotLoginPage = () => {
  return !isLoginPage()
}

const isCustomerLoggedOut = () => {
  return document.getElementsByClassName(customerLoginLink).length > 0
}

const main = () => {
  console.log('here')
  if (isCustomerLoggedOut()) {
    if (isNotLoginPage()) {
      document.location.pathname = 'login'
    } else {
      console.log('Please login before proceeding')
    }
  }

  if (isLoginPage()) {
    setLoginPageDetails()
  }

  if (isTatkalBookingsPage()) {
    setTatkalDetails()
  }

  if (isPassengerDetailsPage()) {
    setPassengerInformation()
  }

  if (isActivitiesPage()) {
    setActivitiesInformation()
  }

  if (isReviewOrderPage()) {
    setReviewOrderInformation()
  }
}

main()
