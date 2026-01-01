// 元旦节倒计时功能
function countdown() {
    // 设置目标日期为2026年1月1日
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    // 每秒更新倒计时
    const timer = setInterval(() => {
        // 获取当前时间
        const now = new Date().getTime();
        
        // 计算时间差
        const difference = now - targetDate;
        
        // 计算天、时、分、秒
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // 更新页面显示
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
    }, 1000);
}

// 愿望提交功能
function initWishSubmission() {
    const wishInput = document.getElementById('wishInput');
    const submitBtn = document.getElementById('submitWish');
    const userWishes = document.getElementById('userWishes');
    
    submitBtn.addEventListener('click', (e) => {
        const wishText = wishInput.value.trim();
        
        // 添加点击涟漪效果
        const ripple = document.createElement('span');
        const rect = submitBtn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;
        
        submitBtn.appendChild(ripple);
        
        // 动画结束后移除涟漪元素
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        if (wishText) {
            // 创建愿望卡片
            const wishCard = document.createElement('div');
            wishCard.className = 'user-wish';
            wishCard.innerHTML = `
                <div class="wish-content">
                    <p>${wishText}</p>
                </div>
                <div class="wish-actions">
                    <button class="share-btn" aria-label="复制愿望到剪贴板" title="分享愿望">
                        <span class="share-icon">📋</span>
                    </button>
                </div>
            `;
            wishCard.tabIndex = 0; // 使其可以通过键盘聚焦
            wishCard.setAttribute('role', 'button');
            wishCard.setAttribute('aria-label', `点击或按Enter/空格删除愿望: ${wishText.substring(0, 20)}${wishText.length > 20 ? '...' : ''}`);
            
            // 添加入场动画
            wishCard.style.opacity = '0';
            wishCard.style.transform = 'translateY(20px) scale(0.95)';
            
            // 添加到页面
            userWishes.appendChild(wishCard);
            
            // 触发动画
            setTimeout(() => {
                wishCard.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                wishCard.style.opacity = '1';
                wishCard.style.transform = 'translateY(0) scale(1)';
            }, 10);
            
            // 添加点击删除效果（只在卡片内容区域点击时删除）
            const wishContent = wishCard.querySelector('.wish-content');
            wishContent.addEventListener('click', () => {
                deleteWishCard(wishCard);
            });
            
            // 添加键盘删除效果
            wishCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    deleteWishCard(wishCard);
                }
            });
            
            // 添加分享功能
            const shareBtn = wishCard.querySelector('.share-btn');
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止触发删除事件
                copyToClipboard(wishText);
            });
            
            // 清空输入框
            wishInput.value = '';
            
            // 保存到本地存储
            saveWishes();
            
            // 触发庆祝动画
            triggerCelebration();
        }
    });
    
    // 按回车键提交
    wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitBtn.click();
        }
    });
    
    // 加载保存的愿望
    loadWishes();
}

// 保存愿望到本地存储
function saveWishes() {
    const wishes = [];
    document.querySelectorAll('.user-wish p').forEach(wish => {
        wishes.push(wish.textContent);
    });
    localStorage.setItem('newYearWishes', JSON.stringify(wishes));
}

// 删除愿望卡片函数
function deleteWishCard(wishCard) {
    wishCard.style.transform = 'scale(0.8) rotateX(10deg)';
    wishCard.style.opacity = '0';
    wishCard.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
        wishCard.remove();
        saveWishes();
    }, 300);
}

