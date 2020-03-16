var data = {
    discordID: message.author.id,
    gold: 100,
    level: 1,
    race: args[0],
    class: args[1],
    setTitleID: null,
    titles: [],
    materials: [],
    energy: {
        energy: 30,
        maxEnergy: 30,
        minutesForEnergy: 10,
        lastClaim: new Date()
    },
    skills: {
        mining: {
            level: 1,
            experience: 0,
        },
        foraging: {
            emote: ":herb:",
            level: 1,
            experience: 0
        },
        fishing: {
            emote: ":fishing_pole_and_fish:",
            level: 1,
            experience: 0
        },
        summoning: {
            emote: ":crystal_ball:",
            level: 1,
            experience: 0
        }
    },
    timeCreated: new Date()

}