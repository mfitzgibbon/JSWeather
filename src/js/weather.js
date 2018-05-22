import './general';

//http://api.openweathermap.org/data/2.5/forecast/daily?zip=97405&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646


/* Create a class called Weather
- Part 1 - Retrieve the weather information when the user clicks the buttobn
  - Create the constructor
    - initialize instance variables for the "state" of the app and the ajax call
        this.state = {
          zipcode: "",
          city: {},
          dates: [],
          selectedDate: null
        };
        this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
        this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";
    - initialize instance variables for UI elements
        the form
        the zipcode input element
        the weather list div
        the current day div
    - write the stub of a method onFormSubmit
    - bind the class to onFormSubmit
    - add a submit handler to the form that calls onFormSubmit
  - Write the method onFormSubmit.  It should
    - prevent the form from being sumbitted to the server
    - get the zip code from the UI and put it in a variable
    - call fetch with the url zipcdoe and apikey
      - when the response comes back THEN parse the json
      - when that finishes THEN 
        - set the city in the state object
        - set the dates in the state object
        - set the selectedDate to null
        - clear the zipcode from the UI
        - call the method renderWeatherList and pass this.state.dates as the arg
  - Write a first version of renderWeatherList.  It has weatherDays (which is an array) as a parameter.
    - console.log the value of weatherDays.
  - Edit the constructor to bind the class to the method renderWeatherList
END OF PART 1 - TEST AND DEBUG YOUR APP
- Part 2 - Format ONE weather list item and the weather list as a whole
  - Write the method renderWeatherListItem
    - This method returns a template literal containing the html for the weather for ONE day.
      It gets called in renderWeatherList.  It has 2 parameters a weatherDay and an index.
      The weatherDay is a js object from the list part of the return from the weather api.
    - Format the weather information for one day on the html page.  At a minimum it should include
      - the month and day as well as the weekday
      - the high and low temperatures for that day
      - the element should be styled with weather-list-item as well
    - CUT the html for ONE day from your html page into the body of your method.
      - Enclose the html in ``.
      - Replace the hardcoded month and day, weekday, high and low temperatures 
        with template strings that use the properties of the weatherDay object
      - Return the template literal 
  - Edit the body of the method renderWeather list.  It should
    - Create the html for each of the weather list items.  Use the array method map to do this.
      const itemsHTML = weatherDays.map((weatherDay, index) => this.renderWeatherListItem(weatherDay, index)).join('');
    - Set the inner html of the weatherList element on the page to 
      - a div element styled with weather-list flex-parent
      - that contains the itemsHTML from above
END OF PART 2 - TEST AND DEBUG YOUR APP
- Part 3 - Display weather details when the user clicks one weather list item
  - Write the method renderCurrentDay.  It takes the index of the day as it's parameter.
    - Format the detailed weather information for the selected day on the html page. Include at least
      - identifying information for the city as well as the date
      - description and icon for the weather
      - temperatures throughout the day
      - humidity and wind information
    - CUT the html for the weather details and paste it into the body of your method
      - Enclose the html in ``.
      - Replace the hardcoded text with data.  The data is in the state instance variable.
      - Set the innerhtml property of the currentDay element on the page
  - Add a click event handler to each of the weather list items 
    - add a loop to the end of the renderWeatherList method that adds the event handler
    - you'll have to bind the method renderCurrentDay to both the class and the index of the item
  - Write the method clearCurrentDay.  It sets the inner html property of the currentDay element to ""
  - Call clearCurrentDay at the end of onFormSubmit
END OF PART 3 - TEST AND DEBUG YOUR APP
*/

// Don't forget to instantiate the a weather object!


class Weather{

    constructor() {
      this.state = {
        zipcode: "",
        city: {},
        dates: [],
        selectedDate: null
      };
      this.url = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=";
      this.apikey = "&units=imperial&appid=c59493e7a8643f49446baf0d5ed9d646";
      this.$form = document.querySelector("#zipForm");
      this.$zipcodeInput = document.querySelector("#zipcode");
      this.$weatherList = document.querySelector("#weatherList");
      this.$currentDay = document.querySelector("#currentDay");

      this.onFormSubmit.bind(Weather);
      this.$form.addEventListener('submit', event => {this.onFormSubmit(event);});
      this.renderWeatherList.bind(Weather);
      this.renderWeatherListItem.bind(Weather);
      this.renderCurrentDay.bind(Weather);


    }

    onFormSubmit(event){
      event.preventDefault();
      console.log("Form Was Submitted");
      this.state.zipcode = this.$zipcodeInput.value;
      fetch(`${this.url}${this.state.zipcode}${this.apikey}`)
      .then(response => response.json())
      .then(data => {
          this.state.city = data.city;
          this.state.dates = data.list;
          this.state.selectedDate = null;
          this.$zipcodeInput.value = '';
          this.renderWeatherList(this.state.dates);
      })
      .catch(error => {alert("There was a problem making the fetch.")});

      this.clearCurrentDay();
    }

    renderWeatherList(weatherDays){
      console.log(weatherDays);
      console.log(this.state.city);
      const itemsHTML = weatherDays.map((weatherDay, index) => this.renderWeatherListItem(weatherDay, index)).join('');
      this.$weatherList.innerHTML = `<div class = "flex-parent"> ${itemsHTML} </div>`;
      for(var i = 0; i < weatherDays.length; i++)
      {
        let dayHTML = this.$weatherList.children[0].children[i];
        console.log(dayHTML.dataset.index);
        dayHTML.addEventListener('click', () => this.renderCurrentDay(dayHTML.dataset.index));
      }
    }

    renderWeatherListItem(weatherDay, index){
      var seconds = weatherDay.dt;
      var d  = new Date(seconds * 1000);

      return `
      <div class="weather-list-item" data-index="${index}">
        <h2> ${d.getMonth() + 1} / ${d.getDate()} </h2>
        <h3> ${this.getDayName(d.getDay())}</h3>
        <h3> ${weatherDay.temp.min} &deg;F &#124;
            ${weatherDay.temp.max} &deg;F
        </h3>
      </div>
      `
    }

    renderCurrentDay(index){
      console.log(index);
      var day = this.state.dates[index];

      var html = `<div class="current-day">
      <h1 class="day-header">${this.getDayName(new Date(day.dt*1000).getDay())} in ${this.state.city.name}</h1>
      <div class="weather">
      <p><img src='http://openweathermap.org/img/w/${day.weather[0].icon}.png' alt=‘DESCRIPTION’/>
      ${day.weather[0].description}</p>
      </div>
      <div class="details flex-parent">
          <div class="temperature-breakdown">
          <p>Morning Temperature: ${day.temp.morn} &deg;F</p>
          <p>Day Temperature: ${day.temp.day} &deg;F</p>
          <p>Evening Temperature: ${day.temp.eve} &deg;F</p>
          <p>Night Temperature: ${day.temp.night} &deg;F</p>
          </div>
      </div>
  </div>`
  document.getElementById("currentDay").innerHTML = html;
}

    getDayName(dayNum){
      switch(dayNum){
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
      }
    }

    clearCurrentDay(){
      console.log("Clearing currentDay");
      console.log(document.getElementById("currentDay"));
      document.getElementById("currentDay").innerHTML = "";
    }
}

window.addEventListener("load", () => new Weather());