// 从本地存储加载愿望
function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('newYearWishes')) || [];
    const userWishes = document.getElementById('userWishes');
    
    wishes.forEach(wishText => {
        const wishCard = document.createElement('div');
        wishCard.className = 'user-wish';
        wishCard.innerHTML = `
            <div class="wish-content">
                <p>${wishText}</p>
            </div>
            <div class="wish-actions">
                <button class="share-btn" aria-label="复制愿望到剪贴板" title="分享愿望">
                    <span class="share-icon">📋</span>
                </button>
            </div>
        `;
        wishCard.tabIndex = 0;
        wishCard.setAttribute('role', 'button');
        wishCard.setAttribute('aria-label', `点击或按Enter/空格删除愿望: ${wishText.substring(0, 20)}${wishText.length > 20 ? '...' : ''}`);
        
        // 添加点击删除效果（只在卡片内容区域点击时删除）
        const wishContent = wishCard.querySelector('.wish-content');
        wishContent.addEventListener('click', () => {
            deleteWishCard(wishCard);
        });
        
        // 添加键盘删除效果
        wishCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                deleteWishCard(wishCard);
            }
        });
        
        // 添加分享功能
        const shareBtn = wishCard.querySelector('.share-btn');
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止触发删除事件
            copyToClipboard(wishText);
        });
        
        userWishes.appendChild(wishCard);
    });
}

// 复制到剪贴板功能
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // 使用现代API
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('复制成功！');
        }).catch(err => {
            console.error('复制失败:', err);
            showCopyNotification('复制失败，请重试');
        });
    } else {
        // 回退到传统方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyNotification('复制成功！');
            } else {
                showCopyNotification('复制失败，请重试');
            }
        } catch (err) {
            console.error('复制失败:', err);
            showCopyNotification('复制失败，请重试');
        }
        
        document.body.removeChild(textArea);
    }
}

