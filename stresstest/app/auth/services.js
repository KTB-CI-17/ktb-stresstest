const addUser = async (page, id, passwd, email) => {
    await page.getByRole('navigation').getByRole('button', { name: '회원가입' }).click();
    await page.getByPlaceholder('이름을 입력하세요').click();
    await page.getByPlaceholder('이름을 입력하세요').fill(id);
    await page.getByPlaceholder('이름을 입력하세요').press('Tab');
    await page.getByPlaceholder('이메일을 입력하세요').fill(email);
    await page.getByPlaceholder('이메일을 입력하세요').press('Tab');
    await page.getByPlaceholder('비밀번호를 입력하세요').fill(passwd);
    await page.getByPlaceholder('비밀번호를 입력하세요').press('Tab');
    await page.getByPlaceholder('비밀번호를 다시 입력하세요').fill(passwd);
    await page.getByRole('article').getByRole('button', { name: '회원가입' }).click();
    await page.getByRole('button', { name: '채팅방 목록으로 이동' }).click();
  
    await expect(page).toHaveURL(/\/chat-rooms/);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('div.nav-user')).toBeVisible();
  
    console.info(email+ ' Registry Success and verified');
  };
  
  const login = async (page, email, passwd) => {
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('이메일을 입력하세요').click();
    await page.getByPlaceholder('이메일을 입력하세요').fill(email);
    await page.getByPlaceholder('이메일을 입력하세요').press('Tab');
    await page.getByPlaceholder('비밀번호를 입력하세요').fill(passwd);
    await page.getByRole('article').getByRole('button', { name: '로그인' }).click();
  
    await expect(page).toHaveURL(/\/chat-rooms/);
    await expect(page.locator('div.nav-user')).toBeVisible();
    await expect(page.locator('div.persistent-avatar')).toBeVisible();
  
    const userDropdown = page.locator('div.dropdown');
    await expect(userDropdown).toBeVisible();
  
    console.info(email+ ' Login Success and verified');
    await page.waitForTimeout(3000);
  };

  module.exports = { addUser, login };
  