module.exports = {
  config: {
    name: "murgi",
    version: "1.2.1",
    author: "JOY",
    role: 2,
    cooldown: 5,
    description: "Reply or tag someone to roast with full list",
    category: "fun",
    usePrefix: true
  },

  onStart: async function ({ bot, chatId, msg }) {
    try {
      let name = "User";

      // 👉 Reply system
      if (msg.reply_to_message) {
        name =
          msg.reply_to_message.from.first_name ||
          msg.reply_to_message.from.username ||
          "User";
      }

      // 👉 Mention system (@username)
      else if (msg.entities) {
        const mention = msg.entities.find(e => e.type === "mention");
        if (mention) {
          name = msg.text.substring(
            mention.offset,
            mention.offset + mention.length
          );
        }
      }

      // ❌ কিছুই না থাকলে silent
      else {
        return;
      }

      const send = (text) => bot.sendMessage(chatId, text);

      send("চুদা লো শুরু করলাম...");

      setTimeout(() => send("খাংকির পোলা তর মারে চুদি 🥰। " + name), 3000);
      setTimeout(() => send("খাংকির পোলা তর কচি বোন রে চুদি 😍.. " + name), 5000);
      setTimeout(() => send("মাদারচোদ তর আম্মু পম পম খাংকির পো 🐰 " + name), 7000);
      setTimeout(() => send("খাংকির পোলা তর কচি ভুদায় ভুদায় কামর দিমু 💔! " + name), 9000);
      setTimeout(() => send("খাংকি মাগির পোলা কথা ক কম কম তর আম্মু রে চুদে বানামু আইটেম বোম " + name), 12000);
      setTimeout(() => send("depression থেকেও তর মাইরে চু*** দি 🤬 " + name), 15000);
      setTimeout(() => send("তর আম্মু রে আচার এর লোভ দেখি চুদি মাগির পোলা🤬 " + name), 17000);
      setTimeout(() => send("বান্দির পোলা তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟 " + name), 20000);
      setTimeout(() => send("বান্দি মাগির পোলা তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে 🤝 " + name), 23000);
      setTimeout(() => send("উফফফ খাদ্দামা মাগির পোলা তর আম্মুর কালা ভুদায় আমার মাল আউট তর কচি বোন রে উপ্তা করে এবার চুদবো 💉। " + name), 25000);
      setTimeout(() => send("অনলাইনে গালি বাজ হয়ে গেছত মাগির পোলা এমন চুদা দিমু লাইফ টাইম মনে রাখভি জয় তর বাপ মাগির ছেলে 😘। " + name), 28500);
      setTimeout(() => send("বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে ✋ " + name), 31000);
      setTimeout(() => send("হাই মাদারচোদ তর তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি " + name), 36000);
      setTimeout(() => send("~ চুদা কি আরো খাবি মাগির পোল 🤖"), 39000);
      setTimeout(() => send("খাংকির পোলা 🥰। " + name), 42000);
      setTimeout(() => send("মাদারচোদ😍.. " + name), 48000);
      setTimeout(() => send("ব্যাস্যার পোলা 🐰 " + name), 51000);
      setTimeout(() => send("ব্যাশ্যা মাগির পোলা 💔! " + name), 54000);
      setTimeout(() => send("পতিতা মাগির পোলা " + name), 57000);
      setTimeout(() => send("তর মারে চুদি " + name), 63000);
      setTimeout(() => send("নাট বল্টু মাগির পোলা🤟 " + name), 66000);
      setTimeout(() => send("তর বোন রে পায়জামা খুলে চুদি 🤣 " + name), 69000);
      setTimeout(() => send("উম্মম্মা তর বোন এরকচি ভুদায়💉। " + name), 72000);
      setTimeout(() => send("DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম। " + name), 75000);
      setTimeout(() => send("কামলা মাগির পোলা ✋ " + name), 81000);
      setTimeout(() => send("বাস্ট্রাড এর বাচ্ছা বস্তির পোলা " + name), 87000);
      setTimeout(() => send("~ আমার জারজ শন্তান🤖"), 93000);
      setTimeout(() => send("Welcome মাগির পোলা 🥰। " + name), 99000);
      setTimeout(() => send("তর কচি বোন এর পম পম😍.. " + name), 105000);
      setTimeout(() => send("ব্যাস্যার পোলা কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰 " + name), 111000);
      setTimeout(() => send("Hi জয় এর জারজ মাগির পোলা 💔! " + name), 114000);
      setTimeout(() => send("২০ টাকা এ পতিতা মাগির পোলা " + name), 120000);
      setTimeout(() => send("বস্তির ছেলে অনলাইনের কিং " + name), 132000);
      setTimeout(() => send("টুকাই মাগির পোলা🤟 " + name), 138000);
      setTimeout(() => send("তর আম্মু রে পায়জামা খুলে চুদি 🤣 " + name), 144000);
      setTimeout(() => send("হিজলা মাগির পোলা ✋ " + name), 162000);
      setTimeout(() => send("বস্তিরন্দালাল এর বাচ্ছা বস্তির পোলা " + name), 168000);
      setTimeout(() => send("~ আমার জারজ শন্তান জা ভাগ🤖"), 171000);
      setTimeout(() => send("তোর বাপে তোর নানা। 🤬 " + name), 175000);
      setTimeout(() => send("বস্তির ছেলে তোর বইনরে মুসলমানি দিমু। " + name), 180000);
      setTimeout(() => send("তোর মুখে হাইগ্যা দিমু। 🤣 " + name), 185000);
      setTimeout(() => send("তর আম্মুর হোগা দিয়া ট্রেন ভইরা দিমু।। " + name), 190000);
      setTimeout(() => send("কুত্তার বাচ্ছা তর বৌন ভোদায় মাগুর মাছ চাষ করুম।😍.. " + name), 195000);
      setTimeout(() => send("তর মায়ের ভোদা বোম্বাই মরিচ দিয়া চুদামু।💔! " + name), 200000);
      setTimeout(() => send("জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬 " + name), 205000);
      setTimeout(() => send("তর মায়ের ভুদাতে পোকা। " + name), 210000);
      setTimeout(() => send("তর মার ভোদায় পাব্লিক টয়লেট।🤟 " + name), 215000);
      setTimeout(() => send("~ আমার পুত। জা ভাগ🤖"), 220000);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Error hoise");
    }
  }
};