// 显示复制通知
function showCopyNotification(message) {
    // 检查是否已经存在通知元素
    let notification = document.querySelector('.copy-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        document.body.appendChild(notification);
    }
    
    // 设置通知内容
    notification.textContent = message;
    
    // 添加显示类
    notification.classList.add('show');
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.classList.remove('show');
        
        // 完全隐藏后移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 雪花动画效果
function createSnowflakes() {
    const snowContainer = document.getElementById('snowContainer');
    
    // 大幅减少雪花数量，提高性能
    let snowflakeCount = 50;
    if (window.innerWidth <= 480) {
        snowflakeCount = 10; // 小屏移动设备进一步减少雪花数量
    } else if (window.innerWidth <= 768) {
        snowflakeCount = 20; // 移动设备进一步减少雪花数量
    } else if (window.innerWidth <= 1024) {
        snowflakeCount = 30; // 平板设备进一步减少雪花数量
    }
    
    // 使用 requestAnimationFrame 分批创建雪花，减少主线程阻塞
    let created = 0;
    const batchSize = 10;
    
    function createBatch() {
        const end = Math.min(created + batchSize, snowflakeCount);
        const fragment = document.createDocumentFragment();
        for (let i = created; i < end; i++) {
            createSnowflake(fragment);
        }
        // 批量添加到DOM，减少重排重绘
        snowContainer.appendChild(fragment);
        created = end;
        
        if (created < snowflakeCount) {
            requestAnimationFrame(createBatch);
        }
    }
    
    // 延迟执行，优先加载核心内容
    setTimeout(() => {
        requestAnimationFrame(createBatch);
    }, 500);
}

function createSnowflake(container) {
    const snowflake = document.createElement('div');
    
    // 随机形状 (1-5种形状)
    const shape = Math.floor(Math.random() * 5) + 1;
    
    // 随机大小 (small, medium, large)
    const sizeOptions = ['small', 'medium', 'large'];
    const sizeClass = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
    
    // 设置类名
    snowflake.className = `snowflake shape${shape} ${sizeClass}`;
    
    // 根据大小设置尺寸
    let size;
    switch (sizeClass) {
        case 'small':
            size = Math.random() * 4 + 2; // 2-6px
            break;
        case 'medium':
            size = Math.random() * 4 + 6; // 6-10px
            break;
        case 'large':
            size = Math.random() * 6 + 10; // 10-16px
            break;
    }
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    
    // 随机位置
    const initialX = `${Math.random() * 100}%`;
    const initialY = `-20px`;
    const initialRotation = `${Math.random() * 360}deg`;
    
    snowflake.style.left = initialX;
    snowflake.style.top = initialY;
    snowflake.style.transform = `rotate(${initialRotation})`;
    
    // 存储初始位置和旋转角度用于视差效果
    snowflake.dataset.initialX = initialX;
    snowflake.dataset.initialY = initialY;
    snowflake.dataset.initialRotation = initialRotation;
    
    // 随机动画持续时间
    const duration = Math.random() * 15 + 10; // 增加持续时间范围
    snowflake.style.setProperty('--duration', `${duration}s`);
    snowflake.style.animationDuration = `${duration}s`;
    
    // 随机延迟
    const delay = Math.random() * 10;
    snowflake.style.animationDelay = `${delay}s`;
    
    // 随机不透明度 (根据大小调整透明度，大雪花更不透明)
    let opacity;
    switch (sizeClass) {
        case 'small':
            opacity = Math.random() * 0.4 + 0.4; // 0.4-0.8
            break;
        case 'medium':
            opacity = Math.random() * 0.3 + 0.5; // 0.5-0.8
            break;
        case 'large':
            opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9
            break;
    }
    snowflake.style.opacity = opacity;
    
    // 随机摇摆幅度 (根据大小调整摇摆幅度，大雪花摇摆更大)
    let sway;
    switch (sizeClass) {
        case 'small':
            sway = Math.random() * 50 + 30; // 30-80px
            break;
        case 'medium':
            sway = Math.random() * 60 + 50; // 50-110px
            break;
        case 'large':
            sway = Math.random() * 80 + 80; // 80-160px
            break;
    }
    snowflake.style.setProperty('--sway', `${sway}px`);
    
    container.appendChild(snowflake);
    
    // 动画结束后移除并创建新雪花
    snowflake.addEventListener('animationend', () => {
        snowflake.remove();
        setTimeout(() => {
            createSnowflake(container);
        }, Math.random() * 1000); // 随机延迟创建新雪花
    });
}

// 创建气球装饰
function createBalloons() {
    const container = document.getElementById('decorationsContainer');
    const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'cyan'];
    
    // 进一步减少气球数量，提高性能
    let balloonCount = 10;
    if (window.innerWidth <= 480) {
        balloonCount = 3; // 小屏移动设备进一步减少气球数量
    } else if (window.innerWidth <= 768) {
        balloonCount = 5; // 移动设备进一步减少气球数量
    } else if (window.innerWidth <= 1024) {
        balloonCount = 7; // 平板设备进一步减少气球数量
    }
    
    // 使用 requestAnimationFrame 分批创建气球，减少主线程阻塞
    let created = 0;
    const batchSize = 5;
    
    function createBatch() {
        const end = Math.min(created + batchSize, balloonCount);
        const fragment = document.createDocumentFragment();
        for (let i = created; i < end; i++) {
            createBalloon(fragment, colors);
        }
        // 批量添加到DOM，减少重排重绘
        container.appendChild(fragment);
        created = end;
        
        if (created < balloonCount) {
            requestAnimationFrame(createBatch);
        }
    }
    
    // 延迟执行，优先加载核心内容
    setTimeout(() => {
        requestAnimationFrame(createBatch);
    }, 1000);
}

