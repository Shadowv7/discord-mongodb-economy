<a href="https://nodei.co/npm/discord-mongodb-economy/"><img src="https://nodei.co/npm/discord-mongodb-economy.png?downloads=true&downloadRank=true&stars=true"></a>

<a href="https://discord.gg/qvzwqaM"><img src="https://discord.com/api/guilds/661897530459684865/widget.png" alt="Discord server"/></a>

# Discord-Mongodb-Economy

A lightweight and easy to use javascript economy framework that uses mongoDB. The best module for roleplay bots.

# Bugs and glitches

Feel free to report all bugs and glitches by creating an issue in the <a href="https://github.com/Mr-KayJayDee/discord-mongodb-economy/issues">issue section.</a>

A correct and understandable issue contains : 
- Steps to reproduce 
- Code that summonned the error
- The complete error

You can also join me on my <a href="https://discord.gg/qvzwqaM">discord server.</a>

# Download

You can download it from <a href="https://www.npmjs.com/package/discord-mongodb-economy">npmjs</a>.

```cli
npm i discord-mongodb-economy
```

# Configuration

The first step is to import the module in your code.

```js
const mongoEconomy = require("discord-mongodb-economy");
```

Then you need to connect to the mongoDB database.

```js
mongoEconomy.connectDatabase("mongodb://localhost:27017/mongoeconomy"); //This need to be done only once.
```
> I suppose you to initialize the database in your ready event.

You can also disconnect from the database after all your actions.

```js
mongoEconomy.disconnectDatabase();
```

> You would have to reconnect to the database. Use it only if yout shutting your process down or reconnectiong for another action.

# Methods

## Here are all the available methods of the module.

**connectDatabase()**

Connect to the mongodb database.

```js
const member = await mongoeconomy.connectDatabase(<MongoDBUrl>, { <MongoDBOptions> } )
```
> Options are optionnals.
- Expected output :
``
Promise<Boolean>
``

**disconnectDatabase()**

Disconnect from the mongodb database.

```js
const member = await mongoeconomy.disconnectDatabase()
```
- Expected output :
``
Promise<Boolean>
``

**createMember()**

If there is no entry, create one in the database for the specified member in the specified guild.

```js
const member = await mongoeconomy.createMember(<MemberId>, <GuildId>)
```
- Expected output :
``
Promise<Object>
``

**deleteMember()**

If there is one, delete the entry in the database for the specified member in the specified guild.

```js
const member = await mongoeconomy.deleteMember(<MemberId>, <GuildId>)
```
- Expected output :
``
Promise<Object>
``

**attributeXp()**

Add an amount of xp to an member. It re-calculate the level for the final amount of xp.

```js
const member = await mongoeconomy.attributeXp(<MemberId>, <GuildId>, <Amount>)
```
> **\<Amount\>** need to be a number.
> You can also use it to substract an amount.
- Expected output :
``
Promise<Boolean>
``

**attributeLevel()**

Add an amount of level to an member. It re-calculate the level for the final amount of xp.

```js
const member = await mongoeconomy.attributeLevel(<MemberId>, <GuildId>, <Amount>)
```
> **\<Amount\>** need to be a number.
> You can also use it to substract an amount.
- Expected output :
``
Promise<Object>
``

**fetchMember()**

Fetch the informations of a member.

```js
const member = await mongoeconomy.fetchMember(<MemberId>, <GuildId>)
```
- Expected output :
``
Promise<Object>
``

**getLeaderBoard()**

Get the raw data of the guild leaderboard.

```js
const rawData = await mongoeconomy.getLeaderBoard(<GuildID>, <Limit>)
```
> **\<Limit\>** need to be a number.
- Expected output :
``
Promise<Array [Objects]>
``

**convertLeaderBoard()**

Convert the raw data of the leaderboard.

```js
const rawData = await mongoeconomy.convertLeaderBoard(<Discord Client>, <RawData>)
```
> **\<RawData\>** the getLeaderBoard() output
- Expected output :
``
Array[Objects]
``

**setXp()**

Set the xp of a member, reset the current amount an re-calculate the level

```js
const member = await mongoeconomy.setXp(<MemberId>, <GuildId>, <Amount>)
```
> **\<Amount\>** need to be a number.
- Expected output :
``
Promise<Object>
``

**setLevel()**

Set the level of a member, reset the current amount an re-calculate the xp

```js
const member = await mongoeconomy.setLevel(<MemberId>, <GuildId>, <Amount>)
```
> **\<Amount\>** need to be a number.
- Expected output :
``
Promise<Object>
``

# Full bot example using all the methods

```js
// Import the discord.js library.
const Discord = require("discord.js")
// Create a new discord.js client.
const bot = new Discord.Client()

// Import the module
const mongoeconomy = require("discord-mongodb-economy");

// Listen to the ready event
bot.on("ready", () => {
    // Connexion to the database
    mongoeconomy.connectDatabase("mongodb://localhost:27017/mongoeconomy");
})

// Listen to the message event
bot.on("message", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    var prefix = "*"

    // Add a random ammount of xp to at every messages, check if the member has levlled up
    var randomXp = Math.floor(Math.random() * 49) + 1;
    var hasLevelUp = await mongoeconomy.attributeXp(message.member.id, message.guild.id, randomXp);
    if (hasLevelUp) {
        // fetch the member
        // return false if there is no entry for the member
        let member = await mongoeconomy.fetchMember(message.member.id, message.guild.id);
        message.channel.send(`${message.member}, congratulations! You have reached the level **${member.level}**. :tada:`);
    }

    // Create an entry in the database for the member
    // return false if there is already an entry
    if (message.content === prefix + "create") {
        let created = await mongoeconomy.createMember(message.member.id, message.guild.id);
        message.reply(`Your entry has been created\n${created}.`);
    }

    // Delete the entry in the database for the member
    // return false if there is no entry for the member
    if (message.content === prefix + "delete") {
        let deleted = mongoeconomy.deleteMember(message.member.id, message.guild.id);
        console.log(deleted);
        message.reply(`Your entry has been deleted\n${deleted}.`);
    }

    // Get your current xp and level
    if (message.content === prefix + "xp") {
        let mention = message.mentions.members.first() ? message.mentions.members.first() : message.member;
        let member = await mongoeconomy.fetchMember(mention.id, message.guild.id);
        if (!member) return message.channel.send("You haven't earned any xp or level...")
        message.channel.send(`You have ${member.xp} points and you are at level ${member.level}.`)
    }

    if (message.content === prefix + "leaderboard") {
        let raw = await mongoeconomy.getLeaderBoard(message.guild.id, 10);
        let data = await mongoeconomy.convertLeaderBoard(bot, raw);

        let leaderboard = data.map(e => `${e.position}. ${e.membername}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}\n`);
        message.channel.send(leaderboard)
    }

    if (message.content === prefix + "setxp") {
        let member = await mongoeconomy.setXp(message.member.id, message.guild.id, 100)
        message.channel.send(`You are now at level ${member.level} with ${member.xp} xp`)
    }

    if (message.content === prefix + "setlevel") {
        let member = await mongoeconomy.setLevel(message.member.id, message.guild.id, 100)
        message.channel.send(`You are now at level ${member.level} with ${member.xp} xp`)
    }
})

// Log in to the bot
bot.login("super_secret_token")
```


