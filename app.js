//Global constants and variables

let word;
let phonetic;
let requestedWord;
let meaningsCount;  
let partsOfSpeech = [];
let defs = [];
let synonyms = []; 
let antonyms = [];  
let URL = `https://api.dictionaryapi.dev/api/v2/entries/en/dictionary`;

//Search click handler
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
    requestedWord = document.getElementById("searchInput").value;
    if(requestedWord) {
        URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${requestedWord}`;
        process(requestedWord);
    }
    else {
        alert("Enter a word to search");
    }
})

//Search hover handler
searchButton.addEventListener("mouseover", () => {
    searchButton.style.background = 'black';
})

//Mouseout
searchButton.addEventListener("mouseout", () => {
    searchButton.style.background = '#ff414e';
})

async function fetchData () {

    //Sending an API request
    const response = await fetch(URL);

    if(response.ok) {

        //clearing previous data

        partsOfSpeech = [];
        defs = [];
        synonyms = [];
        antonyms = [];

        //setting up new data

        const temp = await response.json();
        const data = temp[0];
        word = data.word;
        phonetic = data.phonetic;
        meaningsCount = data.meanings.length;

        for(let x = 0; x < meaningsCount; x++) {
            partsOfSpeech.push(data.meanings[x].partOfSpeech);
            defs.push(data.meanings[x].definitions[0].definition);
        }
          
        for(let i = 0; i < meaningsCount; i++) {
            let syns = data.meanings[i].synonyms;
            synonyms = synonyms.concat(syns);
            let ants = data.meanings[i].antonyms;
            antonyms = antonyms.concat(ants);
        }

        console.log("Fetched Data Successfully! \n");
    }
    else {
        console.error("Error fetching data");
    }
}

function setData() {
    let wordHTML = document.getElementById('word');
    wordHTML.innerText = requestedWord;

    let phoneticHTML = document.getElementById('phonetic');
    if(phonetic) {
        phoneticHTML.innerText = "(" + phonetic + ")";
    }
    else {
        phoneticHTML.innerText = "(Phonetic Not Found)";
    }

    let definitionsHTML = document.querySelector('.definitions');
    definitionsHTML.innerHTML = '';
    for(let x = 0; x < meaningsCount; x++) {
        let currentDef = document.createElement('p');
        currentDef.innerText = "(" + partsOfSpeech[x] + ") " + defs[x];
        definitionsHTML.appendChild(currentDef);
    }

    let synonymsHTML = document.querySelector('.synonyms');
    synonymsHTML.innerHTML = '';
    let newSyns = document.createElement('p');
    (synonyms.length) ? newSyns.innerText = synonyms.toString() : newSyns.innerText = "No synonyms found for " + requestedWord;
    synonymsHTML.appendChild(newSyns);

    let antonymsHTML = document.querySelector('.antonyms');
    antonymsHTML.innerHTML = '';
    let newAnts = document.createElement('p');
    (antonyms.length) ? newAnts.innerText = antonyms.toString() : newAnts.innerText = "No antonyms found for " + requestedWord;
    antonymsHTML.appendChild(newAnts);

}
async function process() {
    await fetchData();
    setData();
}

//IIFE to show default data
(() => {
    let wordHTML = document.getElementById('word');
    wordHTML.innerText = "Waiting for Word";

    let phoneticHTML = document.getElementById('phonetic');
    phoneticHTML.innerText = "(Phonetic Not Found)";

    let definitionsHTML = document.querySelector('.definitions');
    let def = document.createElement('p');
    def.innerText = "We are counting on you to fetch definition(s)";
    definitionsHTML.appendChild(def);

    let synonymsHTML = document.querySelector('.synonyms');
    let newSyns = document.createElement('p');
    newSyns.innerText = "Give me a word, I'll give synonyms!";
    synonymsHTML.appendChild(newSyns);

    let antonymsHTML = document.querySelector('.antonyms');
    let newAnts = document.createElement('p');
    newAnts.innerText = "Give me a word, I'll give antonyms!";
    antonymsHTML.appendChild(newAnts);
}) ();


