import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = { csvData: [] };
  }

  componentWillMount() {
    //https://datahelpdesk.worldbank.org/knowledgebase/articles/898614-api-aggregates-regions-and-income-levels
    var csv = [];
    //fetching all high income countries.
    fetch('http://api.worldbank.org/v2/country?incomelevel=HIC&format=json')
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      //going through all results and querying for GDP value with the countryID.
      myJson[1].forEach(element => {
        var csvLine = []
        csvLine.push(element.name,element.latitude,element.longitude)
        fetch('http://api.worldbank.org/v2/countries/' + element.id + '/indicators/NY.GDP.MKTP.CD?date=2017&format=json')
        .then(function(response) {
          return response.json();
        })
        .then(gdpJson => {
          if (!gdpJson[1][0].value) {
            csvLine.push('this country has no GDP data for 2017, ')
          } else {
            csvLine.push(gdpJson[1][0].value + ', ')
          }
          csv.push(csvLine)
        });
      });
      this.setState( {csvData:csv})
    });
  }

  downloadCSV(){
    //https://stackoverflow.com/questions/18848860/javascript-array-to-csv/18849208#18849208
    let csv = this.state.csvData;
    var lineArray = [];
    csv.forEach(function (infoArray, index) {
    var line = infoArray.join(", ");
    lineArray.push(index === 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <button style={{height:50, width:450}} onClick={() =>  this.downloadCSV()}>Click To Download World Bank CSV</button>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
