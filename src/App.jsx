import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Command, 
  LayoutDashboard, 
  Plus, 
  Send,
  Zap,
  MoreVertical,
  Trash2,
  CheckCircle,
  Timer,
  Search,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings,
  Maximize,
  Minimize,
  Pin,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { processMessage } from './utils/parser';

// --- Premium Logos ---
const TSLogo = ({ size = 44, showBackground = true }) => (
  <motion.div 
    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
    style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      background: showBackground ? '#000' : 'transparent', 
      borderRadius: showBackground ? '14px' : '0',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      border: showBackground ? '1px solid rgba(212, 175, 55, 0.3)' : 'none',
      boxShadow: showBackground ? '0 8px 30px rgba(0,0,0,0.4)' : 'none',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFFACD" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Stylized T */}
      <path d="M20 30H80V42H56V80H44V42H20V30Z" fill="url(#logo-gold)" filter="url(#gold-glow)" />
      {/* Stylized S - Intertwined */}
      <path d="M35 55C35 55 25 55 25 65C25 75 45 75 50 75C55 75 75 75 75 65C75 55 65 55 65 55" stroke="url(#logo-gold)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
    </svg>
    {/* Shine effect */}
    <motion.div 
      animate={{ left: ['-100%', '200%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      style={{
        position: 'absolute', top: 0, width: '40%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transform: 'skewX(-25deg)',
        pointerEvents: 'none'
      }}
    />
  </motion.div>
);

const ShieldLogo = ({ size = 44 }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    style={{ width: `${size}px`, height: `${size}px`, position: 'relative' }}
  >
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shield-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path d="M50 5L10 20V50C10 75 50 95 50 95C50 95 90 75 90 50V20L50 5Z" fill="#1E3A8A" stroke="url(#shield-gold)" strokeWidth="4" />
      <path d="M30 35H70V42H56V70H44V42H30V35Z" fill="url(#shield-gold)" />
    </svg>
  </motion.div>
);

// --- Mission Selection Modal ---
const STAGES = [
  { id: 'orbital', label: 'Orbital', threshold: 25, color: 'var(--stage-orbital)', icon: <RotateCcw size={14} /> },
  { id: 'ignition', label: 'Ignition', threshold: 50, color: 'var(--stage-ignition)', icon: <Zap size={14} /> },
  { id: 'thermal', label: 'Thermal', threshold: 75, color: 'var(--stage-thermal)', icon: <Sparkles size={14} /> },
  { id: 'touchdown', label: 'Touchdown', threshold: 100, color: 'var(--stage-touchdown)', icon: <CheckCircle size={14} /> }
];

const MissionSelectionModal = ({ task, onConfirm, onCancel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="mission-modal-overlay"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30, filter: 'blur(10px)' }}
        animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ scale: 0.9, y: 30, filter: 'blur(10px)' }}
        className="mission-modal"
        style={{ position: 'relative', overflow: 'hidden' }}
      >

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <div className="grindset-text" style={{ marginBottom: '0.5rem', letterSpacing: '0.3em' }}>MISSION PROTOCOL REQUIRED</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Select Engagement Mode</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>
            Detecting target: <span style={{ color: 'var(--accent-primary)' }}>"{task?.title}"</span>
          </p>
        </div>

        <div className="mission-grid" style={{ position: 'relative', zIndex: 5 }}>
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm('quick')}
            className="mission-option quick"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div className="mission-icon"><Send size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Quick Strike</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 600 }}>Standard deployment. Direct completion. Best for simple objectives.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm('campaign')}
            className="mission-option campaign"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div className="mission-icon"><Target size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campaign Protocol</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 600 }}>Long-haul tracking. Multi-stage atmospheric re-entry. Best for heavy lifting.</p>
            </div>
          </motion.div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <button 
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Abort Protocol
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
// --- Splash Screen ---
const SplashScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <TSLogo size={80} />
      <h1 style={{ color: 'white', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.06em' }}>Workflow</h1>
      <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.2)', marginTop: '1rem', borderRadius: '1px' }}>
        <motion.div 
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ height: '100%', background: 'var(--accent-orange)' }}
        />
      </div>
    </motion.div>
  </motion.div>
);
// --- Clean Professional Indicators ---
const AuraIndicator = ({ color }) => {
  return (
    <div style={{ position: 'relative', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        animate={{ scale: [1, 2.2, 1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(4px)' }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, zIndex: 1, boxShadow: `0 0 8px ${color}` }} 
      />
    </div>
  );
};

const LuminousWave = ({ color }) => {
  return (
    <motion.div
      initial={{ x: '-150%', skewX: -25 }}
      animate={{ x: '250%' }}
      transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], repeatDelay: 6 }}
      style={{
        position: 'absolute',
        top: -50,
        bottom: -50,
        width: '30%',
        background: `linear-gradient(90deg, transparent, ${color}05, ${color}15, ${color}05, transparent)`,
        pointerEvents: 'none',
        zIndex: 1,
        filter: 'blur(20px)'
      }}
    />
  );
};

// --- YC Style Reveal ---
const YCReveal = ({ text }) => {
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em' }}>
      {words.map((word, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <motion.span
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1, 
              ease: [0.215, 0.61, 0.355, 1] 
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
};


// --- Theme Toggle ---
const ThemeToggle = ({ theme, toggleTheme }) => (
  <div 
    onClick={toggleTheme}
    style={{
      width: '64px', height: '32px', background: 'var(--border-color)',
      borderRadius: '20px', cursor: 'pointer', position: 'relative',
      padding: '4px', display: 'flex', alignItems: 'center',
      border: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}
  >
    <motion.div
      animate={{ x: theme === 'dark' ? 32 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: '24px', height: '24px', background: 'var(--accent-orange)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)'
      }}
    >
      {theme === 'dark' ? <Zap size={14} color="white" fill="white" /> : <Sparkles size={14} color="white" />}
    </motion.div>
    <span style={{ 
      position: 'absolute', right: theme === 'dark' ? 'auto' : '8px', 
      left: theme === 'dark' ? '8px' : 'auto',
      fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)',
      textTransform: 'uppercase', pointerEvents: 'none'
    }}>
      {theme === 'dark' ? 'Dark' : 'Light'}
    </span>
  </div>
);

// --- Motivational Ticker ---
const SLANGS = [
  { text: "LOCKED IN.", type: "pop" },
  { text: "MAIN CHARACTER ENERGY.", type: "slide" },
  { text: "GRINDSET MODE.", type: "flip" },
  { text: "AURA +1000", type: "blur" },
  { text: "WE COOKIN'.", type: "pop" },
  { text: "ZERO DISTRACTION.", type: "slide" },
  { text: "STAY CRITICAL.", type: "flip" }
];

const MotivationalTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLANGS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = SLANGS[index];

  const variants = {
    pop: {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.5, opacity: 0 }
    },
    slide: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 }
    },
    flip: {
      initial: { rotateX: 90, opacity: 0 },
      animate: { rotateX: 0, opacity: 1 },
      exit: { rotateX: -90, opacity: 0 }
    },
    blur: {
      initial: { filter: "blur(10px)", opacity: 0 },
      animate: { filter: "blur(0px)", opacity: 1 },
      exit: { filter: "blur(10px)", opacity: 0 }
    }
  };

  const getClassName = (text) => {
    if (text.includes("ENERGY")) return "shimmer-text grindset-text";
    if (text.includes("AURA")) return "outline-text grindset-text blur-in";
    return "grindset-text";
  };

  return (
    <div style={{ height: '24px', overflow: 'hidden', marginTop: '0.5rem' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants[current.type]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "anticipate" }}
          className={getClassName(current.text)}
        >
          {current.text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


// --- Floating Slang Feedback ---
const COMPLETION_SLANGS = ["GOAT MODE.", "AURA UP.", "LOCKED IN.", "W.", "COOKED.", "GRINDSET."];

const FloatingSlang = ({ text, onComplete }) => (
  <motion.div
    initial={{ scale: 0.5, y: 20, opacity: 0 }}
    animate={{ scale: [0.5, 1.2, 1], y: -100, opacity: [0, 1, 0] }}
    transition={{ duration: 1, ease: "easeOut" }}
    onAnimationComplete={onComplete}
    style={{
      position: 'fixed', left: '50%', top: '60%', transform: 'translateX(-50%)',
      zIndex: 10000, color: 'var(--accent-orange)', fontWeight: 900, fontSize: '4rem',
      letterSpacing: '-0.05em', pointerEvents: 'none', textShadow: '0 10px 30px rgba(249, 115, 22, 0.4)'
    }}
  >
    {text}
  </motion.div>
);

// --- Background Visuals ---

const BackgroundArt = () => {
  return (
    <div className="bg-visuals">
      <motion.div 
        animate={{ 
          x: [0, 80, 0], 
          y: [0, 100, 0],
          rotate: [0, 90, 0] 
        }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="floating-shape" 
        style={{ width: '800px', height: '800px', top: '-20%', right: '-15%', background: 'rgba(30, 58, 138, 0.04)' }} 
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, 80, 0],
          rotate: [0, -45, 0] 
        }} 
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="floating-shape" 
        style={{ width: '600px', height: '600px', bottom: '-15%', left: '-10%', background: 'rgba(249, 115, 22, 0.03)' }} 
      />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.04, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
};

// --- Goofy Lightning Bolt (Original Design) ---

const LightningCompletion = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.1, times: [0, 0.5, 1], repeat: 2 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'white', zIndex: 999 }}
          />
          <motion.div 
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1.2], 
              rotate: [-45, 10, -5],
              opacity: [0, 1, 1],
              x: [0, -10, 10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ 
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 1000, pointerEvents: 'none'
            }}
          >
            <Zap size={240} color="#FACC15" fill="#FACC15" style={{ filter: 'drop-shadow(0 0 30px rgba(250, 204, 21, 0.6))' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Background Options ---
const BACKGROUND_OPTIONS = [
  { id: 'cosmic', label: 'Galaxy Loop', type: 'image', src: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=2069&auto=format&fit=crop', thumbnail: '✨' },
  { id: 'luxurious_video1', label: 'Luxury Flow 1', type: 'video', src: '/video1.mp4', thumbnail: '💎' },
  { id: 'luxurious_video4', label: 'Luxury Flow 4', type: 'video', src: '/video4.mp4', thumbnail: '🔥' },
  { id: 'luxurious_video5', label: 'Circle of Life', type: 'video', src: '/video5.mp4', thumbnail: '🦁' }
];

// --- Customizable Pro Timer ---

// Version 1.3.1 - Independent Timer/Stopwatch
const CustomizableTimer = () => {
  const [totalMinutes, setTotalMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isStopwatchActive, setIsStopwatchActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log("Workflow Handle Timer v1.3.1 - Mode decoupling active.");
  }, []);
  
  // Persistence for Background
  const [activeBgId, setActiveBgId] = useState(() => localStorage.getItem('taskflow_pinned_bg') || 'cosmic');
  const [pinnedBgId, setPinnedBgId] = useState(() => localStorage.getItem('taskflow_pinned_bg') || 'cosmic');

  const activeBg = BACKGROUND_OPTIONS.find(bg => bg.id === activeBgId) || BACKGROUND_OPTIONS[0];

  const handlePin = (id) => {
    setPinnedBgId(id);
    localStorage.setItem('taskflow_pinned_bg', id);
  };

  useEffect(() => {
    if (!isFullscreen) return;
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30, 
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFullscreen]);

  
  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      if (timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        setIsTimerActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Stopwatch Logic
  useEffect(() => {
    let interval = null;
    if (isStopwatchActive) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchActive]);

  useEffect(() => {
    setTimeLeft(totalMinutes * 60);
  }, [totalMinutes]);

  const toggleTimer = () => {
    if (mode === 'timer') {
      setIsTimerActive(!isTimerActive);
    } else {
      setIsStopwatchActive(!isStopwatchActive);
    }
  };
  const resetTimer = () => { 
    if (mode === 'timer') {
      setTimeLeft(totalMinutes * 60); 
      setIsTimerActive(false);
    } else {
      setStopwatchTime(0);
      setIsStopwatchActive(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate offset based on mode
  const offset = mode === 'timer' 
    ? circumference - (timeLeft / (totalMinutes * 60)) * circumference
    : circumference - ((stopwatchTime % 60) / 60) * circumference;

  const timerContent = (
    <>
      {isFullscreen && (
        <>
          {activeBg.type === 'video' ? (
            <motion.video 
              key={activeBg.id}
              autoPlay muted loop playsInline
              animate={{ 
                x: ['-2%', '2%', '-2%'],
                y: ['-2%', '2%', '-2%'],
                scale: [1.1, 1.15, 1.1] 
              }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="fullscreen-video-bg"
            >
              <source src={activeBg.src} type="video/mp4" />
            </motion.video>
          ) : (
            <motion.div
              key={activeBg.id}
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                scale: [1.1, 1.2, 1.1]
              }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="fullscreen-image-bg"
              style={{ 
                backgroundImage: activeBg.type === 'image' ? `url(${activeBg.src})` : 'none',
                backgroundColor: activeBg.type === 'color' ? activeBg.color : 'transparent',
                backgroundSize: '150% 150%'
              }}
            />
          )}
          <div className="video-overlay-vignette"></div>
          
          {/* Vibe Selector Bar */}
          <AnimatePresence>
            {!(mode === 'timer' ? isTimerActive : isStopwatchActive) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="vibe-selector-dock"
              >
                {BACKGROUND_OPTIONS.map((bg) => (
                  <motion.div
                    key={bg.id}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`vibe-option ${activeBgId === bg.id ? 'active' : ''}`}
                    onClick={() => setActiveBgId(bg.id)}
                    style={{ overflow: 'hidden', backgroundColor: bg.type === 'color' ? bg.color : 'rgba(255, 255, 255, 0.05)' }}
                  >
                    {bg.type === 'video' && (
                      <video src={bg.src} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, zIndex: 0 }} />
                    )}
                    {bg.type === 'image' && (
                      <img src={bg.src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, zIndex: 0 }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)', zIndex: 1 }} />
                    <span style={{ fontSize: '1.2rem', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{bg.thumbnail}</span>
                    <span className="vibe-label" style={{ position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{bg.label}</span>
                    <button 
                      className={`pin-button ${pinnedBgId === bg.id ? 'pinned' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handlePin(bg.id); }}
                      style={{ zIndex: 3 }}
                      title="Pin this background"
                    >
                      <Pin size={10} fill={pinnedBgId === bg.id ? "white" : "none"} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Mode Switcher */}
      <motion.div 
        layout
        className="mode-switch"
        style={{ transform: isFullscreen ? 'scale(1.5)' : 'none', marginBottom: isFullscreen ? '4rem' : '2rem' }}
      >
        <button 
          className={`mode-btn ${mode === 'timer' ? 'active' : ''}`}
          onClick={() => setMode('timer')}
        >
          <Timer size={14} /> Timer
        </button>
        <button 
          className={`mode-btn ${mode === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setMode('stopwatch')}
        >
          <Clock size={14} /> Stopwatch
        </button>
      </motion.div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isFullscreen ? '6rem' : '1rem', width: '100%', maxWidth: isFullscreen ? '400px' : 'auto', zIndex: 60, pointerEvents: 'auto' }}>
        <div className="section-title" style={{ margin: 0, display: 'flex', gap: '0.4rem', color: isFullscreen ? 'rgba(255,255,255,0.9)' : 'var(--accent-primary)' }}>
          {mode === 'timer' ? <Timer size={14} /> : <Clock size={14} />} {mode === 'timer' ? 'Focus' : 'Stopwatch'}
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {mode === 'timer' && (
            <Settings 
              size={14} 
              style={{ cursor: 'pointer', color: isEditing ? 'var(--accent-orange)' : (isFullscreen ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)') }} 
              onClick={() => setIsEditing(!isEditing)}
            />
          )}
          <button onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: 'none', border: 'none', color: isFullscreen ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </div>
      
      <div className="timer-container" style={{ position: 'relative', margin: '0.5rem auto', zIndex: 50, pointerEvents: 'auto', transform: isFullscreen ? 'scale(2.5)' : 'none', transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <svg className="timer-svg" width="160" height="160">
          <circle className="timer-bg" cx="80" cy="80" r={radius} style={{ stroke: isFullscreen ? 'rgba(255,255,255,0.1)' : 'var(--border-color)' }} />
          <motion.circle 
            className="timer-progress" 
            cx="80" cy="80" r={radius} 
            strokeDasharray={circumference}
            animate={{ 
              strokeDashoffset: offset,
              stroke: mode === 'timer' ? 'var(--accent-primary)' : 'var(--accent-success)',
              filter: `drop-shadow(0 0 12px ${mode === 'timer' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)'})`,
              opacity: (mode === 'timer' ? isTimerActive : isStopwatchActive) ? 1 : (isFullscreen ? 0.6 : 0.8)
            }}
            style={{ 
              fill: 'none', 
              strokeWidth: 8,
              strokeLinecap: 'round'
            }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </svg>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {isEditing && mode === 'timer' ? (
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <input 
                type="number" 
                className="timer-input"
                value={totalMinutes}
                onChange={(e) => setTotalMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                autoFocus
                style={{ color: isFullscreen ? 'white' : 'var(--text-primary)', borderColor: isFullscreen ? 'rgba(255,255,255,0.3)' : 'var(--border-color)' }}
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, marginLeft: '2px', color: isFullscreen ? 'white' : 'var(--text-primary)' }}>MIN</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: '2.25rem', fontWeight: 900, color: isFullscreen ? 'white' : 'var(--text-primary)', letterSpacing: '-0.05em', textShadow: isFullscreen ? '0 4px 20px rgba(0,0,0,0.5)' : 'none' }}
              >
                {formatTime(mode === 'timer' ? timeLeft : stopwatchTime)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', pointerEvents: 'auto', display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: isFullscreen ? '6rem' : '1rem', zIndex: 110 }}>
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={toggleTimer} 
          style={{ 
            background: (mode === 'timer' ? isTimerActive : isStopwatchActive) ? (isFullscreen ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)') : (mode === 'timer' ? 'var(--accent-primary)' : 'var(--accent-success)'), 
            color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '50%', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            backdropFilter: isFullscreen ? 'blur(10px)' : 'none'
          }}
        >
          {(mode === 'timer' ? isTimerActive : isStopwatchActive) ? <Pause size={18} /> : <Play size={18} />}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={resetTimer} 
          style={{ 
            background: isFullscreen ? 'rgba(255,255,255,0.1)' : 'white', 
            color: isFullscreen ? 'white' : 'var(--text-secondary)', 
            border: `1px solid ${isFullscreen ? 'rgba(255,255,255,0.2)' : 'var(--border-color)'}`, 
            width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: isFullscreen ? 'blur(10px)' : 'none',
            boxShadow: isFullscreen ? '0 8px 16px rgba(0, 0, 0, 0.3)' : 'none'
          }}
        >
          <RotateCcw size={18} />
        </motion.button>
      </div>
    </>
  );

  if (isFullscreen) {
    return ReactDOM.createPortal(
      <div className="timer-fullscreen-overlay">
        {timerContent}
      </div>,
      document.body
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', textAlign: 'center', position: 'relative' }}>
      {timerContent}
    </div>
  );
};

// --- Overview Hub ---
const OverviewHub = ({ pendingTasks, isMobile }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      style={{ 
        background: 'var(--card-bg)', 
        padding: isMobile ? '1.5rem' : '2.5rem', 
        borderRadius: '32px',
        marginBottom: '3rem',
        border: '1px solid var(--border-color)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>Mission Overview</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
            <span className="grindset-text" style={{ fontSize: '0.6rem' }}>Syncing workspace...</span>
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)' }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>{pendingTasks.length}</div>
          <div className="grindset-text" style={{ fontSize: '0.6rem' }}>Targets</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
        {pendingTasks.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontWeight: 600, padding: '1rem' }}>No targets in range. All systems clear.</div>
        ) : (
          pendingTasks.slice(0, 5).map((task, idx) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -8, backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--accent-primary)' }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
              style={{ 
                minWidth: isMobile ? '240px' : '280px', 
                padding: '2rem', 
                background: 'var(--bg-color)', 
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ color: 'var(--accent-orange)', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{task.deadline}</div>
                <Zap size={14} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em', lineHeight: 1.2, color: 'var(--text-primary)' }}>{task.title}</div>
              <div style={{ marginTop: '1.5rem', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                  style={{ height: '100%', background: 'var(--accent-primary)' }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

// --- History Drawer ---
const HistoryDrawer = ({ tasks, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1000 }}
          />
          <motion.div 
            initial={{ x: '100%', filter: 'blur(20px)' }}
            animate={{ x: 0, filter: 'blur(0px)' }}
            exit={{ x: '100%', filter: 'blur(20px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px, 90vw)', 
              background: 'var(--card-bg)', zIndex: 1001, padding: '3rem 2rem',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.2)', borderLeft: '1px solid var(--border-color)',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.05em' }}>History</h2>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <RotateCcw size={24} />
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>No completed history.</div>
              ) : (
                tasks.map((task, idx) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ 
                      padding: '1.5rem', background: 'var(--sidebar-bg)', borderRadius: '20px',
                      borderLeft: '4px solid var(--accent-success)', position: 'relative',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 900, marginBottom: '0.4rem' }}>COMPLETED</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{task.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{task.deadline}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, color: '#F43F5E' }} 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(task.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem' }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- App Component ---

function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('taskflow_username') || '');
  const [isNameModalOpen, setIsNameModalOpen] = useState(!localStorage.getItem('taskflow_username'));
  const [tempName, setTempName] = useState('');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLightning, setShowLightning] = useState(false);
  const [completionSlang, setCompletionSlang] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('taskflow_theme') || 'dark');

  const [pendingTask, setPendingTask] = useState(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = setTimeout(() => setLoading(false), 2500);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };



  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newTask = processMessage(inputText);
    setPendingTask(newTask);
    setIsMissionModalOpen(true);
    setInputText('');
  };

  const handleConfirmMission = (mode) => {
    if (!pendingTask) return;
    const finalTask = {
      ...pendingTask,
      mode,
      hasProgress: mode === 'campaign',
      progress: 0,
      stage: 'orbital'
    };
    setTasks([finalTask, ...tasks]);
    setPendingTask(null);
    setIsMissionModalOpen(false);
  };

  const updateTaskProgress = (id, newProgress) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const stage = STAGES.find(s => newProgress <= s.threshold) || STAGES[STAGES.length - 1];
        return { ...t, progress: newProgress, stage: stage.id };
      }
      return t;
    }));
  };

  const toggleTaskStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.status === 'pending') {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.7 },
        colors: ['#F97316', '#FACC15', '#1E3A8A']
      });
      setCompletionSlang(COMPLETION_SLANGS[Math.floor(Math.random() * COMPLETION_SLANGS.length)]);
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 800);
    }

    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'done');

  return (
    <div className="app-container">
      <div className="aura-blob aura-1"></div>
      <div className="aura-blob aura-2"></div>
      
      <AnimatePresence>
        {isMissionModalOpen && pendingTask && (
          <MissionSelectionModal 
            task={pendingTask} 
            onConfirm={handleConfirmMission} 
            onCancel={() => { setIsMissionModalOpen(false); setPendingTask(null); }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <AnimatePresence>
        {isNameModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-panel" style={{ padding: '3rem', width: '90%', maxWidth: '400px', textAlign: 'center', borderRadius: '32px' }}
            >
              <h2 className="vibrant-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Who's driving?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 600 }}>Enter your alias to initialize the workspace.</p>
              <input 
                type="text" 
                autoFocus
                placeholder="Your Name..." 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tempName.trim()) {
                    setUserName(tempName.trim());
                    localStorage.setItem('taskflow_username', tempName.trim());
                    setIsNameModalOpen(false);
                  }
                }}
                style={{ 
                  width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid var(--border-color)', 
                  background: 'var(--sidebar-bg)', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem'
                }}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (tempName.trim()) {
                    setUserName(tempName.trim());
                    localStorage.setItem('taskflow_username', tempName.trim());
                    setIsNameModalOpen(false);
                  }
                }}
                style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'var(--accent-primary)', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                Initialize Protocol
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {completionSlang && <FloatingSlang text={completionSlang} onComplete={() => setCompletionSlang(null)} />}

      <HistoryDrawer tasks={completedTasks} isOpen={showHistory} onClose={() => setShowHistory(false)} onDelete={deleteTask} />

      <BackgroundArt />


      <LightningCompletion show={showLightning} />
      
      {!isMobile && (
        <aside className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
            <TSLogo />
            <span className="vibrant-text" style={{ fontSize: '1.8rem', letterSpacing: '-0.04em' }}>Workflow</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>


          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Workspace" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={<Calendar size={20} />} label="Timeline" active={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} />
            <SidebarItem icon={<CheckCircle2 size={20} />} label="Archive" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
          </nav>

          <CustomizableTimer />

          <div style={{ marginTop: 'auto', padding: '1.5rem 0.5rem' }}>
            <div className="section-title">Overview</div>
            <StatRow label="In Queue" value={pendingTasks.length} color="var(--accent-primary)" />
            <StatRow label="Completed" value={completedTasks.length} color="var(--accent-success)" />
          </div>

          {deferredPrompt && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              style={{
                marginTop: '1rem', width: '100%', padding: '1rem',
                background: 'var(--accent-primary)', color: 'white',
                border: 'none', borderRadius: '14px', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <Plus size={18} /> Install App
            </motion.button>
          )}
        </aside>

      )}

      <main className="main-content" style={{ padding: isMobile ? '1.5rem' : '3rem 4rem', paddingBottom: isMobile ? '7rem' : '3rem' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'flex-end', 
          marginBottom: '1.5rem',
          gap: isMobile ? '1.5rem' : '0'
        }}>
          <div style={{ width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <motion.div 
                onClick={() => { setTempName(userName); setIsNameModalOpen(true); }}
                className="vibrant-text" 
                style={{ fontSize: isMobile ? '3rem' : '4.5rem', marginBottom: '-0.5rem', cursor: 'pointer' }}
                title="Click to change name"
              >
                <YCReveal text={userName ? `${userName}.` : 'Focus.'} />
              </motion.div>

              <MotivationalTicker />

              <p style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem', letterSpacing: '-0.02em', marginTop: '0.5rem' }}>You have {pendingTasks.length} targets remaining.</p>
            </div>

            {isMobile && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(true)}
              style={{ 
                background: 'var(--sidebar-bg)', border: '1px solid var(--border-color)', 
                padding: '0.75rem 1.25rem', borderRadius: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800,
                color: 'var(--text-primary)', marginLeft: isMobile ? '0' : '1rem',
                marginTop: isMobile ? '1rem' : '0'
              }}
            >
              <RotateCcw size={18} /> {isMobile ? 'History' : 'Quick History'}
            </motion.button>
          </div>


          <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <motion.input 
              whileFocus={{ width: isMobile ? '100%' : '360px', backgroundColor: 'white', borderColor: 'var(--accent-primary)' }}
              type="text" 
              placeholder="Quick search workspace..." 
              style={{ width: isMobile ? '100%' : '280px', paddingLeft: '3.5rem', background: 'var(--sidebar-bg)', border: '2px solid transparent', height: '54px', borderRadius: '16px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>


        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '0.8rem', border: '1px solid rgba(30, 58, 138, 0.08)', boxShadow: '0 15px 35px -10px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Plus size={28} style={{ marginLeft: '1rem', color: 'var(--accent-orange)' }} />
            <input 
              type="text" 
              placeholder="Type or paste message (e.g. School tax due tomorrow at 5pm)..." 
              style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)' }} whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '18px', padding: '0 2.5rem', height: '54px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1rem' }}
            >
              <Send size={20} /> Process
            </motion.button>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: isMobile ? '2.5rem' : '5rem' }}>
          {activeTab === 'dashboard' ? (
            <>
              <div>
                <div className="section-title">Active sequence</div>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  <AnimatePresence mode="popLayout">
                    {pendingTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={() => toggleTaskStatus(task.id)} onDelete={() => deleteTask(task.id)} onUpdateProgress={updateTaskProgress} />
                    ))}
                    {pendingTasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.4)', borderRadius: '40px', border: '3px dashed var(--border-color)' }}>
                        <Sparkles size={56} style={{ color: 'var(--accent-orange)', marginBottom: '1.5rem', opacity: 0.3 }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Zero items remaining.</h3>
                        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>You are completely in sync. Time for a focus block?</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div style={{ paddingTop: '0.5rem' }}>
                <div className="section-title">Upcoming Forecast</div>
                <div className="glass-panel" style={{ background: 'var(--card-bg)', padding: '2.5rem', borderRadius: '32px' }}>
                  {pendingTasks.slice(0, 5).map((task, idx) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} key={task.id} style={{ padding: '1.25rem 0', borderBottom: idx === pendingTasks.slice(0, 5).length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                      <div style={{ color: 'var(--accent-orange)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{task.deadline}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.3rem', letterSpacing: '-0.02em' }}>{task.title}</div>
                    </motion.div>
                  ))}
                </div>
                {isMobile && <CustomizableTimer />}
              </div>
            </>
          ) : activeTab === 'timetable' ? (


            <div style={{ gridColumn: '1 / -1' }}>
              <div className="section-title">Weekly Grid View</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(7, 1fr)', gap: '1.75rem' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="glass-panel" style={{ minHeight: isMobile ? 'auto' : '450px', padding: '1.5rem', background: 'var(--card-bg)' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: isMobile ? '1rem' : '2rem', textAlign: 'center', letterSpacing: '0.1em' }}>{day.toUpperCase()}</div>

                    {tasks.filter(t => t.deadline.toLowerCase().includes(day.toLowerCase())).map(t => (
                      <div key={t.id} style={{ fontSize: '0.85rem', padding: '1rem', background: 'var(--sidebar-bg)', borderRadius: '14px', borderLeft: '5px solid var(--accent-primary)', marginBottom: '1rem', fontWeight: 700, lineHeight: '1.2' }}>{t.title}</div>
                    ))}
                    {tasks.filter(t => t.deadline.toLowerCase().includes(day.toLowerCase())).length === 0 && isMobile && <div style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.8rem' }}>No tasks</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="section-title">Completed Experience</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                {completedTasks.map(task => <TaskCard key={task.id} task={task} onToggle={() => toggleTaskStatus(task.id)} onDelete={() => deleteTask(task.id)} onUpdateProgress={updateTaskProgress} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          height: '4.5rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',

          paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 100,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'
        }}>
          <MobileNavItem icon={<LayoutDashboard size={24} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <MobileNavItem icon={<Calendar size={24} />} active={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} />
          <MobileNavItem icon={<CheckCircle2 size={24} />} active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
          {deferredPrompt ? (
            <MobileNavItem icon={<Plus size={24} style={{ color: 'var(--accent-orange)' }} />} active={false} onClick={handleInstallClick} />
          ) : (
            <MobileNavItem icon={<Settings size={24} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          )}
        </nav>

      )}
    </div>
  );
}

function MobileNavItem({ icon, active, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        position: 'relative'
      }}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="activeTabMobile"
          style={{ position: 'absolute', top: '-12px', width: '4px', height: '4px', background: 'var(--accent-primary)', borderRadius: '50%' }} 
        />
      )}
    </motion.div>
  );
}


function SidebarItem({ icon, label, active, onClick }) {

  return (
    <motion.div whileHover={{ x: 8, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.5rem', borderRadius: '18px', cursor: 'pointer',
      background: active ? 'var(--accent-primary)' : 'transparent', color: active ? 'white' : 'var(--text-secondary)',
      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', fontWeight: active ? 800 : 600, boxShadow: active ? '0 12px 24px -6px rgba(30, 58, 138, 0.4)' : 'none'
    }}>
      {icon}
      <span>{label}</span>
    </motion.div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 900, color: color, fontSize: '1.2rem' }}>{value}</span>
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete, onUpdateProgress }) {
  const isDone = task.status === 'done';
  const currentStage = STAGES.find(s => s.id === task.stage) || STAGES[0];
  const isThermal = task.stage === 'thermal';

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass-panel" 
      style={{ 
        display: 'flex', gap: '1.75rem', opacity: isDone ? 0.6 : 1, padding: '2rem', background: 'var(--card-bg)',
        borderLeft: `8px solid ${task.hasProgress ? currentStage.color : (task.priority === 'high' ? 'var(--accent-orange)' : 'var(--accent-primary)')}`,
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Holographic Foil Layer */}
      <div className="holographic-foil" />

      {/* Luminous Wave Shimmer */}
      {task.hasProgress && !isDone && <LuminousWave color={currentStage.color} />}

      {/* Dynamic Background Glow */}
      {task.hasProgress && !isDone && (
        <motion.div 
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 100% 0%, ${currentStage.color}, transparent 60%)`, pointerEvents: 'none' }} 
        />
      )}

      <motion.button whileTap={{ scale: 0.7 }} onClick={onToggle} style={{ 
        width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDone ? 'var(--accent-success)' : 'var(--card-bg)', border: `2px solid ${isDone ? 'var(--accent-success)' : 'var(--text-secondary)'}`,
        boxShadow: isDone ? '0 6px 15px rgba(16, 185, 129, 0.3)' : 'none',
        opacity: isDone ? 1 : 0.6,
        zIndex: 5
      }}>
        {isDone && <CheckCircle size={20} color="white" />}
      </motion.button>

      <div style={{ flex: 1, zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={`badge badge-${task.priority === 'high' ? 'pink' : 'blue'}`} style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}>{task.priority.toUpperCase()}</span>
            {task.hasProgress && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge" style={{ background: 'rgba(0,0,0,0.4)', color: currentStage.color, border: `1px solid ${currentStage.color}40`, backdropFilter: 'blur(10px)' }}>
                  CAMPAIGN
                </span>
                <AuraIndicator color={currentStage.color} />
              </div>
            )}
          </div>
          <Trash2 size={20} style={{ color: '#E2E8F0', cursor: 'pointer' }} onClick={onDelete} />
        </div>
        
        <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', textDecoration: isDone ? 'line-through' : 'none', color: 'var(--text-primary)', textShadow: task.hasProgress ? `0 0 20px ${currentStage.color}33` : 'none' }}>
          {task.title}
        </div>
        
        {task.hasProgress && !isDone && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
              <div className="grindset-text" style={{ fontSize: '0.6rem', color: currentStage.color, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentStage.color }} />
                {currentStage.label} PROTOCOL ACTIVE
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: currentStage.color, letterSpacing: '-0.05em' }}>{task.progress}%</div>
            </div>
            
            <div className="energy-path-container" style={{ height: '8px' }}>
              <div className="energy-glow" style={{ width: `${task.progress}%`, color: currentStage.color, backgroundColor: currentStage.color, boxShadow: `0 0 20px ${currentStage.color}` }}></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {STAGES.map((s) => (
                <motion.div 
                  key={s.id} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`stage-badge ${task.stage === s.id ? 'active' : ''}`}
                  style={{ 
                    color: task.stage === s.id ? s.color : 'var(--text-secondary)',
                    background: task.stage === s.id ? `${s.color}11` : 'transparent'
                  }}
                  onClick={() => onUpdateProgress(task.id, s.threshold)}
                >
                  {s.icon} {s.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {task.deadline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Inbox size={16} /> {task.subject}</div>
        </div>
      </div>
    </motion.div>
  );
}



export default App;