function createBalloon(container, colors) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // 随机颜色
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.classList.add(color);
    
    // 随机大小
    const size = Math.random() * 50 + 30; // 30-80px，增加大小变化范围
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    
    // 随机位置
    const initialX = `${Math.random() * 100}%`;
    const initialY = `-120px`;
    const initialRotation = `${Math.random() * 360}deg`;
    
    balloon.style.left = initialX;
    balloon.style.bottom = initialY;
    balloon.style.transform = `rotate(${initialRotation}deg)`;
    
    // 存储初始位置和旋转角度用于视差效果
    balloon.dataset.initialX = initialX;
    balloon.dataset.initialY = initialY;
    balloon.dataset.initialRotation = initialRotation;
    
    // 随机动画持续时间
    const duration = Math.random() * 15 + 10; // 10-25s，增加变化范围
    balloon.style.animationDuration = `${duration}s`;
    
    // 随机动画延迟
    const delay = Math.random() * 8;
    balloon.style.animationDelay = `${delay}s`;
    
    // 随机摇摆幅度
    const sway = Math.random() * 30 + 10;
    balloon.style.setProperty('--sway', `${sway}px`);
    
    // 随机不透明度
    const opacity = Math.random() * 0.4 + 0.6;
    balloon.style.opacity = opacity;
    
    // 随机发光效果强度
    const glowIntensity = Math.random() * 20 + 10;
    balloon.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.8)`;
    
    container.appendChild(balloon);
    
    // 动画结束后移除并创建新气球
    balloon.addEventListener('animationend', () => {
        balloon.remove();
        setTimeout(() => {
            createBalloon(container, colors);
        }, Math.random() * 2000); // 随机延迟创建新气球
    });
    
    // 添加上升和浮动动画
    balloon.style.animation = `floatBalloon ${duration}s ease-in-out infinite, riseBalloon ${duration * 2}s linear forwards`;
}

// 创建彩带装饰
function createRibbons() {
    const container = document.getElementById('ribbonsContainer');
    const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'cyan', 'magenta'];
    
    // 进一步减少彩带数量，提高性能
    let ribbonCount = 20;
    if (window.innerWidth <= 480) {
        ribbonCount = 6; // 小屏移动设备进一步减少彩带数量
    } else if (window.innerWidth <= 768) {
        ribbonCount = 10; // 移动设备进一步减少彩带数量
    } else if (window.innerWidth <= 1024) {
        ribbonCount = 15; // 平板设备进一步减少彩带数量
    }
    
    // 使用 requestAnimationFrame 分批创建彩带，减少主线程阻塞
    let created = 0;
    const batchSize = 5;
    
    function createBatch() {
        const end = Math.min(created + batchSize, ribbonCount);
        const fragment = document.createDocumentFragment();
        for (let i = created; i < end; i++) {
            createRibbon(fragment, colors);
        }
        // 批量添加到DOM，减少重排重绘
        container.appendChild(fragment);
        created = end;
        
        if (created < ribbonCount) {
            requestAnimationFrame(createBatch);
        }
    }
    
    // 延迟执行，优先加载核心内容
    setTimeout(() => {
        requestAnimationFrame(createBatch);
    }, 1500);
}

function createRibbon(container, colors) {
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';
    
    // 随机颜色
    const color = colors[Math.floor(Math.random() * colors.length)];
    ribbon.classList.add(color);
    
    // 随机起始位置
    const initialX = `${Math.random() * 100}%`;
    const initialY = `${Math.random() * 30}%`; // 从更高的位置开始
    const initialRotation = `${Math.random() * 360}deg`;
    
    ribbon.style.left = initialX;
    ribbon.style.top = initialY;
    ribbon.style.transform = `rotate(${initialRotation}deg)`;
    
    // 存储初始位置和旋转角度用于视差效果
    ribbon.dataset.initialX = initialX;
    ribbon.dataset.initialY = initialY;
    ribbon.dataset.initialRotation = initialRotation;
    
    // 随机动画持续时间
    const duration = Math.random() * 20 + 10; // 10-30s，增加变化范围
    ribbon.style.animationDuration = `${duration}s`;
    
    // 随机大小
    const width = Math.random() * 150 + 100; // 100-250px
    const height = Math.random() * 10 + 5; // 5-15px
    ribbon.style.width = `${width}px`;
    ribbon.style.height = `${height}px`;
    
    // 随机不透明度
    const opacity = Math.random() * 0.6 + 0.4;
    ribbon.style.opacity = opacity;
    
    // 随机发光效果
    const glowIntensity = Math.random() * 15 + 5;
    ribbon.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.6)`;
    
    container.appendChild(ribbon);
    
    // 动画结束后移除并创建新彩带
    ribbon.addEventListener('animationend', () => {
        ribbon.remove();
        setTimeout(() => {
            createRibbon(container, colors);
        }, Math.random() * 1000); // 随机延迟创建新彩带
    });
}

