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
  speedOptions.forEach(speed => {
    const option = document.createElement('div');
    option.className = 'speed-option';
    option.textContent = `${speed}x`;
    option.onclick = () => setPlaybackSpeed(speed);
    menu.insertBefore(option, menu.firstChild);
    
  });
  return menu;
}

// 切换倍速选择菜单的显示
function toggleSpeedMenu() {
  const menu = document.querySelector('.speed-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// 设置播放速度
function setPlaybackSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
    document.querySelector('.speed-button').innerHTML = `${speed}x`;
  }
  toggleSpeedMenu();
}

// 主函数
function init() {
  const controls = document.querySelector('.ytp-right-controls');
  if (controls) {
    controls.style.display = 'flex';
    const speedButton = createSpeedButton();
    controls.insertBefore(speedButton, controls.children[2]);
    const speedMenu = createSpeedMenu();
    controls.appendChild(speedMenu);
  }
}

// 等待页面加载完成后执行初始化
window.addEventListener('load', init);
