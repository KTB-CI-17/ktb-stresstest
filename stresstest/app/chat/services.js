const path = require('path');

const accessChat = async (page, chatName) => {    
  const rows = await page.locator('tr');
  const targetRow = await rows.filter({ hasText: chatName });

  await targetRow.locator("button:has-text('입장')").first().click();
  await page.waitForTimeout(3000);

  await expect(page).toHaveURL(/\/chat/);
  await expect(page.locator('div.chat-header')).toBeVisible();
  await expect(page.locator('div.chat-header h2')).toContainText(chatName);
  
  console.info('Chat accessed and verified');
};

const createChat = async (page, chatName) => {
  const newChatButton = page.getByRole('button', { name: '새 채팅방' });
  await newChatButton.click();

  const chatNameInput = page.getByPlaceholder('채팅방 이름을 입력하세요');
  await chatNameInput.fill(chatName);

  const createChatButton = page.getByRole('button', { name: '채팅방 만들기' });
  await createChatButton.click();

  await page.waitForTimeout(3000);
  console.info('Chat created');
};


const talkChat = async (page, text) => {
  const messageInput = page.getByPlaceholder('메시지를 입력하세요... (@를 입력하여 ���션,');
  const sendButton = page.getByRole('button', { name: '메시지 보내기' });

  for (let i = 0; i < 3; i++) {
    await messageInput.fill(text);
    await sendButton.click();
  }
  await page.waitForTimeout(1000);

  const messages = page.locator('div.messages');
  const lastMessages = await messages.all();
  const lastThreeMessages = lastMessages.slice(-3);
  
  for (const message of lastThreeMessages) {
    await expect(message.locator('div.message-content')).toContainText(text);
    await expect(message.locator('div.message-group')).toBeVisible();
    await expect(message.locator('div.message-info')).toBeVisible();
    await expect(message).not.toHaveClass(/error/);
  }

  console.info('Chat messages sent and verified');
};

const addReactions = async (page, findText, reaction) => {
  await page.waitForTimeout(2000);
  const messagesLocator = await page.locator('div.messages');
  const messages = await messagesLocator.all();
  console.log("message count: ", messages.length);

  const verificationResults = await Promise.all(
    messages.map(async (message) => {
      try {
        const messageText = await message.locator('div.message-content').innerText();
        if (!messageText.includes(findText)) return false;

        const reactionButton = await message.locator('button[title="리액션 추가"]');
        if (!await reactionButton.isVisible()) return false;

        await reactionButton.click();
        const allReactions = await page.locator('button[aria-label]').all();
        
        if (allReactions.length > 0) {
          const randomReactionIndex = Math.floor(Math.random() * allReactions.length);
          const randomReaction = allReactions[randomReactionIndex];

          if (await randomReaction.isVisible()) {
            await randomReaction.click({ force: true });
            
            // 리액션 추가 검증
            await expect(message.locator('div.message-reactions')).toBeVisible();
            await expect(message.locator('div.message-reactions button')).toBeVisible();
            
            console.info(`${randomReactionIndex} Random reaction added and verified`);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Error processing message:', error);
        return false;
      }
    })
  );

  // 최소 하나 이상의 리액션이 성공적으로 추가되었는
};
  
  const scrollDown = async (page) => {
    const tableHeader = page.locator('#table-wrapper table thead tr');
    const boundingBox = await tableHeader.boundingBox();
    if (!boundingBox) {
      console.info('Bounding box not found for the element.');
      return;
    }
  
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2
    );
  
    console.info('Scroll started');
    let stopScrolling = false;
  
    setTimeout(() => {
      console.info('Scroll stopped after 5 seconds.');
      stopScrolling = true;
    }, 10000);
  
    try {
      while (!stopScrolling) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(500);
      }
    } finally {
      console.info('Scroll ended');
    }
  };
  

const uploadFile = async (page, filename) => {
  const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('//*[@id="__next"]/div/main/div/article/footer/div/div/div[3]/div/button[2]'),
  ]);

  await fileChooser.setFiles(path.resolve(filename));

  await page.click('//*[@id="__next"]/div/main/div/article/footer/div/div/div[4]/button');

  console.info('File uploaded');
  await page.waitForTimeout(3000);
};


module.exports = { accessChat, createChat, talkChat, addReactions, scrollDown, uploadFile };
