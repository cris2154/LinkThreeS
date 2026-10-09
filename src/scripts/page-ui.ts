interface EntranceOptions {
  selector: string
  readyClass: string
  visibleClass: string
  threshold: number
}

// Small native script: static profile and links do not need React hydration.
export function initializePage({ selector, readyClass, visibleClass, threshold }: EntranceOptions) {
  const dialog = document.querySelector<HTMLDialogElement>('dialog')
  const notice = dialog?.querySelector<HTMLElement>('[data-notice]')
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return
    const missing = event.target.closest<HTMLElement>('[data-missing]')
    if (missing && dialog && notice) {
      event.preventDefault()
      notice.textContent = `Añade tu enlace de ${missing.dataset.missing} en src/profile.ts para conectar tu cuenta.`
      if (!dialog.open) dialog.showModal()
      return
    }
    if (event.target.closest('[data-close]')) dialog?.close()
    const email = event.target.closest<HTMLElement>('[data-email]')?.dataset.email
    if (email) window.location.href = `mailto:${email}`
  })
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return
    const box = dialog.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close()
  })

  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  if (reduced.matches || !('IntersectionObserver' in window)) return
  const blocks = document.querySelectorAll<HTMLElement>(selector)
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add(visibleClass)
      observer.unobserve(entry.target)
    }
  }, { threshold: threshold || 0, rootMargin: '350px 0px' })

  const vh = window.innerHeight || 800
  for (const block of blocks) {
    const rect = block.getBoundingClientRect()
    if (rect.top <= vh + 200) {
      block.classList.add(visibleClass)
    } else {
      block.classList.add(readyClass)
      observer.observe(block)
    }
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return
    observer.disconnect()
    blocks.forEach(block => block.classList.remove(readyClass, visibleClass))
  })
}
