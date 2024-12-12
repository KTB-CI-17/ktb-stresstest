const generateAiResponse = async (page, aiMention) => {
  const messageInput = await page.getByPlaceholder('메시지를 입력하세요... (@를 입력하여 멘션,');
  await messageInput.fill(`${aiMention} hi`);

  const sendButton = await page.getByRole('button', { name: '메시지 보내기' });
  await sendButton.click();

  // AI 응답 검증 - MessageBubble 컴포넌트의 구조에 맞춤
  const messagesContainer = page.locator('div.messages');
  const lastMessage = messagesContainer.last();
  
  // MessageBubble 컴포넌트의 구조와 일치하는 검증
  await expect(lastMessage).toBeVisible();
  await expect(lastMessage.locator('div.message-content')).toBeVisible();
  await expect(lastMessage.locator('div.avatar-wrapper')).toContainText('AI');
  await expect(lastMessage.locator('div.message-group')).toBeVisible();

  console.info('AI response generated and verified.');
  await page.waitForTimeout(5000);
};

module.exports = { generateAiResponse };