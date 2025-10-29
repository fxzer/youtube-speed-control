// 定义倍速选项
const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 6, 8, 10];

// 创建倍速选择按钮
function createSpeedButton() {
  const button = document.createElement('button');
  button.className = 'ytp-button speed-button';
  button.innerHTML = '1x';
  button.title = '播放速度';
  
  // 使用addEventListener而不是onclick，确保能阻止事件冒泡
  button.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    toggleSpeedMenu(event);
  });
  
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
    
    // 使用addEventListener确保阻止事件冒泡
    option.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setPlaybackSpeed(speed);
    });
    
    fragment.insertBefore(option, fragment.firstChild);
  });
  menu.appendChild(fragment);
  return menu;
}

// 销毁现有菜单
function destroySpeedMenu() {
  const menu = document.querySelector('.speed-menu');
  if (menu) {
    menu.remove();
  }
}

// 查找或创建菜单容器，插入到设置面板前面
function findOrCreateMenuContainer() {
  let container = document.querySelector('.speed-menu-container');
  if (!container) {
    const settingsMenu = document.querySelector('#container .html5-video-player .ytp-popup.ytp-settings-menu');
    const videoPlayer = document.querySelector('#container .html5-video-player');
    
    if (settingsMenu && videoPlayer) {
      container = document.createElement('div');
      container.className = 'speed-menu-container';
      // 插入到设置面板前面
      videoPlayer.insertBefore(container, settingsMenu);
    } else if (videoPlayer) {
      // 如果找不到设置面板，插入到播放器中
      container = document.createElement('div');
      container.className = 'speed-menu-container';
      videoPlayer.appendChild(container);
    }
  }
  return container;
}

// 修改切换倍速选择菜单的显示函数
function toggleSpeedMenu(event) {
  // 完全阻止事件传播和默认行为
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  let menu = document.querySelector('.speed-menu');
  const button = document.querySelector('.speed-button');
  const settingMenu = document.querySelector('.ytp-settings-menu');
  if (!button) return; // 如果按钮不存在，直接返回
  
  // 强制隐藏原生设置面板
  if (settingMenu) {
    settingMenu.style.display = 'none';
  }
  
  // 检查按钮是否可见
  function isButtonVisible() {
    const rect = button.getBoundingClientRect();
    const style = window.getComputedStyle(button);
    
    return (
      rect.width > 0 && 
      rect.height > 0 && 
      style.display !== 'none' && 
      style.visibility !== 'hidden' && 
      style.opacity !== '0'
    );
  }
  
  // 如果按钮不可见，销毁菜单并返回
  if (!isButtonVisible()) {
    destroySpeedMenu();
    return;
  }
  
  // 如果菜单存在且可见，隐藏菜单
  if (menu && window.getComputedStyle(menu).display !== 'none') {
    menu.style.display = 'none';
  } else {
    // 如果菜单不存在，重新创建菜单并插入到正确位置
    if (!menu) {
      const container = findOrCreateMenuContainer();
      if (container) {
        menu = createSpeedMenu();
        container.appendChild(menu);
      }
    }
    
    // 显示菜单前先重新定位
    if (menu) {
      positionMenu(menu, button);
      menu.style.display = 'block';
      if (settingMenu) {
        settingMenu.style.display = 'none';
      }
    }
  }
}

// 设置播放速度
function setPlaybackSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
    document.querySelector('.speed-button').innerHTML = `${speed}x`;
    // 存储当前速度
    localStorage.setItem('youtubePlaybackSpeed', speed);
  }
  
  // 隐藏倍速菜单
  const speedMenu = document.querySelector('.speed-menu');
  if (speedMenu) {
    speedMenu.style.display = 'none';
  }
  
  // 确保原生设置面板也被隐藏
  const settingMenu = document.querySelector('.ytp-settings-menu');
  if (settingMenu) {
    settingMenu.style.display = 'none';
  }
}

// 添加一个新函数来应用存储的播放速度
function applyStoredPlaybackSpeed() {
  const storedSpeed = localStorage.getItem('youtubePlaybackSpeed');
  if (storedSpeed) {
    setPlaybackSpeed(parseFloat(storedSpeed));
  }
}