// 加载动画功能
function initLoadingAnimation() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    const loadingDecoration = document.querySelector('.loading-decoration');
    
    // 生成加载时的装饰元素
    generateLoadingDecorations(loadingDecoration);
    
    // 模拟加载进度
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // 加载完成，隐藏加载屏幕
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // 初始化页面内容
                initPageContent();
            }, 500);
        }
        
        progressFill.style.width = `${progress}%`;
    }, 300);
}

// 生成加载时的装饰元素
function generateLoadingDecorations(container) {
    const decorations = ['🎈', '✨', '🎉', '🌟', '🎊', '🎁', '🎆', '🎇', '🎀', '🧧'];
    
    // 根据设备类型和性能调整装饰元素数量
    let decorationCount = 20;
    if (window.innerWidth <= 480) {
        decorationCount = 8; // 小屏移动设备
    } else if (window.innerWidth <= 768) {
        decorationCount = 12; // 中屏移动设备
    } else if (window.innerWidth <= 1024) {
        decorationCount = 16; // 平板设备
    } else if (window.innerWidth <= 1400) {
        decorationCount = 20; // 桌面设备
    }
    
    // 检查设备性能，进一步减少低端设备的装饰数量
    if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
        decorationCount = Math.max(5, Math.floor(decorationCount * 0.7));
    }
    
    // 限制每次生成的装饰数量，避免过度渲染
    const batchSize = Math.max(2, Math.min(5, Math.floor(decorationCount / 4)));
    
    for (let i = 0; i < batchSize; i++) {
        setTimeout(() => {
            // 只在容器元素数量不足时创建新装饰
            if (container.children.length >= decorationCount) return;
            
            const decoration = document.createElement('div');
            decoration.className = 'loading-decoration-item';
            decoration.textContent = decorations[Math.floor(Math.random() * decorations.length)];
            
            // 随机位置，避免过度集中
            const left = Math.random() * 90 + 5; // 5%-95%范围内
            const top = Math.random() * 90 + 5; // 5%-95%范围内
            decoration.style.left = `${left}%`;
            decoration.style.top = `${top}%`;
            
            // 随机大小，根据设备调整大小范围
            let sizeRange = [20, 50];
            if (window.innerWidth <= 480) {
                sizeRange = [12, 25]; // 小屏移动设备
            } else if (window.innerWidth <= 768) {
                sizeRange = [15, 35]; // 中屏移动设备
            } else if (window.innerWidth <= 1024) {
                sizeRange = [18, 40]; // 平板设备
            }
            const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
            decoration.style.fontSize = `${size}px`;
            
            // 随机动画持续时间和延迟
            const duration = Math.random() * 4 + 3; // 3-7秒
            const delay = Math.random() * 1.5;
            decoration.style.animationDuration = `${duration}s`;
            decoration.style.animationDelay = `${delay}s`;
            
            // 随机旋转角度
            decoration.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // 优化动画性能
            decoration.style.willChange = 'transform, opacity, scale';
            decoration.style.backfaceVisibility = 'hidden';
            decoration.style.perspective = '1000px';
            
            container.appendChild(decoration);
            
            // 动画结束后移除并创建新装饰
            decoration.addEventListener('animationend', () => {
                decoration.remove();
                setTimeout(() => {
                    // 限制同时存在的装饰元素数量，避免性能问题
                    if (container.children.length < decorationCount) {
                        generateLoadingDecorations(container);
                    }
                }, Math.random() * 1500);
            });
        }, i * 200); // 增加创建间隔，避免同时渲染压力
    }
}

