let passengerInfo = {};
let activitiesInfo = {};

const setupPassengerCount = (count) => {
  if (count) {
    document.getElementById('passenger-count').value = count;
  }
}

const setupState = (state) => {
  if (state) {
    document.getElementById('state-selector').value = state;
  }
}

const setupCity = (city) => {
  if (city) {
    document.getElementById('city-name').value = city;
  }
}

const setupPassengerWrappers = (count) => {
  if (!count) {
    count = 1;
  }

  for (let i = 1; i <= 6; i++) {
    if (i > count) {
      document.getElementById(`passenger-${i}-wrapper`).classList.add('hidden');
    } else {
      document.getElementById(`passenger-${i}-wrapper`).classList.remove('hidden');
    }
  }
}

const setupPassengerDetails = (count) => {
  for (let i = 1; i <= 6; i++) {
    if (i <= count) {
      let passengerDetails = passengerInfo[`passenger${i}`];
      if (!passengerDetails) {
        passengerDetails = {};
      }

      if (passengerDetails.name) {
        document.getElementById(`passenger-${i}-name`).value = passengerDetails.name;
      }

      if (passengerDetails.age) {
        document.getElementById(`passenger-${i}-age`).value = passengerDetails.age;
      }

      if (passengerDetails.gender) {
        document.getElementById(`passenger-${i}-gender`).value = passengerDetails.gender;
      }

      if (passengerDetails.nationality) {
        document.getElementById(`passenger-${i}-nationality`).value = passengerDetails.nationality;
      }

      if (passengerDetails.idProofType) {
        document.getElementById(`passenger-${i}-id-proof-type`).value = passengerDetails.idProofType;
      }


      if (passengerDetails.idProofNumber) {
        document.getElementById(`passenger-${i}-id-proof-number`).value = passengerDetails.idProofNumber;
      }
    }
  }
}

const buildPassengerDetails = () => {
  for (let i = 1; i <= 6; i++) {
    if (i <= passengerInfo.passengerCount) {
      let passengerDetails = {};
      passengerDetails.name = document.getElementById(`passenger-${i}-name`).value;
      passengerDetails.age = document.getElementById(`passenger-${i}-age`).value;
      passengerDetails.gender = document.getElementById(`passenger-${i}-gender`).value;
      passengerDetails.nationality = document.getElementById(`passenger-${i}-nationality`).value;
      passengerDetails.idProofType = document.getElementById(`passenger-${i}-id-proof-type`).value;
      passengerDetails.idProofNumber = document.getElementById(`passenger-${i}-id-proof-number`).value;
      passengerInfo[`passenger${i}`] = passengerDetails;
    }
  }
}

const buildPassengerInfo = () => {
  passengerInfo = {};
  passengerInfo.passengerCount = document.getElementById('passenger-count').value;
  passengerInfo.state = document.getElementById('state-selector').value;
  passengerInfo.city = document.getElementById('city-name').value;

  buildPassengerDetails();
}

const storeInfo = () => {
  chrome.storage.sync.set({ passengerInfo: passengerInfo, activitiesInfo: activitiesInfo });
}

const buildActivitiesInfo = () => {
  activitiesInfo = {};
  activitiesInfo.cameraCount = document.getElementById('camera-count').value;
}

const saveInformation = () => {
  buildPassengerInfo();
  buildActivitiesInfo();
  storeInfo();
}

const setupEventListeners = () => {
  document.getElementById('passenger-count').addEventListener('change', async (e) => {
    setupPassengerWrappers(e.currentTarget.value);
  });

  document.getElementById('save-options').addEventListener('click', async (e) => {
    e.preventDefault();
    saveInformation();
  });
}

const setupCameraCount = (count) => {
  if (!count) {
    count = 0;
  }

  document.getElementById('camera-count').value = count;
}

const setupOptions = () => {
  setupPassengerCount(passengerInfo.passengerCount);
  setupState(passengerInfo.state);
  setupCity(passengerInfo.city);
  setupPassengerWrappers(passengerInfo.passengerCount);
  setupPassengerDetails(passengerInfo.passengerCount);
  setupCameraCount(activitiesInfo.cameraCount);
}

const fetchInitialData = () => {
  chrome.storage.sync.get(['passengerInfo', 'activitiesInfo'], (data) => {
    if (data.passengerInfo) {
      passengerInfo = data.passengerInfo;
    }

    if (data.activitiesInfo) {
      activitiesInfo = data.activitiesInfo;
    }

    setupOptions();
  });
}

const initializePage = () => {
  setupEventListeners();
  fetchInitialData();
}

const main = () => {
  initializePage();
}

main();
