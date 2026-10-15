import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const DESKTOP_QUERY = '(min-width: 768px)'
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useOffcanvas({ panel, toggler }) {
  const isOpen = ref(false)
  let desktopMedia = null

  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const focusableElements = () => Array.from(panel.value?.querySelectorAll(FOCUSABLE) ?? [])

  const onKeydown = (event) => {
    if (!isOpen.value) return
    if (event.key === 'Escape') {
      close()
      return
    }
    if (event.key !== 'Tab') return
    const elements = focusableElements()
    if (elements.length === 0) return
    const first = elements[0]
    const last = elements[elements.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const onDesktopChange = (event) => {
    if (event.matches) close()
  }

  watch(isOpen, async (value) => {
    document.body.classList.toggle('overflow-hidden', value)
    if (value) {
      await nextTick()
      focusableElements()[0]?.focus()
    } else {
      toggler.value?.focus()
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    desktopMedia = window.matchMedia(DESKTOP_QUERY)
    desktopMedia.addEventListener('change', onDesktopChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    desktopMedia?.removeEventListener('change', onDesktopChange)
    document.body.classList.remove('overflow-hidden')
  })

  return { isOpen, open, close, toggle }
}
