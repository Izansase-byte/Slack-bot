const axios = require("axios");
require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/phoenix-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/phoenix-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command('/phoenix-music-search' , async ({command,ack, respond}) => {
  await ack();

try {
  const n_song = command.text;
  
  const answer = await axios.get(
    `https://itunes.apple.com/search?`,{
      params:{
        term: n_song,
        entity: 'song',
        limit: 1
      }
    });

  const info = answer.data;

  if (!info.results.length)
    return respond('Song was not found');

  const song = info.results[0];

  const year = new Date(song.releaseDate).getFullYear();

  await respond ({ 
      text:
    `
    Song name: ${song.trackName}
    Artist: ${song.artistName}
    Album: ${song.collectionName}
    Genre: ${song.primaryGenreName}
    Year of release: ${year}
    URL: ${song.trackViewUrl}`
    });

  }

  catch (error)
{ console.error('music error')
  await respond('Error finding the song')};
});



(async () => {
  try {await app.start();
  console.log("bot is running!");
  }
  catch(error){
    console.error('error al encender',error);
  }
})();