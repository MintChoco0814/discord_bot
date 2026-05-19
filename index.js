require("dotenv").config();

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const readMenu = require('./module_fd/readMenu.js');
const readTimeTable = require("./module_fd/readTimeTable.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});



client.once("ready", () => {
    console.log(`${client.user.tag} 로그인 완료`);
});
const PREFIX = '/';


client.on("messageCreate",async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "식단") {
        try {
            const menu_json = await readMenu();

            let result = "```txt\n";
            result += "요일 | 식단\n";
            result += "-----|------------------\n";

            let prevDay = "";

            for (const menu of menu_json) {
                if (prevDay !== "" && prevDay !== menu.요일) {
                    result += "-----|------------------\n";
                }
                result += `${menu.요일} \n   | ${menu.식단내용.join("\n   | ")}\n`;
                prevDay = menu.요일;
            }

            result += "```";

            await message.reply(result);

        } catch (err) {
            console.error(err);
            message.reply("오류 ㅈㅅ ㅋㅋ");
        }
    }

    if (command === '시간표') {
        try{
            const timeTable = await readTimeTable();
            let result = "```txt\n";
            result += "요일 | 과목             | 시간\n";
            result += "-----|------------------|-------------\n";
            let prevDay = "";
            for(const day of timeTable){
                if (prevDay !== "" && prevDay !== day.요일) {
                    result += "-----|----------------------|-------------\n";
                }               
                if (Array.isArray(day.과목)) {
                for (let i = 0; i < day.과목.length; i++) {
                    result += `${day.요일.padEnd(4)} | ${day.과목[i].padEnd(16)} | ${day.시간[i]}\n`;
                }
                } else {
                    result += `${day.요일.padEnd(4)} | ${day.과목.padEnd(16)} | ${day.시간}\n`;
                }
                prevDay = day.요일;
            }
            result += "```";
            await message.reply(result);

        }catch(err) {
            console.error(err);
            message.reply("오류 죄송 ㅋㅋ");
        }
    }

    if (command === "청소") {
        const amount = parseInt(args[0]) + 1;

        if (!amount) {
            return message.reply("사용법: /청소 10");
        }

        if (amount < 1 || amount > 100) {
            return message.reply("1~100 사이 숫자만 입력 가능");
        }
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
               return message.reply("짬먹고해");
}
        try {
            await message.channel.bulkDelete(amount, true);

            const msg = await message.channel.send(`${amount - 1}개 대화 내용 싹싹 김치`);

            setTimeout(() => {
                msg.delete().catch(() => {});
            }, 3000);

        } catch (err) {
            console.error(err);
            message.reply("오류 ㅋㅋ");
        }
    }
});

client.login(process.env.TOKEN);