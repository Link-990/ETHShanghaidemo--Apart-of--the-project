<template>
  <div class="lp">
    <section class="hero edge" @mousemove="onHeroMove" @mouseleave="resetHeroMove">
      <div class="hero-i" :style="heroStyle"></div>

      <div class="particles">
        <div class="particle" v-for="n in 12" :key="n" :style="{ 
          '--delay': Math.random() * 8 + 's',
          '--duration': (Math.random() * 12 + 15) + 's',
          '--x': Math.random() * 100 + '%',
          '--y': Math.random() * 100 + '%',
          '--size': (Math.random() * 3 + 2) + 'px'
        }"></div>
      </div>
      <h1>AIxETH</h1>
      <p class="hero-subtitle">融合人工智能与以太坊生态，构建下一代智能化Web3应用平台。</p>
      
    </section>

    <section class="infra edge reveal" @mouseenter="stop" @mouseleave="start">
      <h2>AI驱动的智能化基础设施</h2>
      <p class="sub">结合人工智能与区块链技术，提供高效、安全、智能的开发体验</p>
      <div
        class="carousel"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.passive="onTouchEnd"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <button class="nav l" @click="next" aria-label="下一张">‹</button>
        <div class="track" :style="{ transform: `translateX(${-current * 100}%)` }">
          <div
            class="slide"
            v-for="(s,i) in slides"
            :key="i"
            :class="{ active: i === current }"
          >
            <div class="card">
              <div class="chart">
         
                <svg class="art" viewBox="0 0 600 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#00d4ff">
                        <animate attributeName="stop-color" values="#00d4ff;#21d4fd;#00d4ff" dur="12s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stop-color="#9c26ff">
                        <animate attributeName="stop-color" values="#9c26ff;#ff3d9a;#9c26ff" dur="10s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <radialGradient id="rg1" cx="30%" cy="30%" r="50%">
                      <stop offset="0%" stop-color="#21d4fd" stop-opacity=".7">
                        <animate attributeName="stop-opacity" values=".6;.8;.6" dur="8s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stop-color="#11162a" stop-opacity="0"/>
                    </radialGradient>
                    <filter id="blur1"><feGaussianBlur stdDeviation="15"/></filter>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#g1)" opacity=".3"/>
                  <circle cx="150" cy="80" r="100" fill="url(#rg1)" filter="url(#blur1)">
                    <animate attributeName="cx" values="150;450;150" dur="12s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="80;140;80" dur="10s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="450" cy="160" r="120" fill="#1b6dff" opacity=".2">
                    <animate attributeName="cy" values="160;100;160" dur="10s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values=".2;.35;.2" dur="8s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <div class="m">
                <div class="k">{{ s.k1 }}</div>
                <div class="t">{{ s.t1 }}</div>
              </div>
              <div class="m">
                <div class="k">{{ s.k2 }}</div>
                <div class="t">{{ s.t2 }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="nav r" @click="prev" aria-label="上一张">›</button>
        <div class="dots">
          <button
            v-for="(s,i) in slides"
            :key="i"
            :class="{ on: i === current }"
            @click="go(i)"
            :aria-label="`跳转到第 ${i+1} 张`"
          ></button>
        </div>
      </div>
    </section>

    <section class="features edge reveal">
      <h2>核心能力</h2>
      <div class="grid">
        <div class="f">
          <div class="img">
            <svg class="art art-sm" viewBox="0 0 600 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#6a5cff"/>
                  <stop offset="100%" stop-color="#2fd7ff"/>
                </linearGradient>
                <filter id="blur2"><feGaussianBlur stdDeviation="12"/></filter>
              </defs>
              <rect width="100%" height="100%" fill="#0f1426"/>
              <ellipse cx="200" cy="110" rx="120" ry="60" fill="#7a5cff" opacity=".3" filter="url(#blur2)">
                <animate attributeName="opacity" values=".3;.5;.3" dur="8s" repeatCount="indefinite"/>
              </ellipse>
              <ellipse cx="400" cy="110" rx="120" ry="60" fill="#2fd7ff" opacity=".25" filter="url(#blur2)">
                <animate attributeName="opacity" values=".25;.4;.25" dur="6s" repeatCount="indefinite"/>
              </ellipse>
            </svg>
          </div>
          <h3>AI智能合约生成</h3>
          <p>基于自然语言描述，自动生成安全、高效的智能合约代码。</p>
        </div>
        <div class="f">
          <div class="img">
            <svg class="art art-sm" viewBox="0 0 600 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#ff6b35"/>
                  <stop offset="100%" stop-color="#9c26ff"/>
                </linearGradient>
                <filter id="blur3"><feGaussianBlur stdDeviation="10"/></filter>
              </defs>
              <rect width="100%" height="100%" fill="#0f1426"/>
              <circle cx="150" cy="110" r="80" fill="#ff6b35" opacity=".3" filter="url(#blur3)">
                <animate attributeName="opacity" values=".3;.45;.3" dur="7s" repeatCount="indefinite"/>
              </circle>
              <circle cx="450" cy="110" r="80" fill="#9c26ff" opacity=".25" filter="url(#blur3)">
                <animate attributeName="opacity" values=".25;.4;.25" dur="9s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <h3>链上AI</h3>
          <p>直接在区块链上运行AI模型，确保推理过程透明可验证。</p>
        </div>
        <div class="f">
          <div class="img">
            <svg class="art art-sm" viewBox="0 0 600 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#00ff88"/>
                  <stop offset="100%" stop-color="#00d4ff"/>
                </linearGradient>
                <filter id="blur4"><feGaussianBlur stdDeviation="8"/></filter>
              </defs>
              <rect width="100%" height="100%" fill="#0f1426"/>
              <ellipse cx="300" cy="110" rx="150" ry="80" fill="#00ff88" opacity=".3" filter="url(#blur4)">
                <animate attributeName="opacity" values=".3;.45;.3" dur="10s" repeatCount="indefinite"/>
              </ellipse>
            </svg>
          </div>
          <h3>跨链AI服务</h3>
          <p>统一的AI服务接口，支持多个区块链网络的无缝集成。</p>
        </div>
      </div>
    </section>

    <section class="code edge reveal">
      <h2>AI驱动的智能合约开发</h2>
      <p class="sub">使用自然语言描述需求，AI自动生成优化的智能合约代码。</p>
      <div class="codecard">
        <pre><code>// AI生成的智能合约示例
// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.26 and less than 0.9.0
pragma solidity ^0.8.26;

contract HelloWorld {
    string public greet = "Hello World!";
}
// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.26 and less than 0.9.0
pragma solidity ^0.8.26;

contract HelloWorld {
    string public greet = "Hello World!";
}

}</code></pre>
      </div>
      <div class="ctas"><button class="p">开始构建</button></div>
    </section>

    <section class="support edge reveal">
      <h2>开发者支持</h2>
      <div class="sup">
        <div class="mini"><div class="mc"></div><div class="mc"></div><div class="mc"></div></div>
        <ul class="links">
          <li><a href="#">开发者论坛</a> →</li>
          <li><a href="#">AI工具文档</a> →</li>
          <li><a href="#">技术支持</a> →</li>
        </ul>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#21d4fd"/>
                  <stop offset="100%" stop-color="#1b6dff"/>
                </linearGradient>
              </defs>
              <path d="M20 4C11.2 4 4 11.2 4 20s7.2 16 16 16 16-7.2 16-16S28.8 4 20 4zm0 28c-6.6 0-12-5.4-12-12S13.4 8 20 8s12 5.4 12 12-5.4 12-12 12z" fill="url(#logoGrad)"/>
              <circle cx="20" cy="20" r="6" fill="url(#logoGrad)" opacity="0.8"/>
            </svg>
          </div>
          <span class="logo-text">AIxETH</span>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>Learn</h4>
            <ul>
              <li><a href="#">AI与区块链入门</a></li>
              <li><a href="#">智能合约开发</a></li>
              <li><a href="#">应用案例</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>Build</h4>
            <ul>
              <li><a href="#">开发者门户</a></li>
              <li><a href="#">API文档</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">技术活动</a></li>
              <li><a href="#">开发者社区</a></li>
            </ul>
          </div>
          
          
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="social-links">
          <!-- <a href="#" aria-label="Discord"><svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="currentColor"/></svg></a>
          <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg></a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg></a> -->
        </div>
        <div class="copyright">
          <p>© 2025 COPYRIGHT AIXETH FOUNDATION. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const slides = [
  { k1: '99.9%', t1: 'AI模型准确率', k2: '~100ms', t2: '智能分析响应时间' },
  { k1: '智能合约', t1: 'AI辅助开发', k2: '自动优化', t2: 'Gas费用智能优化' },
  { k1: '多链支持', t1: '跨链AI服务', k2: '开发者友好', t2: '一键部署AI dApp' }
]
const current = ref(0)
let timer: any = null
const next = () => (current.value = (current.value + 1) % slides.length)
const prev = () => (current.value = (current.value + slides.length - 1) % slides.length)
const go = (i: number) => (current.value = i)
const start = () => {
  stop()
  timer = setInterval(next, 4000)
}
const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}


