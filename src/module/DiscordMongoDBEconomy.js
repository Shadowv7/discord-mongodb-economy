const mongoose = require("mongoose");

const MemberData = require("../../models/guildMember");

const UserData = require("../../models/user");

class DiscordMongoDBEconomy {

    /**
     * Connect to the mongoDB database
     * @param {string} dbUrl - The url of the mongoDB database
     * @param {object} dbOptions - The options for the mongoDB database connection
     */
    static async connectDatabase(dbUrl, dbOptions) {
        if (!dbUrl) throw new TypeError("A database adress must be provided.");
        if (!dbOptions) dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.connect(dbUrl, dbOptions).catch(error => console.log(error));
        mongoose.connection.on("disconnected", () => console.log(`Mongoose disconnected.`));
        mongoose.connection.on("err", err => console.log(`Mongoose connexion error...\n${err.stack}`));
        return true;
    }

    /**
     * Disconnect from the database
     */
    static async disconnectDatabase() {
        return mongoose.connection.close();
    }

    /**
     * Create an user if there are no entry in the database for him
     * @param {string} memberId - The id of the member
     * @param {string} guildId - The id of the guild
     */
    static async createMember(memberId, guildId) {
        if (!memberId) throw new TypeError("A member id must be specified.");
        if (!guildId) throw new TypeError("A guild id must be specified.");

        let existent = await MemberData.findOne({
            memberID: memberId,
            guildID: guildId
        });
        if (existent) return false;

        let create = new MemberData({
            memberID: memberId,
            guildID: guildId
        });

        await create.save().catch(e => console.log(`An error occured while creating the user : ${e}`));

        return create;
    }

    /**
     * Delete an user if there is an entry in the database for him
     * @param {string} memberId - The id of the member
     * @param {string} guildId - The id of the guild
     */
    static async deleteMember(memberId, guildId) {
        if (!memberId) throw new TypeError("A member id must be specified.");
        if (!guildId) throw new TypeError("A guild id must be specified.");

        let member = await MemberData.findOne({
            memberID: memberId,
            guildID: guildId
        });
        if (!member) return false;

        await MemberData.findOneAndDelete({
            memberID: memberId,
            guildID: guildId
        }).catch(e => console.log(`An error occured while deleting the user : ${e}`));

        return member;
    }

    /**
     * Add a 
     * @param {string} memberId - The id of the member
     * @param {string} guildId - The id of the guild
     * @param {number} xp - Amount of xp to add or substract at every messages
     */
    static async attributeXp(memberId, guildId, xp) {
        if (!memberId) throw new TypeError("A member id must be specified.");
        if (!guildId) throw new TypeError("A guild id must be specified.");
        if (!xp) throw new TypeError("An amount of xp must be specified.");
        if (xp < 1) throw new TypeError("The given xp amount cannot be lower than 1.")
        if (isNaN(xp)) throw new TypeError("The given xp amount must be a number.")

        let member = await MemberData.findOne({
            memberID: memberId,
            guildID: guildId
        });

        if (!member) {
            let newUser = new MemberData({
                memberID: memberId,
                guildID: guildId,
                xp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp))
            });

            await newUser.save().catch(e => console.log(`An error occured while saving the user : ${e}`));

            return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
        };

        member.xp += xp;
        member.level = Math.floor(0.1 * Math.sqrt(member.xp));

        await member.save().catch(e => console.log(`An error occured while saving the user : ${e}`));

        return (Math.floor(0.1 * Math.sqrt(member.xp -= xp)) < member.level);
    }

    /**
     * Add a 
     * @param {string} memberId - The id of the member
     * @param {string} guildId - The id of the guild
     * @param {number} levelToAttribute - Amount of level to add or substract
     */
    static async attributeLevel(memberId, guildId, levelToAttribute) {
        if (!memberId) throw new TypeError("A member id must be specified.");
        if (!guildId) throw new TypeError("A guild id must be specified.");
        if (!levelToAttribute) throw new TypeError("An amount of level must be specified.");
        if (levelToAttribute < 1) throw new TypeError("The given level amount cannot be lower than 1.")
        if (isNaN(levelToAttribute)) throw new TypeError("The given level amount must be a number.")

        let member = await levels.findOne({
            memberID: memberId,
            guildID: guildId
        });
        if (!member) return false;

        member.level += levelToAttribute;
        member.xp = member.level * member.level * 100;

        member.save().catch(e => console.log(`An error occured while saving the user : ${e}`));

        return member;
    }

    /**
     * Fetch the informations of a member
     * @param {string} memberId - The id of the member
     * @param {string} guildId - The id of the guild
     */
    static async fetchMember(memberId, guildId) {
        if (!memberId) throw new TypeError("A member id must be specified.");
        if (!guildId) throw new TypeError("A guild id must be specified.");

        let member = await MemberData.findOne({
            memberID: memberId,
            guildID: guildId
        });
        if (!member) return false;

        return member;
    }
}


module.exports = DiscordMongoDBEconomy;