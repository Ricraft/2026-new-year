import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// === 背景漂浮粒子组件 ===
const FloatingParticles = () => {
  // 生成 15 个随机位置的粒子
  const particles = Array.from({ length: 15 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", x: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ 
            y: "-20vh", 
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 10 + 15, // 15-25秒漂浮时间
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute w-2 h-2 rounded-full bg-yellow-500/30 blur-[1px]"
        />
      ))}
    </div>
  );
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  
  const bgMusicRef = useRef(null);
  const videoRef = useRef(null);

  // 视频池：在这里添加你的视频文件名
  const videoPool = [
    { src: '/blessing1.mp4', title: '大吉大利' },
    { src: '/blessing2.mp4', title: '财源广进' },
    { src: '/blessing3.mp4', title: '万事如意' },
    { src: '/blessing4.mp4', title: '心想事成' },
    { src: '/blessing5.mp4', title: '福星高照' },
  ];

  // 随机抽取视频
  const drawRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoPool.length);
    return videoPool[randomIndex];
  };

  // 播放背景音乐
  const playBackgroundMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.play().catch(err => {
        console.log('背景音乐播放失败:', err);
      });
      setIsMusicPlaying(true);
    }
  };

  // 停止背景音乐
  const stopBackgroundMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  };

  // 切换背景音乐播放/暂停
  const toggleBackgroundMusic = () => {
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        bgMusicRef.current.play().catch(err => {
          console.log('背景音乐播放失败:', err);
        });
        setIsMusicPlaying(true);
      }
    }
  };

  // 播放视频
  const handleVideoPlay = () => {
    if (videoRef.current && !isVideoPlaying) {
      stopBackgroundMusic();
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  // 视频播放结束后的处理
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  // 彩蛋点击处理
  const handleEasterEggClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5 && !showEasterEgg) {
      setShowEasterEgg(true);
      setShowAchievement(true);
      stopBackgroundMusic();
      
      // 3秒后隐藏成就提示
      setTimeout(() => {
        setShowAchievement(false);
      }, 3000);
    }
  };

  // 关闭彩蛋
  const closeEasterEgg = () => {
    setShowEasterEgg(false);
  };

  // 烟花特效逻辑（保持不变，增加一点金色比例）
  const triggerConfetti = () => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#DC143C'], // 金、橙、红
        disableForReducedMotion: true,
        zIndex: 100,
      });

      requestAnimationFrame(frame);
    }());
  };

  const handleOpen = () => {
    const video = drawRandomVideo();
    setSelectedVideo(video);
    setIsOpen(true);
    triggerConfetti();
    // 延迟播放背景音乐，确保用户交互后播放
    setTimeout(() => {
      playBackgroundMusic();
    }, 500);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#09090b] text-white overflow-hidden">
      {/* 背景音乐 */}
      <audio ref={bgMusicRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
        <source src="/background-music.ogg" type="audio/ogg" />
      </audio>

      {/* 1. 动态背景层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-[#2a0a0a] to-[#0f0f11]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <FloatingParticles />

      {/* 氛围光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full" />

      <AnimatePresence mode='wait'>
        {/* === 状态 A: 红包 (未打开) === */}
        {!isOpen && (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-20 cursor-pointer"
            onClick={handleOpen}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* 红包主体 */}
            <div className="relative w-[340px] h-[500px] rounded-3xl overflow-hidden glass-effect shadow-[0_20px_50px_-12px_rgba(220,38,38,0.5)] border border-red-400/30">
              {/* 顶部盖子纹理 */}
              <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-red-700/80 to-red-600/10 blur-xl" />
              
              {/* 装饰线条 */}
              <div className="absolute inset-0 border-[1px] border-white/10 rounded-3xl m-3" />
              
              {/* 这里的弧形是利用SVG画的，更平滑 */}
              <svg 
                className="absolute top-0 w-full h-[220px] drop-shadow-xl" 
                viewBox="0 0 100 60" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M0 0 L0 20 Q50 60 100 20 L100 0 Z" 
                  fill="#991B1B" 
                  className="opacity-90" 
                />
              </svg>

              {/* 中心的"開"按钮 */}
              <div className="absolute top-[140px] left-0 right-0 flex flex-col items-center z-30">
                <motion.div
                  animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                  className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#FCD34D] via-[#F59E0B] to-[#B45309] rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)] border-2 border-yellow-200"
                >
                  <motion.span 
                    animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                    className="text-4xl font-serif font-bold text-[#78350F]"
                  >
                    开
                  </motion.span>
                  
                  {/* 按钮微光动画 */}
                  <div 
                    className="absolute inset-0 rounded-full bg-white/20 animate-shine" 
                    style={{ 
                      background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)', 
                      backgroundSize: '200% 200%' 
                    }} 
                  />
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center mt-6 text-yellow-200/80 tracking-[0.3em] text-sm font-light"
                >
                  CLICK TO OPEN
                </motion.p>
              </div>

              {/* 底部纹理 */}
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* === 状态 B: 祝福卡片 (已打开) === */}
        {isOpen && (
          <motion.div
            key="card"
            initial={{ scale: 0.4, rotateX: -90, y: 300 }}
            animate={{ scale: 1, rotateX: 0, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 15,
              mass: 1.2,
              delay: 0.1 
            }}
            className="relative z-30 w-[360px] h-[580px] bg-[#fffcf5] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.3)]"
          >
            {/* 卡片金边 */}
            <div className="absolute inset-0 border-[6px] border-[#d4af37] rounded-2xl pointer-events-none z-50 opacity-80" />

            {/* 1. 视频区域 */}
            <div className="relative h-[60%] w-full bg-red-50 overflow-hidden group">
              {/* 视频播放器 */}
              {selectedVideo && (
                <video 
                  ref={videoRef}
                  key={selectedVideo.src}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  onEnded={handleVideoEnded}
                >
                  <source src={selectedVideo.src} type="video/mp4" />
                  您的浏览器不支持视频播放
                </video>
              )}

              {/* 播放按钮 */}
              {selectedVideo && !isVideoPlaying && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={handleVideoPlay}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors cursor-pointer"
                >
                  <svg 
                    className="w-10 h-10 text-red-600 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              )}

              {/* 视频加载失败时的占位图 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-900/20 bg-[url('/blessing.jpg')] bg-cover bg-center -z-10">
                <span className="text-4xl">🎬</span>
              </div>

              {/* 抽中的祝福标题 */}
              {selectedVideo && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 left-0 right-0 flex justify-center z-10"
                >
                  <div className="bg-red-600/80 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/50">
                    <span className="text-white text-sm font-bold tracking-wider">
                      🎊 {selectedVideo.title}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 视频上的光泽扫光效果 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shine pointer-events-none" />
            </div>

            {/* 2. 文字区域 */}
            <div className="relative h-[40%] flex flex-col items-center p-6 text-center">
              {/* 背景水印 */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="z-10"
              >
                <h2 className="text-3xl font-black text-[#8B0000] mb-2 tracking-widest font-serif">
                  二〇二六
                </h2>
                <div className="h-[2px] w-12 bg-[#B8860B] mx-auto mb-4" />
                
                <div className="space-y-3 text-[#5c3a3a]">
                  <p className="text-lg font-bold">马到功成 · 万马奔腾</p>
                  <p className="text-sm opacity-80 leading-relaxed font-serif">
                    愿你的身体如骏马般强健<br/>
                    愿你的生活如草原般辽阔<br/>
                    除夕快乐，岁岁平安！
                  </p>
                </div>
              </motion.div>

              {/* 底部署名 - 彩蛋触发器 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={handleEasterEggClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-4 text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer select-none hover:text-gray-600 transition-colors"
              >
                Generated by Deepseek & Liu
                {clickCount > 0 && clickCount < 5 && (
                  <span className="ml-2 text-red-400">({clickCount}/5)</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成就提示（右上角） */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-8 right-8 z-[100] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🏆
              </motion.div>
              <div>
                <div className="font-bold text-lg">成就解锁！</div>
                <div className="text-sm opacity-90">你发现了隐藏彩蛋，你是真的很闲￣へ￣</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 彩蛋视频弹窗 */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={closeEasterEgg}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90%] max-w-[600px] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400"
            >
              {/* 彩蛋视频 - B站嵌入 */}
              <iframe 
                src="//player.bilibili.com/player.html?isOutside=true&aid=116070232950325&bvid=BV1tTZEBCEBF&cid=36067806342&p=1&autoplay=1" 
                className="w-full h-full"
                scrolling="no" 
                border="0" 
                frameBorder="no" 
                framespacing="0" 
                allowFullScreen={true}
              />

              {/* 关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeEasterEgg}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* 彩蛋标题 */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                🎉 隐藏彩蛋
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 音乐控制按钮（右下角） */}
      {isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleBackgroundMusic}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-yellow-300/50"
        >
          {isMusicPlaying ? (
            // 播放中 - 音符图标
            <div className="relative">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              {/* 音波动画 */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-white"
              />
            </div>
          ) : (
            // 暂停 - 静音图标
            <svg className="w-7 h-7 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </motion.button>
      )}
    </div>
  );
}

export default App;