let startX = 0
let deltaX = 0
let dragging = false
const threshold = 50

const onTouchStart = (e: TouchEvent) => {
  stop()
  startX = e.touches[0].clientX
  dragging = true
}
const onTouchMove = (e: TouchEvent) => {
  if (!dragging) return
  deltaX = e.touches[0].clientX - startX
}
const onTouchEnd = () => {
  if (!dragging) return
  if (deltaX > threshold) prev()
  else if (deltaX < -threshold) next()
  dragging = false
  deltaX = 0
  start()
}

const onPointerDown = (e: PointerEvent) => {
  stop()
  startX = e.clientX
  dragging = true
}
const onPointerMove = (e: PointerEvent) => {
  if (!dragging) return
  deltaX = e.clientX - startX
}
const onPointerUp = () => {
  if (!dragging) return
  if (deltaX > threshold) prev()
  else if (deltaX < -threshold) next()
  dragging = false
  deltaX = 0
  start()
}

// Hero subtle parallax
const hx = ref(0)
const hy = ref(0)
const onHeroMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  hx.value = x * 20
  hy.value = y * 20
}
const resetHeroMove = () => {
  hx.value = 0
  hy.value = 0
}
const heroStyle = computed(() => ({ transform: `translate3d(${hx.value}px, ${hy.value}px, 0)` }))

