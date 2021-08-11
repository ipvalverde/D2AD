/*

         88  ad888888b,                     88  
         88 d8"     "88                     88  
         88         a8P                     88  
 ,adPPYb,88      ,d8P"  ,adPPYYba,  ,adPPYb,88  
a8"    `Y88    a8P"     ""     `Y8 a8"    `Y88  
8b       88  a8P'       ,adPPPPP88 8b       88  
"8a,   ,d88 d8"         88,    ,88 "8a,   ,d88  
 `"8bbdP"Y8 88888888888 `"8bbdP"Y8  `"8bbdP"Y8  
                                                

 Thanks for checking out my project, feel free to reach out on Discord J3ax#8367 in case of help needed with this integration, please remember this is just a small script, I'm working on the full integration

 */

const { pseudoRandomBytes } = require("crypto");
const Discord = require("discord.js");
const client = new Discord.Client();
const Shell = require ('node-powershell');
const { checkServerIdentity } = require("tls");

const powershell = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

const generator = require('generate-password');

client.on("ready", () => {
    console.log(`Spawned as ${client.user.tag}!`);
    console.log(`[INFO] Displaying Active Directory status in General channel`);
console.log("    _  _____           _ ");
console.log("    | |/ __  \         | |");
console.log("  __| |`' / /' __ _  __| |");
console.log(" / _` |  / /  / _` |/ _` |");
console.log("| (_| |./ /__| (_| | (_| |");
console.log(" \__,_|\_____/\__,_|\__,_|");
                          


powershell.addCommand("(Get-WmiObject -Class Win32_ComputerSystem).PartOfDomain");
powershell.invoke().then(result => {
    
    var enrolled = result
    if (result = true){
        console.log("[INFO] The server running Discord Bot is correctly enrolled into an Active Directory Domain");
        powershell.clear();
        powershell.addCommand("(Get-WmiObject WIN32_ComputerSystem).Domain");
        powershell.invoke().then(result2 => {
            var domainName = result2
            const botSpawn = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Active Directory Integration is up and running')
            .addField('Domain Name:',`${String(domainName)}`, true)
            .addField('Enrolled:', `${String(enrolled)}`, true)
            client.channels.cache.get("874746481083559969").send(botSpawn);

        })
    } 

    if (result = false){

        console.log("[ERROR] The computer running the bot is not enrolled into an Active Directory Domain");
    }



}).catch(err=> {console.log(err);});


});



client.on("message", msg => {
    if (msg.content === "!ping") {
      msg.reply("pong");
    }

    if (msg.content === "!onboardme"){

        var userpassword = generator.generate({
            length: 15,
            numbers: true,
            symbols: true
        })
        var username = msg.author.username;
        console.log("[INFO] Onboarding user into Active Directory Domain");

        powershell.clear();
        powershell.addCommand("(Get-WmiObject WIN32_ComputerSystem).Domain");
        powershell.invoke().then(domainName =>{
            powershell.clear()
            var niceDomainName = domainName.replace(/(\r\n|\n|\r)/gm, "");
            console.log("Generating" + domainName );
            powershell.addCommand(`New-ADUser -Name "${username}" -GivenName "${username}" -Surname "Discord" -SamAccountName "${username}" -AccountPassword(ConvertTo-SecureString "${userpassword}" -AsPlainText -Force) -UserPrincipalName "${username}@${niceDomainName}" -Description "This account has been generated from Discord with the !onboardme command" -Enabled $true `)
            powershell.invoke().then(outcome => {
                msg.react('✅');
                if (outcome){( console.log("[INFO] Powershell generated an outcome:" + outcome))} else {console.log("[INFO] Command run succesfully, no outcome provided by Powershell")};          
                msg.author.send('Your Active Directory Account has been succesfully created, please login using \n Username: `' + username + '`\n Password: `' + userpassword + '` \n Thanks for using D2AD! ')
            })
        })

        }
    })

    


  client.login("ODc0NzQ2MjE3MzIwNTUwNDIx.YRLc5g.J9-6QgdVH-tydejhuhjX6Zh0AaU");

