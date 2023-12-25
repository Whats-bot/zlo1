import { execSync } from 'child_process';

const handler = async (m, { conn, text }) => {
  try {
          const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
          let messager = stdout.toString()
          if (messager.includes('Already up to date.')) messager = '_*< Обновление исходного кода />*_\n\n*[ ✅ ] Все последние обновления установлены.*'
          if (messager.includes('Updating')) messager = '_*< Обновление исходного кода />*_\n\n*[ ℹ️ ] Обновление успешно завершено.*\n\n' + stdout.toString()
          conn.reply(m.chat, messager, m);
  } catch {      
 try {    
      const status = execSync('git status --porcelain');
      if (status.length > 0) {
        const conflictedFiles = status
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('MysticSession/') || line.includes('npm-debug.log')) {
              return null;
            }
            return '*→ ' + line.slice(3) + '*';
          })
          .filter(Boolean);
        if (conflictedFiles.length > 0) {
          const errorMessage = `_*< Обновление исходного кода />*_\n\n*[ ℹ️ ] Были внесены локальные изменения в файлы бота, которые конфликтуют с обновлениями репозитория. Чтобы выполнить обновление, переустановите бота или выполните обновления вручную.*\n\n*Конфликтующие файлы:*\n\n${conflictedFiles.join('\n')}.*`;
          await conn.reply(m.chat, errorMessage, m);  
        }
      }
  } catch (error) {
    console.error(error);
    let errorMessage2 = '_*< Обновление исходного кода />*_\n\n*[ ℹ️ ] Произошла ошибка. Пожалуйста, попробуйте еще раз позже.*';
    if (error.message) {
      errorMessage2 += '\n*- Mensaje de error:* ' + error.message;
    }
    await conn.reply(m.chat, errorMessage2, m);
  }
 }
};
handler.command = /^(обновить|actualizar|gitpull)$/i;
handler.rowner = true;
export default handler;
