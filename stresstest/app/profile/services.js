const { expect } = require('@playwright/test');
const path = require('path');

const addProfileImage = async (page, filename) => {
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/button').click();
  await page.locator('//*[@id="__next"]/div/nav/div/div/div[3]/div/div/button[1]').click();
  console.log(page.url());
  const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('//*[@id="radix-:rj:"]/div/div/div/div[2]/button'),
  ]);
  
  await fileChooser.setFiles(path.resolve(filename));
  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForTimeout(3000);
  
  // PersistentAvatar 컴포넌트 구조에 맞춘 검증
  const profileAvatar = page.locator('div.persistent-avatar');
  await expect(profileAvatar).toBeVisible();
  
  // Avatar.Image 컴포넌트 검증
  const avatarImage = profileAvatar.locator('img');
  await expect(avatarImage).toBeVisible();
  await expect(avatarImage).toHaveAttribute('loading', 'lazy');
  await expect(avatarImage).not.toHaveAttribute('src', /placeholder/);

  // 프로필 저장 성공 메시지 확인 (Toast 컴포넌트)
  const successToast = page.locator('div[role="alert"]');
  await expect(successToast).toBeVisible();
  await expect(successToast).toContainText('프로필');

  console.info('Profile image added and verified');
};

module.exports = { addProfileImage };
