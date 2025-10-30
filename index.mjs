import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
import rm from 'rick-and-morty-forever';

// helper function to fetch multiple character objects from an array of URLs
async function fetchResidents(residentUrls) {
  const residents = [];
  if (!residentUrls || residentUrls.length === 0) {
    return residents;
  }
  for (let i = 0; i < residentUrls.length; ++i) {
   const url = residentUrls[i];
   const response = await fetch(url);
   const data = await response.json();
   residents.push(data);
  }
  return residents;
}

app.get("/characters", async (req, res) => {
   let page;
   if (req.query.page) {   // default to page 1 if no page provided
      page = parseInt(req.query.page);
   } else {
      page = 1;
   }
   let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
   let rawData = await fetch(url);
   let cookedData = await rawData.json();
   let nextPage = null;
   let prevPage = null;
   if (cookedData.info.next !== null) {
      nextPage = page + 1;
   }
   if (cookedData.info.prev !== null) {
      prevPage = page - 1;
   }
   res.render("characters.ejs", {
      characters: cookedData.results,
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page,
      active: 'characters'
   });
});

app.get("/", (req, res) => {
   res.redirect("/characters");
});

app.get("/character/:id", async (req, res) => {
   let charId = req.params.id;
   let charRawData = await fetch("https://rickandmortyapi.com/api/character/" + charId);
   let charCookedData = await charRawData.json();
   let originRawData = null;
   let originCookedData = null;
   let residentsData = null;
   if (charCookedData.origin.url) {
      originRawData = await fetch(charCookedData.origin.url);
      originCookedData = await originRawData.json();
      residentsData = await fetchResidents(originCookedData.residents);
   }
   res.render("character.ejs", {
      character: charCookedData,
      residents: residentsData,
      active: "none"
   });
});

app.get("/quotes", async (req, res) => {
   let max = 4;
   let min = 1;
   let range = max - min + 1;
   let rando = Math.floor(Math.random() * range) + min;

   let characters = { 1: "rick", 2: "morty", 3: "summer", 4: "beth" };
   let character = characters[rando];

   let quotesList = rm[character];
   if (!quotesList) {
      console.error("No quotes found for:", character);
      return res.status(500).send("Character quotes not found.");
   }
   let quoteCount = quotesList.length;
   let randomQuoteIndex = Math.floor(Math.random() * quoteCount);
   let characterQuote = quotesList[randomQuoteIndex];

   let charUrl = "https://rickandmortyapi.com/api/character/" + rando;
   let charRawData = await fetch(charUrl);
   let charCookedData = await charRawData.json();

   res.render("quote.ejs", {
      character: charCookedData,
      quote: characterQuote,
      active: "quotes"
   });
});

app.listen(3000, () => {
   console.log('server started');
});
