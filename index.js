require('dotenv').config();

const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');
const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());
bot.api.setMyCommands([
  { command: 'start', description: 'Запуск бота' },
  { command: 'menu', description: 'Menu' },
]);

bot.command('start', async (ctx) => {
  await ctx.reply('Вы запустили бота');
});

const menuKeyboard = new InlineKeyboard()
  .text('Узнать статус заказов', 'order-status')
  .text('Обратиться в поддержку', 'support');
const backKeyboard = new InlineKeyboard().text('< Назад', 'back');

bot.command('menu', async (ctx) => {
  await ctx.reply('Выберите пункт меню', {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery('order-status', async (ctx) =>{ 
  await ctx.callbackQuery.message.editText('Статус заказа: в Пути',{ 
    reply_markup: backKeyboard
  })
  await ctx.answerCallbackQuery();
})
bot.callbackQuery('back', async (ctx) =>{ 
  await ctx.callbackQuery.message.editText('Выберите пункт меню',{ 
    reply_markup: menuKeyboard
  })
  await ctx.answerCallbackQuery();
})




bot.command('inline_keyboard', async (ctx) => {
  const moodKeyboard = new InlineKeyboard()
    .text('1', 'btn-1')
    .text('2', 'btn-2');
  await ctx.reply('Выбери цифры', {
    reply_markup: moodKeyboard,
  });
});
// bot.callbackQuery(['btn-1', 'btn-2'], async (ctx) =>{
//   await ctx.answerCallbackQuery('OPOPOPOOP')
//   await ctx.reply('Вы выбрали! Урааа')
// })
bot.on('callback_query:data', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(`Вы нажали на кнопку ${ctx.callbackQuery.data}`);
});
bot.command('share', async (ctx) => {
  const moodKeyboard = new Keyboard()
    .requestLocation('Геолокация')
    .requestContact('Контакт')
    .requestPoll('Опрос')
    .resized()
    .placeholder('Укажи данные');
  await ctx.reply('Чем хочешь поделиться?', {
    reply_markup: moodKeyboard,
  });
});
bot.command('mood', async (ctx) => {
  const moodKeyboard = new Keyboard()
    .text('Хорошо')
    .text('Норм')
    .row()
    .text('Плохо')
    .resized()
    .oneTime();
  await ctx.reply('Как настроение?', {
    reply_markup: moodKeyboard,
  });
});
bot.command(['say_something', 'say_hello', 'whatsup'], async (ctx) => {
  await ctx.reply('Lets gooo');
});
bot.on('::mention', async (ctx) => {
  await ctx.reply('Вы упомянули');
});
bot.hears('пинг', async (ctx) => {
  await ctx.react('⚡', {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.reply('Красавчик <a href="https://google.com">GOGOOG</a>', {
    reply_parameters: { message_id: ctx.msg.message_id },
    parse_mode: 'HTML',
  });
});
bot.hears('ID', async (ctx) => {
  console.log(ctx.from);

  await ctx.reply(
    `Инфа: ИМЯ - ${ctx.from.first_name} НИК - ${ctx.from.username}`
  );
});
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.log('Error in request', e.description);
  } else if (e instanceof HttpError) {
    console.log('Could not contact Telegram', e);
  } else {
    console.log('Unknown Error', e);
  }
});
bot.start();