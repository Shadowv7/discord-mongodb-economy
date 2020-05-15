const mongoeconomy = require("../src/")

// Connect to the database
mongoeconomy.connectDatabase("mongodb://localhost:27017/mongoeconomy");

// Disconnect from the database
mongoeconomy.disconnectDatabase();