// 音乐播放器功能
// 格式化时间函数 (秒数转分:秒)
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function initMusicPlayer() {
    const audio = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const progressBar = document.getElementById('musicProgressBar');
    const progressFill = document.getElementById('musicProgressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const statusIndicator = document.getElementById('musicStatusIndicator'); // 添加状态指示器
    
    // 播放/暂停功能
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(err => {
                console.error('播放失败:', err);
            });
            playPauseBtn.querySelector('.music-icon').textContent = '⏸️';
            statusIndicator.classList.add('playing'); // 激活状态指示器
        } else {
            audio.pause();
            playPauseBtn.querySelector('.music-icon').textContent = '▶️';
            statusIndicator.classList.remove('playing'); // 停用状态指示器
        }
    });
    
    // 静音/取消静音功能
    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.querySelector('.music-icon').textContent = audio.muted ? '🔇' : '🔊';
    });
    
    // 进度条和时间更新
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        
        // 更新当前播放时间
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    
    // 进度条点击定位
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = (clickX / rect.width) * 100;
        audio.currentTime = (progress / 100) * audio.duration;
        progressFill.style.width = `${progress}%`;
        
        // 更新当前播放时间
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    
    // 音频加载完成后显示总时长
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
        currentTimeEl.textContent = formatTime(0);
    });
    
    // 音频结束后重置
    audio.addEventListener('ended', () => {
        playPauseBtn.querySelector('.music-icon').textContent = '▶️';
        currentTimeEl.textContent = formatTime(audio.duration);
    });

    // 尝试多种自动播放策略
    function tryAutoPlay() {
        // 策略1: 直接尝试播放
        audio.play().catch(err => {
            console.log('自动播放策略1失败:', err.message);
            
            // 策略2: 设置为静音后尝试播放
            audio.muted = true;
            audio.play().catch(mutedErr => {
                console.log('自动播放策略2(静音)失败:', mutedErr.message);
                
                // 策略3: 监听页面点击事件，用户点击后播放
                document.addEventListener('click', () => {
                    audio.muted = false;
                    audio.play().catch(clickErr => {
                        console.log('点击后播放失败:', clickErr.message);
                    });
                }, { once: true });
                
                // 更新UI状态
                playPauseBtn.querySelector('.music-icon').textContent = '▶️';
                muteBtn.querySelector('.music-icon').textContent = '🔊';
                statusIndicator.classList.remove('playing');
            });
        });
    }
    
    // 延迟执行自动播放，提高成功率
    setTimeout(() => {
        tryAutoPlay();
    }, 1000);
    
    // 监听音频播放状态
    audio.addEventListener('play', () => {
        playPauseBtn.querySelector('.music-icon').textContent = '⏸️';
        statusIndicator.classList.add('playing');
    });
    
    audio.addEventListener('pause', () => {
        playPauseBtn.querySelector('.music-icon').textContent = '▶️';
        statusIndicator.classList.remove('playing');
    });
}

// 初始化页面内容
function initPageContent() {
    // 初始化倒计时
    countdown();
    
    // 初始化愿望提交
    initWishSubmission();
    
    // 初始化音乐播放器
    initMusicPlayer();
    
    // 创建雪花动画
    createSnowflakes();
    
    // 创建气球装饰
    createBalloons();
    
    // 创建彩带装饰
    createRibbons();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 标题动画效果
    const title = document.querySelector('.title');
    title.addEventListener('mouseover', () => {
        title.style.transform = 'scale(1.05)';
        title.style.transition = 'transform 0.3s ease';
    });
    
    title.addEventListener('mouseout', () => {
        title.style.transform = 'scale(1)';
    });
    
    // 为愿望卡片添加交错的入场动画
    setTimeout(() => {
        const wishCards = document.querySelectorAll('.wish-card');
        wishCards.forEach((card, index) => {
            // 设置不同的动画延迟
            const delay = index * 0.15;
            card.style.animationDelay = `${delay}s, ${delay + 1}s`;
        });
    }, 1000);
    
    // 为用户提交的愿望卡片添加点击删除效果
    setTimeout(() => {
        const userWishes = document.querySelectorAll('.user-wish');
        userWishes.forEach(wish => {
            wish.addEventListener('click', () => {
                wish.style.transform = 'scale(0.8) rotateX(10deg)';
                wish.style.opacity = '0';
                wish.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => {
                    wish.remove();
                    saveWishes();
                }, 300);
            });
        });
    }, 1500);
}