// 修改定位菜单函数，借鉴YouTube设置面板的定位方式
function positionMenu(menu, button) {
  const buttonRect = button.getBoundingClientRect();
  const isFullscreen = document.fullscreenElement !== null;
  const videoPlayer = document.querySelector('#container .html5-video-player');
  
  if (!videoPlayer) return;
  
  // 获取播放器容器的位置信息
  const playerRect = videoPlayer.getBoundingClientRect();
  
  // 使用绝对定位相对于播放器容器，借鉴设置面板的定位方式
  menu.style.position = 'absolute';
  menu.style.zIndex = '99999';
  
  // 借鉴设置面板的定位：bottom: 61px, right: 12px
  // 计算相对于播放器容器的位置
  const menuWidth = 68; // 菜单固定宽度
  const menuLeft = buttonRect.left - playerRect.left + (buttonRect.width / 2) - (menuWidth / 2);
  
  // 使用与设置面板相同的bottom定位方式
  menu.style.left = `${menuLeft}px`;
  menu.style.bottom = '61px'; // 与设置面板相同的bottom值
  menu.style.top = 'auto';
  menu.style.right = 'auto';

  // 设置菜单选项的字体大小
  const options = menu.querySelectorAll('.speed-option');
  options.forEach(option => {
    option.style.fontSize = isFullscreen ? '16px' : '13px';
  });
}

// 修改主函数
function init() {
  // 尝试找到 .ytp-right-controls-left .ytp-settings-button
  const settingsButton = document.querySelector('.ytp-right-controls-left .ytp-settings-button');

  if (settingsButton) {
    // 在设置按钮后面插入速度按钮
    const speedButton = createSpeedButton();
    settingsButton.parentNode.insertBefore(speedButton, settingsButton.nextSibling);
  } else {
    // 如果找不到新的目标位置，回退到原来的方案
    const controls = document.querySelector('.ytp-right-controls');
    if (controls) {
      controls.style.display = 'flex';
      const speedButton = createSpeedButton();
      controls.insertBefore(speedButton, controls.children[2]);
    }
  }

  // 只有在成功创建按钮后才继续后续逻辑
  const speedButton = document.querySelector('.speed-button');
  if (!speedButton) return;

  // 检查按钮是否可见的函数
  function isButtonVisible() {
    const rect = speedButton.getBoundingClientRect();
    const style = window.getComputedStyle(speedButton);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  // 跟踪按钮的可见性状态
  let wasButtonVisible = isButtonVisible();

  // 监听按钮可见性变化
  const visibilityObserver = new MutationObserver(() => {
    const isCurrentlyVisible = isButtonVisible();

    // 如果按钮从可见变为不可见，销毁菜单
    if (wasButtonVisible && !isCurrentlyVisible) {
      destroySpeedMenu();
    }

    // 更新可见性状态
    wasButtonVisible = isCurrentlyVisible;
  });

  // 监听按钮及其父容器的变化
  visibilityObserver.observe(speedButton, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  visibilityObserver.observe(speedButton.parentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });

  // 简化的窗口变化监听（仅在必要时）
  window.addEventListener('resize', () => {
    const currentMenu = document.querySelector('.speed-menu');
    if (currentMenu && currentMenu.style.display === 'block') {
      if (isButtonVisible()) {
        positionMenu(currentMenu, speedButton);
      } else {
        destroySpeedMenu();
      }
    }
  });

  document.addEventListener('click', () => {
    const currentMenu = document.querySelector('.speed-menu');
    if (currentMenu) {
      currentMenu.style.display = 'none';
    }
  });

  // 监听视频元素的变化
  const videoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        applyStoredPlaybackSpeed();
      }
    });
  });

  const video = document.querySelector('video');
  if (video) {
    videoObserver.observe(video, { attributes: true });
    // 初始应用存储的播放速度
    applyStoredPlaybackSpeed();
  }
}

// 修改初始化方式
function waitForYouTubeControls(attempts = 0) {
  const maxAttempts = 50; // 最大尝试次数,大约25秒
  const controls = document.querySelector('.ytp-right-controls');
  if (controls) {
    init();
  } else if (attempts < maxAttempts) {
    requestAnimationFrame(() => waitForYouTubeControls(attempts + 1));
  } 
}

// 页面加载完成后开始等待YouTube控件
window.addEventListener('load', () => waitForYouTubeControls());

// 添加全屏事件监听
document.addEventListener('fullscreenchange', () => {
  const menu = document.querySelector('.speed-menu');
  const button = document.querySelector('.speed-button');
  if (menu && button) {
    positionMenu(menu, button);
  }
});
