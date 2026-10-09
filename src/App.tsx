import { ArrowDown, ArrowUpRight, Facebook, FileText, Github, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Sparkles, UserRound, X, Youtube } from 'lucide-react'
import { profile as defaultProfile, type Profile, type LinkIcon } from './profile'
import VioletBackground from './components/VioletBackground'
import TikTokIcon from './components/TikTokIcon'
import XTwitterIcon from './components/XTwitterIcon'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<LinkIcon, any> = {
  instagram: Instagram,
  tiktok: TikTokIcon,
  youtube: Youtube,
  portfolio: Globe,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  twitter_x: XTwitterIcon,
  whatsapp: MessageCircle,
  cv: FileText,
  mail: Mail,
  other: Globe,
}

const tones: Record<LinkIcon, string> = {
  instagram: 'rose',
  tiktok: 'violet',
  youtube: 'red',
  portfolio: 'violet',
  facebook: 'blue',
  linkedin: 'blue',
  github: 'violet',
  twitter_x: 'violet',
  whatsapp: 'green',
  cv: 'blue',
  mail: 'rose',
  other: 'violet',
}

export default function App({ profile = defaultProfile }: { profile?: Profile }) {
  const whatsapp = profile.whatsapp.replace(/\D/g, '')
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(profile.whatsappMessage)}` : ''
  return (
    <div className="page-shell min-h-screen px-5 sm:px-10 lg:px-16">
      <VioletBackground />
      <a href="#links" className="skip-link">Ir a mis enlaces</a>
<main className="mx-auto grid max-w-6xl gap-10 pb-12 pt-7 sm:pt-12 lg:grid-cols-[1fr_1.08fr] lg:gap-24 lg:pb-20 lg:pt-16">
        <section className="profile-section text-center lg:text-left" aria-labelledby="profile-name">
          <p className="eyebrow mb-3">HOLA, SOY</p>
          <h1 id="profile-name" className="text-[clamp(2.5rem,5vw,3.9rem)] leading-[1.05] font-bold tracking-[-0.06em] break-words">{profile.name}<span className="accent-dot">.</span></h1>
          <p className="muted mt-3 text-sm">{profile.handle}</p>
          <div className="avatar-wrap relative mx-auto mt-6 w-fit lg:mx-0">
            <div className="avatar">{profile.photo ? <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" /> : <span className="photo-placeholder"><UserRound size={35} strokeWidth={1.2} aria-hidden="true" /><span>Tu foto aquí</span></span>}</div>
          </div>
          <p className="mt-7 text-sm font-semibold">{profile.role}</p>
          <p className="muted mx-auto mt-3 max-w-sm text-[15px] leading-7 lg:mx-0">{profile.bio}</p>
          <div className="muted mt-5 flex items-center justify-center gap-1.5 text-xs lg:justify-start"><MapPin size={14} />{profile.location}</div>
          <div className="social-dock mt-7 flex justify-center gap-2.5 lg:justify-start" aria-label="Redes sociales">
            {profile.links.filter(link => link.icon !== 'portfolio' && link.icon !== 'mail' && link.icon !== 'whatsapp' && link.icon !== 'cv').map(link => {
              const Icon = icons[link.icon] || Globe
              const isMail = link.url?.startsWith('mailto:')
              return link.url ? <a className="icon-button" key={link.title} href={link.url} target={!isMail ? '_blank' : undefined} rel={!isMail ? 'noopener noreferrer' : undefined} aria-label={`Abrir ${link.title}`}><Icon size={18} /></a> : <button className="icon-button" key={link.title} data-missing={link.title} aria-label={`Abrir ${link.title}`}><Icon size={18} /></button>
            })}
            {whatsappUrl ? (
              <a className="icon-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">
                <MessageCircle size={18} />
              </a>
            ) : (
              <button className="icon-button" data-missing="WhatsApp" aria-label="Abrir WhatsApp">
                <MessageCircle size={18} />
              </button>
            )}
            {profile.email ? <a className="icon-button" href={`mailto:${profile.email}`} aria-label="Enviar correo"><Mail size={18} /></a> : <button className="icon-button" data-missing="correo" aria-label="Enviar correo"><Mail size={18} /></button>}
          </div>
          <div className="availability mt-9 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium"><span className="h-1.5 w-1.5 rounded-full bg-violet-400" />{profile.available}</div>
          <div className="editorial-note mt-14 hidden lg:block"><span aria-hidden="true">✳</span><p>Buenas ideas.<br />Personas reales.<br /><strong>Conexiones que suman.</strong></p></div>
        </section>

        <section id="links" aria-labelledby="links-title" className="min-w-0 scroll-mt-6">
          <div className="mb-5 flex items-center justify-between"><h2 id="links-title" className="eyebrow">MI PEQUEÑO UNIVERSO</h2><ArrowDown size={16} className="muted" /></div>
          <a href={whatsappUrl || '#whatsapp'} data-missing={whatsappUrl ? undefined : 'WhatsApp'} target={whatsappUrl ? '_blank' : undefined} rel="noopener noreferrer" className="whatsapp-card group block rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between"><span className="whatsapp-icon"><MessageCircle size={25} /></span><span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest"><span className="h-1.5 w-1.5 rounded-full bg-current" />HABLEMOS</span></div>
            <div className="mt-7 flex items-end justify-between gap-4"><div><h3 className="text-2xl font-bold tracking-tight">¿Creamos algo juntos?</h3><p className="mt-2 text-sm opacity-80">Escríbeme por WhatsApp. Así de fácil.</p></div><ArrowUpRight className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={25} /></div>
          </a>
          <div className="mt-3 grid gap-3">
            {profile.links.map(link => {
              const Icon = icons[link.icon] || Globe
              const toneClass = tones[link.icon] || 'violet'
              const isMail = link.url?.startsWith('mailto:')
              return <a key={link.title} href={link.url || '#configurar'} data-missing={link.url ? undefined : link.title} target={link.url && !isMail ? '_blank' : undefined} rel={link.url && !isMail ? 'noopener noreferrer' : undefined} className="link-card group flex items-center gap-4 rounded-2xl p-4 sm:px-5 sm:py-5">
                <span className={`social-icon ${toneClass}`}><Icon size={23} strokeWidth={1.7} /></span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{link.title}</h3>{link.tag && <span className="link-tag">{link.tag}</span>}</div><p className="muted mt-1 text-xs leading-5">{link.description}</p></div>
                <ArrowUpRight size={18} className="muted shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            })}
          </div>
          <div className="closing-note mt-7 flex items-center justify-center gap-2 text-center text-xs"><Sparkles size={14} /><p>{profile.headline}</p></div>
        </section>
      </main>
      <footer className="muted mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t py-6 text-[11px] sm:flex-row"><p>© {new Date().getFullYear()} {profile.name}</p><p>Un solo lugar. Todas mis conexiones.</p></footer>
      <dialog  aria-labelledby="notice-title"   className="notice-dialog">
        <div className="flex items-center justify-between gap-5"><h2 id="notice-title" className="font-bold">Tu página, tus conexiones</h2><button className="icon-button" data-close="" aria-label="Cerrar aviso" autoFocus><X size={18} /></button></div>
        <p data-notice="" className="muted mt-4 text-sm leading-7 break-words"></p>
        <button className="share-button mt-5" data-close="">Entendido</button>
      </dialog>
    </div>
  )
}





