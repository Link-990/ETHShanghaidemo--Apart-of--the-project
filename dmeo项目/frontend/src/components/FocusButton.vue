<template>
  <button 
    class="focus-button"
    :class="[
      `focus-button--${type}`,
      `focus-button--${size}`,
      {
        'focus-button--loading': loading,
        'focus-button--disabled': disabled
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div class="focus-button__background"></div>
    <div class="focus-button__content">
      <div v-if="loading" class="focus-button__loading">
        <div class="loading-spinner"></div>
      </div>
      <el-icon v-if="icon && !loading" class="focus-button__icon">
        <component :is="icon" />
      </el-icon>
      <span v-if="$slots.default" class="focus-button__text">
        <slot></slot>
      </span>
    </div>
    <div class="focus-button__glow"></div>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.focus-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  font-family: 'Rajdhani', 'Exo 2', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.focus-button:focus {
  outline: none;
}

.focus-button:active {
  transform: scale(0.98);
}

/* 背景层 */
.focus-button__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  transition: all 0.3s ease;
  z-index: 1;
}

/* 内容层 */
.focus-button__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

/* 发光效果 */
.focus-button__glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

/* 尺寸变体 */
.focus-button--small {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 18px;
}

.focus-button--medium {
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 22px;
}

.focus-button--large {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 26px;
}

/* 主要按钮 */
.focus-button--primary .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.9) 0%,
    rgba(37, 99, 235, 0.9) 50%,
    rgba(29, 78, 216, 0.9) 100%
  );
}

.focus-button--primary {
  color: white;
}

.focus-button--primary:hover .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 1) 0%,
    rgba(37, 99, 235, 1) 50%,
    rgba(29, 78, 216, 1) 100%
  );
}

.focus-button--primary:hover .focus-button__glow {
  opacity: 1;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.4) 0%,
    rgba(37, 99, 235, 0.4) 50%,
    rgba(29, 78, 216, 0.4) 100%
  );
  filter: blur(8px);
}

/* 成功按钮 */
.focus-button--success .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.9) 0%,
    rgba(22, 163, 74, 0.9) 50%,
    rgba(21, 128, 61, 0.9) 100%
  );
}

.focus-button--success {
  color: white;
}

.focus-button--success:hover .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 1) 0%,
    rgba(22, 163, 74, 1) 50%,
    rgba(21, 128, 61, 1) 100%
  );
}

.focus-button--success:hover .focus-button__glow {
  opacity: 1;
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.4) 0%,
    rgba(22, 163, 74, 0.4) 50%,
    rgba(21, 128, 61, 0.4) 100%
  );
  filter: blur(8px);
}

/* 危险按钮 */
.focus-button--danger .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.9) 0%,
    rgba(220, 38, 38, 0.9) 50%,
    rgba(185, 28, 28, 0.9) 100%
  );
}

.focus-button--danger {
  color: white;
}

.focus-button--danger:hover .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 1) 0%,
    rgba(220, 38, 38, 1) 50%,
    rgba(185, 28, 28, 1) 100%
  );
}

.focus-button--danger:hover .focus-button__glow {
  opacity: 1;
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.4) 0%,
    rgba(220, 38, 38, 0.4) 50%,
    rgba(185, 28, 28, 0.4) 100%
  );
  filter: blur(8px);
}

/* 次要按钮 */
.focus-button--secondary .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(71, 85, 105, 0.8) 0%,
    rgba(51, 65, 85, 0.8) 50%,
    rgba(30, 41, 59, 0.8) 100%
  );
}

.focus-button--secondary {
  color: rgba(255, 255, 255, 0.9);
}

.focus-button--secondary:hover .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(71, 85, 105, 0.9) 0%,
    rgba(51, 65, 85, 0.9) 50%,
    rgba(30, 41, 59, 0.9) 100%
  );
}

.focus-button--secondary:hover .focus-button__glow {
  opacity: 1;
  background: linear-gradient(135deg, 
    rgba(71, 85, 105, 0.3) 0%,
    rgba(51, 65, 85, 0.3) 50%,
    rgba(30, 41, 59, 0.3) 100%
  );
  filter: blur(8px);
}

/* 警告按钮 */
.focus-button--warning .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.9) 0%,
    rgba(217, 119, 6, 0.9) 50%,
    rgba(180, 83, 9, 0.9) 100%
  );
}

.focus-button--warning {
  color: white;
}

.focus-button--warning:hover .focus-button__background {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 1) 0%,
    rgba(217, 119, 6, 1) 50%,
    rgba(180, 83, 9, 1) 100%
  );
}

.focus-button--warning:hover .focus-button__glow {
  opacity: 1;
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.4) 0%,
    rgba(217, 119, 6, 0.4) 50%,
    rgba(180, 83, 9, 0.4) 100%
  );
  filter: blur(8px);
}

/* 禁用状态 */
.focus-button--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.focus-button--disabled .focus-button__background {
  background: rgba(107, 114, 128, 0.5) !important;
}

.focus-button--disabled:hover {
  transform: none;
}

.focus-button--disabled:hover .focus-button__glow {
  opacity: 0;
}

/* 加载状态 */
.focus-button--loading {
  cursor: default;
}

.focus-button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图标和文本 */
.focus-button__icon {
  font-size: 1.1em;
}

.focus-button__text {
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .focus-button--large {
    padding: 14px 28px;
    font-size: 15px;
  }
  
  .focus-button--medium {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .focus-button--small {
    padding: 6px 14px;
    font-size: 12px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .focus-button {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>