// 页面加载完成后初始化加载动画
document.addEventListener('DOMContentLoaded', () => {
    initLoadingAnimation();
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {}, false);
}

// 触发庆祝动画
function triggerCelebration() {
    // 创建庆祝容器
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'celebration-container';
    document.body.appendChild(celebrationContainer);
    
    // 颜色数组
    const confettiColors = ['#ff4757', '#ffa502', '#ffdd59', '#2ed573', '#1e90ff', '#a55eea', '#ff6b6b', '#48dbfb'];
    const fireworkColors = ['#ff4757', '#ffa502', '#ffdd59', '#2ed573', '#1e90ff', '#a55eea'];
    const starColor = '#ffd700';
    
    // 根据屏幕大小和设备性能调整元素数量
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 1024;
    const isLowMemory = 'deviceMemory' in navigator && navigator.deviceMemory < 4;
    
    // 计算优化后的元素数量
    const baseConfettiCount = isMobile ? 20 : (isTablet ? 40 : 80);
    const baseFireworkCount = isMobile ? 2 : (isTablet ? 3 : 6);
    const baseStarCount = isMobile ? 15 : (isTablet ? 30 : 50);
    
    // 低内存设备进一步减少元素数量
    const confettiCount = isLowMemory ? Math.floor(baseConfettiCount * 0.7) : baseConfettiCount;
    const fireworkCount = isLowMemory ? Math.floor(baseFireworkCount * 0.7) : baseFireworkCount;
    const starCount = isLowMemory ? Math.floor(baseStarCount * 0.7) : baseStarCount;
    const particleCount = isMobile ? 6 : 8;
    
    // 使用requestAnimationFrame创建元素的辅助函数
    function createElementWithRAF(createFunc, delay, total) {
        let created = 0;
        
        function createNext() {
            if (created < total) {
                requestAnimationFrame(() => {
                    createFunc(created);
                    created++;
                    setTimeout(createNext, delay);
                });
            }
        }
        
        createNext();
    }
    
    // 生成五彩纸屑
    createElementWithRAF((i) => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 50;
        confetti.style.left = `${x}%`;
        confetti.style.top = `${y}%`;
        
        // 随机颜色
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.backgroundColor = color;
        
        // 随机大小
        const size = Math.random() * 6 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // 随机旋转和缩放
        const rotation = Math.random() * 360;
        const scale = Math.random() * 0.5 + 0.5;
        confetti.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        // 随机动画延迟
        const delay = Math.random() * 2;
        confetti.style.animationDelay = `${delay}s`;
        
        // 随机动画持续时间
        const duration = Math.random() * 2 + 2;
        confetti.style.animationDuration = `${duration}s`;
        
        // 设置will-change属性优化性能
        confetti.style.willChange = 'transform';
        
        celebrationContainer.appendChild(confetti);
        
        // 动画结束后移除
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, (delay + duration) * 1000);
    }, 15, confettiCount);
    
    // 生成烟花
    createElementWithRAF((i) => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // 随机位置
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 40 + 20;
        firework.style.left = `${x}%`;
        firework.style.top = `${y}%`;
        
        // 随机颜色
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        firework.style.backgroundColor = color;
        
        // 随机动画延迟
        const delay = Math.random() * 2;
        firework.style.animationDelay = `${delay}s`;
        
        // 设置will-change属性优化性能
        firework.style.willChange = 'transform, opacity';
        
        celebrationContainer.appendChild(firework);
        
        // 动画结束后移除
        setTimeout(() => {
            if (firework.parentNode) {
                firework.remove();
            }
        }, (delay + 1.5) * 1000);
        
        // 生成烟花爆炸效果
        setTimeout(() => {
            for (let j = 0; j < particleCount; j++) {
                requestAnimationFrame(() => {
                    const particle = document.createElement('div');
                    particle.className = 'star';
                    
                    // 爆炸方向
                    const angle = (360 / particleCount) * j;
                    const distance = Math.random() * 50 + 30;
                    const particleX = x + Math.cos(angle * Math.PI / 180) * distance / 100;
                    const particleY = y + Math.sin(angle * Math.PI / 180) * distance / 100;
                    
                    particle.style.left = `${particleX}%`;
                    particle.style.top = `${particleY}%`;
                    particle.style.backgroundColor = color;
                    particle.style.animationDelay = `${Math.random() * 0.5}s`;
                    
                    // 设置will-change属性优化性能
                    particle.style.willChange = 'transform, opacity';
                    
                    celebrationContainer.appendChild(particle);
                    
                    // 动画结束后移除
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.remove();
                        }
                    }, 1000);
                });
            }
        }, (delay + 0.75) * 1000);
    }, 600, fireworkCount);
    
    // 生成星星
    createElementWithRAF((i) => {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // 随机大小
        const size = Math.random() * 2 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // 随机动画延迟和持续时间
        const delay = Math.random() * 3;
        const duration = Math.random() * 0.5 + 0.5;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        // 设置will-change属性优化性能
        star.style.willChange = 'opacity, transform';
        
        celebrationContainer.appendChild(star);
        
        // 动画结束后移除
        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
            }
        }, (delay + 1) * 1000);
    }, 30, starCount);
    
    // 3秒后移除庆祝容器
    setTimeout(() => {
        if (celebrationContainer.parentNode) {
            celebrationContainer.remove();
        }
    }, 3000);
}

