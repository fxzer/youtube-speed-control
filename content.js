// 定义倍速选项
const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 6, 8, 10];

// 创建倍速选择按钮
function createSpeedButton() {
  const button = document.createElement('button');
  button.className = 'ytp-button speed-button';
  button.innerHTML = '1x';
  button.title = '播放速度';
  button.onclick = toggleSpeedMenu;
  return button;
}

// 创建倍速选择菜单
function createSpeedMenu() {
  const menu = document.createElement('div');
  menu.className = 'speed-menu';
  const fragment = document.createDocumentFragment();
  speedOptions.forEach(speed => {
    const option = document.createElement('div');
    option.className = 'speed-option';
    option.textContent = `${speed}x`;
    option.onclick = () => setPlaybackSpeed(speed);
    fragment.insertBefore(option, fragment.firstChild);
  });
  menu.appendChild(fragment);
  return menu;
}

// 修改切换倍速选择菜单的显示函数
function toggleSpeedMenu(event) {
  event.stopPropagation();
  const menu = document.querySelector('.speed-menu');
  const settingMenu = document.querySelector('.ytp-settings-menu');
  if (!menu) return; // 如果菜单不存在，直接返回
  const isMenuVisible = window.getComputedStyle(menu).display !== 'none';
  menu.style.display = isMenuVisible ? 'none' : 'block';
  if (settingMenu) {
    settingMenu.style.display = isMenuVisible ? 'block' : 'none';
  }
}

// 设置播放速度
function setPlaybackSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
    document.querySelector('.speed-button').innerHTML = `${speed}x`;
  }
  document.querySelector('.speed-menu').style.display = 'none';
}

// 修改定位菜单函数
function positionMenu(menu, button) {
  const rect = button.getBoundingClientRect();
  const isFullscreen = document.fullscreenElement !== null;
  
  menu.style.position = isFullscreen ? 'fixed' : 'absolute';
  menu.style.bottom = isFullscreen ? '68px' : '61px';
  menu.style.right = isFullscreen ? `${window.innerWidth - rect.right}px` : '240px';

  // 设置菜单选项的字体大小
  const options = menu.querySelectorAll('.speed-option');
  options.forEach(option => {
    option.style.fontSize = isFullscreen ? '18px' : '14px';
  });
}

// 修改主函数
function init() {
  const controls = document.querySelector('.ytp-right-controls');
  if (controls) {
    controls.style.display = 'flex';
    const speedButton = createSpeedButton();
    const speedMenu = createSpeedMenu();
    controls.insertBefore(speedButton, controls.children[2]);
    controls.appendChild(speedMenu);
    
    // 确保菜单初始状态为隐藏
    speedMenu.style.display = 'none';
    
    positionMenu(speedMenu, speedButton);

    const resizeObserver = new ResizeObserver(() => {
      if (speedMenu.style.display !== 'none') {
        positionMenu(speedMenu, speedButton);
      }
    });
    resizeObserver.observe(document.body);

    document.addEventListener('click', () => {
      speedMenu.style.display = 'none';
    });
  }
}

// 修改初始化方式
function waitForYouTubeControls() {
  const controls = document.querySelector('.ytp-right-controls');
  if (controls) {
    init();
  } else {
    setTimeout(waitForYouTubeControls, 500); // 每500毫秒检查一次
  }
}

// 页面加载完成后开始等待YouTube控件
window.addEventListener('load', waitForYouTubeControls);

// 添加全屏事件监听
document.addEventListener('fullscreenchange', () => {
  const menu = document.querySelector('.speed-menu');
  const button = document.querySelector('.speed-button');
  if (menu && button) {
    positionMenu(menu, button);
  }
});
