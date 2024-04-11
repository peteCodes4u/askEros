const userFormEl = document.querySelector('#user-form');

// submit form **To be added to appropriate region on integration with Journey-end**
const formSubmitHandler = function (event) {
  event.preventDefault();

  // execute getSuggestions on user click "askEros"
  getSuggestions();
};


//   retrieve data from ticketmaster.com API (currently set to enter city name in field)
const getSuggestions = function () {

  const cityEl = document.getElementById('city');

  let city = cityEl.value;
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };


  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?&city=${city}&apikey=PX9R1m9GGLoYMZnyzl7zDQT2EZJyjBqX`, requestOptions)
    .then(response => response.json())
    // store response in local storage
    .then(response => localStorage.setItem('erosEvents', JSON.stringify(response)))
    // error handling (basic)
    .catch(err => console.error(err));

  fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?&keyword=${city}&apikey=PX9R1m9GGLoYMZnyzl7zDQT2EZJyjBqX`, requestOptions)
    .then(response => response.json())
    // store response in local storage
    .then(response => localStorage.setItem('erosAttractions', JSON.stringify(response)))
    // error handling (basic)
    .catch(err => console.error(err));

  fetch(`https://app.ticketmaster.com/discovery/v2/suggest.json?&keyword=${city}&apikey=PX9R1m9GGLoYMZnyzl7zDQT2EZJyjBqX`, requestOptions)
    .then(response => response.json())
    // store response in local storage
    .then(response => localStorage.setItem('erosSuggest', JSON.stringify(response)))
    // error handling (basic)
    .catch(err => console.error(err));

  setTimeout(() => {
    console.log("Second function will be executed after 3 seconds");
    prepareResults();
  }, 1500); // 1500 milliseconds = 1.5 seconds


};


//   prepare resutls > strategy => parse each localStorage array for names and compile master list for looping and randomizing result output
const prepareResults = function () {

  // erosEvents push to erosFinds (new array composed of events/attractions/suggests)
  // set the eventDataString by pulling erosEvents in local storage
  const eventsDataString = localStorage.getItem('erosEvents');

  // parse the data and set to new constant 'eventData'
  const eventsData = JSON.parse(eventsDataString);

  // set the events data by pulling object .events from the array erosEvents data
  const events = eventsData._embedded.events;

  // Initialize erosFinds array as empty array
  let erosFinds = [];

  // Use forEach loop to pull all event names
  events.forEach(event => {
    let eventNames = JSON.stringify(event.name);

    // Append each event name to the erosFinds array
    erosFinds.push(eventNames);
  });

  // erosAttractions push to erosFinds (new array composed of events/attractions/suggests)
  // set the eventDataString by pulling erosEvents in local storage
  const attractionDataString = localStorage.getItem('erosAttractions');

  // parse the data and set to new constant 'eventData'
  const attractionData = JSON.parse(attractionDataString);

  // set the events data by pulling object .events from the array erosEvents data
  const attractions = attractionData._embedded.attractions;


  // Use forEach loop to pull all event names
  attractions.forEach(attraction => {
    let attractionNames = JSON.stringify(attraction.name);

    // Append each event name to the erosFinds array
    erosFinds.push(attractionNames);
  });


  // erosSuggest push to erosFinds (new array composed of events/attractions/suggests)
  // set the eventDataString by pulling erosEvents in local storage
  const suggestDataString = localStorage.getItem('erosSuggest');

  // parse the data and set to new constant 'eventData'
  const suggestionData = JSON.parse(suggestDataString);

  // set the events data by pulling object .events from the array erosEvents data
  const suggestion = suggestionData._embedded.attractions;

  // Use forEach loop to pull all event names
  suggestion.forEach(attraction => {
    let suggestionNames = JSON.stringify(attraction.name);

    // Append each event name to the erosFinds array
    erosFinds.push(suggestionNames);
  });

  // Save the updated erosFinds array back to localStorage
  localStorage.setItem('erosFinds', JSON.stringify(erosFinds));
  randomizeErosFinds();
  displayResults();


}

// randomize results and select only 3
const randomizeErosFinds = function () {

  // Retrieve the array from local storage
  const erosFindsArray = JSON.parse(localStorage.getItem('erosFinds'));

  // Create a new array to store randomly selected items
  const erosPicks = [];

  // Randomly select 3 items from the original array
  while (erosPicks.length < 3) {
    const randomIndex = Math.floor(Math.random() * erosFindsArray.length);
    const selectedItem = erosFindsArray[randomIndex];

    if (!erosPicks.includes(selectedItem)) {
      erosPicks.push(selectedItem);
    }
  }

  // Store the new array back into local storage
  localStorage.setItem('erosPicks', JSON.stringify(erosPicks));

}

// display results 
const displayResults = function () {
  // Retrieve the array from localStorage
  const erosFindsArray = JSON.parse(localStorage.getItem('erosPicks')) || [];

  // Get the container where you want to append the <p> elements
  const container = document.getElementById('erosFinds-container');

  // Loop through the array and create <p> elements
  erosFindsArray.forEach(item => {
    // Create a new <p> element
    const pElement = document.createElement('p');

    // Set the text content of the <p> element to the current item
    pElement.textContent = item;

    // Append the <p> element to the container
    container.appendChild(pElement);
  });

}


// event listener for submit button
userFormEl.addEventListener('submit', formSubmitHandler);