// 节流函数，减少事件触发频率
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 添加滚动动画效果（使用节流优化）
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.header');
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
    
    // 为雪花添加视差效果
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach((flake, index) => {
        const flakeSpeed = 0.1 + (index % 5) * 0.05;
        const translateY = (flake.dataset.initialY ? parseInt(flake.dataset.initialY) : 0) + scrolled * flakeSpeed;
        const rotate = (flake.dataset.initialRotation ? parseInt(flake.dataset.initialRotation) : 0) + scrolled * 0.5;
        flake.style.transform = `translate(${flake.dataset.initialX || 0}px, ${translateY}px) rotate(${rotate}deg)`;
    });
    
    // 为气球添加视差效果
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
        const balloonSpeed = 0.05 + (index % 4) * 0.03;
        const translateY = (balloon.dataset.initialY ? parseInt(balloon.dataset.initialY) : 0) - scrolled * balloonSpeed;
        const translateX = (balloon.dataset.initialX ? parseInt(balloon.dataset.initialX) : 0) + scrolled * balloonSpeed * 0.5;
        const rotate = (balloon.dataset.initialRotation ? parseInt(balloon.dataset.initialRotation) : 0) - scrolled * 0.3;
        balloon.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`;
    });
    
    // 为彩带添加视差效果
    const ribbons = document.querySelectorAll('.ribbon');
    ribbons.forEach((ribbon, index) => {
        const ribbonSpeed = 0.15 + (index % 3) * 0.05;
        const translateY = (ribbon.dataset.initialY ? parseInt(ribbon.dataset.initialY) : 0) + scrolled * ribbonSpeed;
        const translateX = (ribbon.dataset.initialX ? parseInt(ribbon.dataset.initialX) : 0) + scrolled * ribbonSpeed * 0.3;
        const rotate = (ribbon.dataset.initialRotation ? parseInt(ribbon.dataset.initialRotation) : 0) + scrolled * 0.8;
        ribbon.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
    });
}, 16)); // 约60fps的触发频率