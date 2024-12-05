const generateAiResponse = async (page, aiMention) => {
  if (!page.url().includes('https://bootcampchat-fe.run.goorm.site/chat?room=')) {
    console.error('This page is not a valid chat room.');
    return;
  }

  const messageInput = await page.getByPlaceholder('메시지를 입력하세요... (@를 입력하여 멘션,');
  await messageInput.fill(`${aiMention} hi`);

  const sendButton = await page.getByRole('button', { name: '메시지 보내기' });
  await sendButton.click();

  console.info('AI response generated.');
};

module.exports = { generateAiResponse };