// Reveal on scroll
const observeReveal = () => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('show')
        } else {
          // 可选：当元素离开视口时移除show类，实现重复动画
          // en.target.classList.remove('show')
        }
      })
    },
    { 
      threshold: 0.1,  // 降低阈值，让动画更早触发
      rootMargin: '0px 0px -50px 0px'  // 添加底部边距，确保元素完全进入视口前触发
    }
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
}

onMounted(() => {
  start()
  observeReveal()
})

onBeforeUnmount(stop)
</script>

<style scoped>
:root { --bg:#0b1220; --fg:#dfe7ff; --mut:#9fb0d0; --p:#6a5cff; --edge:6%; }
.lp {
  color: var(--fg);
  background:
    radial-gradient(800px 400px at 50% 50%, #4a3d8a 0%, #2a1f5c 40%, transparent 80%),
    radial-gradient(600px 300px at 20% 80%, #0f5a8a 0%, #1a4d74 50%, transparent 90%),
    radial-gradient(400px 200px at 80% 20%, #2d1a6b 0%, #1a0d4d 60%, transparent 100%),
    linear-gradient(135deg, 
      #0b1220 0%, 
      #1a0f3d 25%, 
      #0f1a3d 50%, 
      #2a1f5c 75%, 
      #0b1220 100%
    ),
    #0b1220;
  animation: backgroundShift 40s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% { 
    background-position: 0% 0%, 0% 0%, 0% 0%;
  }
  50% { 
    background-position: 20% 15%, -15% 20%, 15% -10%;
  }
}
section { max-width:100%; margin:0 auto; padding:96px 24px; text-align:center; position:relative }
h1 { 
  font-size: 5rem; 
  line-height: 1.05; 
  margin: 0 0 24px;
  font-family: 'Orbitron', 'Exo 2', sans-serif;
  font-weight: 900;
  letter-spacing: 3px;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.6), 0 0 80px rgba(0, 212, 255, 0.4);
  text-align: center;
  max-width: 100%;
}
h2 { 
  font-size:36px; 
  margin:0 0 12px;
  font-family: 'Orbitron', 'Exo 2', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
}
p.sub { color:var(--mut); margin:0 0 24px }
.ctas { display:flex; gap:12px; justify-content:center; margin-top:20px }
button { border:0; border-radius:999px; padding:12px 20px; background:#1d2540; color:#fff; transition: transform .2s ease, box-shadow .2s ease, background .2s ease }
button:hover { transform: translateY(-1px); box-shadow:0 10px 24px rgba(47,215,255,.18) }
button:active { transform: translateY(0) scale(.98) }
button.p { 
  background: linear-gradient(135deg, #7a5cff 0%, #9c26ff 25%, #2fd7ff 50%, #00ff88 75%, #ff6b35 100%); 
  box-shadow: 0 6px 24px rgba(47,215,255,.35), 0 0 40px rgba(156,38,255,.2);
  animation: buttonGlow 3s ease-in-out infinite alternate;
}

@keyframes buttonGlow {
  0% { 
    box-shadow: 0 6px 24px rgba(47,215,255,.35), 0 0 40px rgba(156,38,255,.2);
    filter: hue-rotate(0deg);
  }
  100% { 
    box-shadow: 0 8px 32px rgba(156,38,255,.45), 0 0 50px rgba(0,255,136,.3);
    filter: hue-rotate(30deg);
  }
}
/* Hero section styles */
.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 32px;
  max-width: 600px;
  line-height: 1.6;
  font-weight: 400;
  text-align: center;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.hero-btn-primary, .hero-btn-secondary {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-family: 'Rajdhani', 'Exo 2', sans-serif;
  letter-spacing: 0.5px;
  min-width: 140px;
}

.hero-btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #7a5cff 100%);
  color: white;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
  background: linear-gradient(135deg, #00e5ff 0%, #00aadd 50%, #8a6cff 100%);
}

.hero-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}
.edge { mask-image:linear-gradient(90deg, transparent 0, #000 var(--edge), #000 calc(100% - var(--edge)), transparent 100%); -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 var(--edge), #000 calc(100% - var(--edge)), transparent 100%) }
.hero { 
  min-height: 100vh; 
  height: 100vh;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  gap: 24px; 
  overflow: hidden;
  position: relative;
  padding: 0 24px;
}
.hero .hero-i { 
  position: absolute; 
  inset: -30%; 
  background: conic-gradient(
    from 0deg,
    #00d4ff 0%,
    #1b9cff 20%,
    #9c26ff 40%,
    #ff3d9a 60%,
    #00ff88 80%,
    #00d4ff 100%
  ); 
  filter: blur(120px); 
  opacity: 0.4; 
  will-change: transform; 
  transition: transform 0.3s ease;
  animation: heroRotate 60s linear infinite;
}

@keyframes heroRotate { 
  to { transform: rotate(360deg) }
}

@keyframes heroPulse {
  0% { opacity: .3; filter: blur(80px); }
  100% { opacity: .4; filter: blur(75px); }
}

/* 粒子动画效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(47,215,255,0.8) 0%, rgba(122,92,255,0.6) 50%, rgba(0,255,136,0.4) 70%, transparent 100%);
  border-radius: 50%;
  animation: particleFloat var(--duration) ease-in-out infinite var(--delay);
  filter: blur(1px);
  left: var(--x);
  top: var(--y);
  box-shadow: 0 0 8px rgba(47,215,255,0.3);
}

.particle:nth-child(odd) {
  background: radial-gradient(circle, rgba(156,38,255,0.6) 0%, rgba(255,61,154,0.4) 70%, transparent 100%);
  box-shadow: 0 0 8px rgba(156,38,255,0.3);
}

.particle:nth-child(3n) {
  background: radial-gradient(circle, rgba(0,255,136,0.6) 0%, rgba(0,212,255,0.4) 70%, transparent 100%);
  box-shadow: 0 0 8px rgba(0,255,136,0.3);
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes spin { to { transform: rotate(360deg) }}

/* Carousel */
.carousel { position:relative; margin-top:24px; overflow:hidden }
.track { display:flex; transition: transform .6s cubic-bezier(.2,.7,.2,1) }
.slide { flex:0 0 100%; display:flex; justify-content:center; opacity:.7; transform:scale(.98); transition: opacity .5s ease, transform .5s ease }
.slide.active { opacity:1; transform:scale(1) }
.card { 
  width:480px; 
  max-width:86vw; 
  min-height:280px;
  height:280px;
  background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.06)); 
  backdrop-filter:blur(12px); 
  border:1px solid rgba(255,255,255,.18); 
  border-radius:16px; 
  box-shadow:0 10px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08); 
  padding:20px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17,22,42,.95), rgba(11,15,30,.98));
  border-radius: 16px;
  z-index: -1;
}
.chart { 
  height:140px; 
  background:linear-gradient(135deg, rgba(33,212,253,.22), rgba(27,109,255,.18)); 
  border-radius:12px; 
  margin-bottom:16px; 
  box-shadow:inset 0 0 40px rgba(0,0,0,.3); 
  position:relative; 
  overflow:hidden;
  flex-shrink: 0;
}
.f .img { height:120px; border-radius:12px; margin-bottom:12px; background:#0f1426; position:relative; overflow:hidden }
.art { width:100%; height:100%; display:block }
.m { 
  display:flex; 
  gap:12px; 
  align-items:baseline; 
  justify-content:center;
  flex-shrink: 0;
  margin-bottom: 8px;
}
.k { font-size:24px; font-weight:700 }
.t { font-size:14px; color:var(--mut) }
.nav { position:absolute; top:50%; transform:translateY(-50%); width:36px; height:36px; border-radius:50%; background:rgba(17,22,40,.7); backdrop-filter:blur(6px); color:#fff; z-index:3; pointer-events:auto; display:flex; align-items:center; justify-content:center; font-size:18px; line-height:1 }
.carousel .nav.l { left: 20px; }
.carousel .nav.r { right: 20px; }
.dots { display:flex; gap:8px; justify-content:center; margin-top:16px }
.dots button { width:8px; height:8px; border-radius:50%; background:#3a456b; opacity:.7 }
.dots button.on { background:linear-gradient(135deg, #7a5cff, #2fd7ff); opacity:1 }

/* Features */
.features .grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px; margin-top:24px }
.f { 
  background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); 
  border:1px solid rgba(255,255,255,.12); 
  border-radius:16px; 
  padding:24px; 
  box-shadow:0 10px 40px rgba(0,0,0,.45); 
  transition: transform .25s ease, box-shadow .25s ease;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}
.f:hover { transform: translateY(-2px); box-shadow:0 18px 48px rgba(0,0,0,.5) }
.f .img { 
  height:160px; 
  border-radius:12px; 
  margin-bottom:16px; 
  background:radial-gradient(80% 80% at 70% 30%, rgba(47,215,255,.45), transparent), radial-gradient(70% 70% at 30% 70%, rgba(122,92,255,.45), transparent), #11162a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.f h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #e2e8f0;
  font-family: 'Rajdhani', 'Exo 2', sans-serif;
}

.f p {
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
  flex-grow: 1;
}
/* Code */
.code .codecard { max-width:720px; margin:16px auto; background:#0f1426; border:1px solid rgba(255,255,255,.12); border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,.5); text-align:left; overflow:auto }
.code pre { margin:0; padding:16px; color:#cfe3ff }

/* Support */
.support .sup { display:grid; grid-template-columns:320px 1fr; gap:24px; align-items:center; margin-top:16px }
.mini { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px }
.mc { height:120px; border-radius:14px; background:linear-gradient(135deg, rgba(122,92,255,.5), rgba(47,215,255,.4)); box-shadow:0 10px 40px rgba(0,0,0,.45) }
.links { list-style:none; padding:0; margin:0; text-align:left }
.links li { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(255,255,255,.08) }
.links a { color:#e8f0ff; text-decoration:none }

/* Reveal */
.reveal { 
  opacity: 0; 
  visibility: hidden;
  transform: translateY(30px); 
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              visibility 0s linear 0.8s;
  will-change: opacity, transform;
}
.reveal.show { 
  opacity: 1; 
  visibility: visible;
  transform: translateY(0);
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              visibility 0s linear 0s;
}

/* Responsive */
@media (max-width: 900px) {
  h1 { 
    font-size: 3.5rem;
    font-family: 'Orbitron', 'Exo 2', sans-serif;
    font-weight: 900;
    letter-spacing: 2px;
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3);
  }
  h2 { 
    font-size:28px;
    font-family: 'Orbitron', 'Exo 2', sans-serif;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }
  .features .grid { grid-template-columns:1fr }
  .support .sup { grid-template-columns:1fr }
  .footer-content { flex-direction:column; gap:32px }
  .footer-links { grid-template-columns:repeat(2, 1fr) }
  .footer-bottom { flex-direction:column; gap:16px; text-align:center }
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .hero-ctas {
    flex-direction: column;
    gap: 12px;
  }
  
  .hero-btn-primary, .hero-btn-secondary {
    width: 100%;
    max-width: 280px;
    padding: 12px 24px;
    font-size: 15px;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin: 0 0 24px;
    padding: 0 16px;
  }
  
  h1 {
    font-size: 2.8rem !important;
    letter-spacing: 1.5px;
  }
}

/* Footer */
.footer {
  background: linear-gradient(180deg, rgba(11,18,32,0.95) 0%, rgba(8,14,26,1) 100%);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 48px 24px 24px;
  margin-top: 64px;
  margin-left: -24px;
  margin-right: -24px;
  width: calc(100% + 48px);
}

.footer-content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--fg);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  flex: 1;
}

.link-group h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 8px;
}

.link-group a {
  color: var(--mut);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.link-group a:hover {
  color: var(--fg);
}

.footer-bottom {
  max-width: 1120px;
  margin: 32px auto 0;
  padding: 24px 24px 0;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mut);
  transition: all 0.2s ease;
}

.social-links a:hover {
  background: rgba(255,255,255,0.1);
  color: var(--fg);
  transform: translateY(-1px);
}

.social-links svg {
  width: 16px;
  height: 16px;
}

.copyright p {
  font-size: 12px;
  color: var(--mut);
  margin: 0;
  letter-spacing: 0.5px;
}
</style>