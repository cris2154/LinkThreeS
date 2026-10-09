import { profile as defaultProfile, type Profile, type ProfileLink, type LinkIcon } from '../profile'

const DEFAULT_METAS: Record<LinkIcon, { title: string; description: string; tag?: string }> = {
  instagram: { title: 'Instagram', description: 'Mi día a día, en imágenes', tag: 'SÍGUEME' },
  github: { title: 'GitHub', description: 'Mi código, proyectos y experimentos', tag: 'CÓDIGO' },
  linkedin: { title: 'LinkedIn', description: 'Mi perfil profesional y trayectoria', tag: 'CONECTAR' },
  twitter_x: { title: 'X', description: 'Ideas, reflexiones y novedades', tag: 'SEGUIR' },
  youtube: { title: 'YouTube', description: 'Un espacio para crear y compartir', tag: 'SUSCRÍBETE' },
  tiktok: { title: 'TikTok', description: 'El proceso también es parte de la historia', tag: 'VIDEOS' },
  portfolio: { title: 'Mi portafolio', description: 'Ideas que se convirtieron en proyectos', tag: 'EXPLORA' },
  facebook: { title: 'Facebook', description: 'Conecta conmigo en redes', tag: 'SEGUIR' },
  whatsapp: { title: 'WhatsApp', description: 'Escríbeme directamente por WhatsApp', tag: 'CHATEAR' },
  cv: { title: 'Currículum Vitae', description: 'Experiencia, habilidades y trayectoria profesional', tag: 'CV' },
  mail: { title: 'Correo', description: 'Escríbeme directamente por email', tag: 'CONTACTO' },
  other: { title: 'Enlace', description: 'Visita mi sitio web', tag: 'ENLACE' },
}

function normalizeIcon(rawRed: unknown): LinkIcon {
  if (typeof rawRed !== 'string') return 'other'
  const val = rawRed.toLowerCase().trim()
  if (val === 'instagram' || val === 'instagran') return 'instagram'
  if (val === 'github') return 'github'
  if (val === 'linkedin') return 'linkedin'
  if (val === 'twitter_x' || val === 'twitter' || val === 'x') return 'twitter_x'
  if (val === 'youtube') return 'youtube'
  if (val === 'tiktok') return 'tiktok'
  if (val === 'facebook') return 'facebook'
  if (val === 'portfolio' || val === 'portafolio' || val === 'web' || val === 'otro' || val === 'other') return 'portfolio'
  if (val === 'whatsapp' || val === 'wasap' || val === 'wsp' || val === 'numero' || val === 'telefono') return 'whatsapp'
  if (val === 'cv' || val === 'curriculum' || val === 'resume') return 'cv'
  if (val === 'correo' || val === 'email' || val === 'mail') return 'mail'
  return 'portfolio'
}

function sanitizeUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return ''
  let trimmed = rawUrl.trim()
  if (!trimmed) return ''

  // Corregir https:/ o http:/ con una sola barra
  if (/^https?:\/[^\/]/i.test(trimmed)) {
    trimmed = trimmed.replace(/^(https?):\/+/i, '$1://')
  }

  // Email sin prefijo mailto:
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`
  }

  // URL relativa de protocolo //
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  // URL con protocolo válido ya especificado
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed
  }

  // Enlace con www. o dominio reconocido (ej: www.linkedin.com/..., linkedin.com/...)
  if (/^(www\.|[a-zA-Z0-9-]+\.(?:com|org|net|io|dev|me|co|app|pe|es|lat)\b)/i.test(trimmed)) {
    return `https://${trimmed}`
  }

  // Cualquier URL sin protocolo tipo host/path
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`
  }

  return ''
}

function resolveMediaUrl(rawMedia: unknown, baseUrl: string): string {
  if (!rawMedia) return ''
  let mediaUrl = ''
  if (typeof rawMedia === 'string') {
    mediaUrl = rawMedia
  } else if (typeof rawMedia === 'object') {
    const obj = rawMedia as Record<string, any>
    if (typeof obj.url === 'string') {
      mediaUrl = obj.url
    } else if (obj.data?.attributes?.url) {
      mediaUrl = obj.data.attributes.url
    } else if (obj.data?.url) {
      mediaUrl = obj.data.url
    }
  }
  if (!mediaUrl) return ''
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl
  return `${baseUrl}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`
}

function extractBlocksText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map(block => {
      if (block && Array.isArray(block.children)) {
        return block.children
          .map((child: any) => (typeof child?.text === 'string' ? child.text : ''))
          .join('')
          .trim()
      }
      return ''
    })
    .filter(Boolean)
    .join('\n\n')
}

function extractHandleFromUrl(url: string): string {
  const igMatch = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/i)
  if (igMatch && igMatch[1]) return `@${igMatch[1]}`
  const xMatch = url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9._]+)/i)
  if (xMatch && xMatch[1]) return `@${xMatch[1]}`
  const ghMatch = url.match(/github\.com\/([a-zA-Z0-9._-]+)/i)
  if (ghMatch && ghMatch[1]) return `@${ghMatch[1]}`
  return ''
}

function extractWhatsappNumber(urlOrNumber: unknown): string {
  if (!urlOrNumber || typeof urlOrNumber !== 'string') return ''
  const waMatch = urlOrNumber.match(/wa\.me\/(\+?\d+)/i)
  if (waMatch && waMatch[1]) return waMatch[1].replace(/\D/g, '')
  const apiMatch = urlOrNumber.match(/phone=(\+?\d+)/i)
  if (apiMatch && apiMatch[1]) return apiMatch[1].replace(/\D/g, '')
  const digits = urlOrNumber.replace(/\D/g, '')
  return digits.length >= 7 ? digits : ''
}

interface FetchOptions {
  strapiUrl: string
  strapiToken: string
}

async function fetchFromStrapi(endpoint: string, { strapiUrl, strapiToken }: FetchOptions) {
  const url = `${strapiUrl}${endpoint}`
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (strapiToken) {
    headers.Authorization = `Bearer ${strapiToken}`
  }

  const response = await fetch(url, { headers })
  return response
}

export async function loadProfile(): Promise<Profile> {
  let envUrl = import.meta.env.STRAPI_URL || ''
  let envToken = import.meta.env.STRAPI_API_TOKEN || ''

  if (!envUrl && typeof globalThis !== 'undefined' && 'process' in globalThis) {
    try {
      const fsName = 'node:fs'
      const pathName = 'node:path'
      const fs: any = await import(/* @vite-ignore */ fsName)
      const path: any = await import(/* @vite-ignore */ pathName)
      const envPath = path.resolve((globalThis as any).process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8')
        for (const line of content.split('\n')) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
          if (match) {
            const key = match[1]
            let value = (match[2] || '').trim()
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
            if (key === 'STRAPI_URL' && !envUrl) envUrl = value
            if (key === 'STRAPI_API_TOKEN' && !envToken) envToken = value
          }
        }
      }
    } catch {
      // Entorno no basado en Node o empaquetado
    }
  }

  const strapiUrl = String(envUrl || 'https://portafolioe.onrender.com').trim().replace(/\/$/, '')
  const strapiToken = String(envToken).trim()

  if (!strapiUrl) {
    console.info('[load-profile] STRAPI_URL no está configurado. Usando perfil estático local.')
    return defaultProfile
  }

  const opts: FetchOptions = { strapiUrl, strapiToken }

  try {
    // 1. Intento primario: Single Type 'Profile' (según la especificación de INTEGRACION_CMS_STRAPI.md)
    const profileRes = await fetchFromStrapi('/api/profile?populate=*', opts)
    if (profileRes.ok) {
      const json = await profileRes.json()
      const data = json.data?.attributes ?? json.data
      if (data && typeof data === 'object') {
        return parseSingleProfileData(data, strapiUrl)
      }
    }

    // 2. Intento secundario: Modelo en español (Configuración global + Perfil del proyecto PortafolioE)
    const [configRes, perfilRes] = await Promise.all([
      fetchFromStrapi('/api/configuracion-global?populate=*', opts),
      fetchFromStrapi('/api/perfil?populate=*', opts),
    ])

    if (!configRes.ok && !perfilRes.ok) {
      throw new Error(
        `[load-profile] Error al consultar los endpoints de Strapi en ${strapiUrl}. ` +
          `Configuración global: ${configRes.status} ${configRes.statusText}, ` +
          `Perfil: ${perfilRes.status} ${perfilRes.statusText}`
      )
    }

    const configJson = configRes.ok ? await configRes.json() : null
    const perfilJson = perfilRes.ok ? await perfilRes.json() : null

    const configData = configJson?.data?.attributes ?? configJson?.data ?? {}
    const perfilData = perfilJson?.data?.attributes ?? perfilJson?.data ?? {}

    return parsePortafolioData(configData, perfilData, strapiUrl)
  } catch (error) {
    console.error(`[load-profile] Fallo al cargar datos desde Strapi (${strapiUrl}):`, error)
    throw error
  }
}

function parseSingleProfileData(data: Record<string, any>, strapiUrl: string): Profile {
  const photo = resolveMediaUrl(data.photo, strapiUrl) || defaultProfile.photo
  const rawLinks = Array.isArray(data.links) ? data.links : []

  const links: ProfileLink[] = rawLinks.map((item: any) => {
    const icon = normalizeIcon(item.icon ?? item.red)
    const defaults = DEFAULT_METAS[icon]
    const url = sanitizeUrl(item.url)
    const title = (item.title ?? item.titulo ?? item.etiqueta ?? defaults.title).trim()
    const description = (item.description ?? item.descripcion ?? defaults.description).trim()
    const tag = (item.tag ?? item.etiqueta_tag ?? defaults.tag ?? '').trim()

    return {
      title,
      description,
      url,
      icon,
      ...(tag ? { tag } : {}),
    }
  })

  const rawCv = data.curriculum_pdf ?? data.curriculum ?? data.resume
  const cvUrl = resolveMediaUrl(rawCv, strapiUrl)
  if (cvUrl && !links.some(l => l.icon === 'cv' || l.url === cvUrl)) {
    links.unshift({
      title: 'Currículum Vitae',
      description: 'Experiencia, habilidades y trayectoria profesional',
      url: cvUrl,
      icon: 'cv',
      tag: 'CV',
    })
  }

  return {
    name: (data.nombre_personal ?? data.name ?? data.nombre ?? defaultProfile.name).trim(),
    handle: (data.handle ?? defaultProfile.handle).trim(),
    photo,
    role: (data.role ?? data.subtitulo_hero ?? defaultProfile.role).trim(),
    bio: (extractBlocksText(data.bio ?? data.biografia_acerca_de) || defaultProfile.bio).trim(),
    location: (data.location ?? data.ubicacion ?? defaultProfile.location).trim(),
    available: (
      typeof data.available === 'boolean'
        ? data.available
          ? 'Disponible para nuevas ideas'
          : 'No disponible actualmente'
        : data.available ?? defaultProfile.available
    ).trim(),
    headline: (data.headline ?? data.titular_hero ?? defaultProfile.headline).trim(),
    whatsapp: (data.whatsapp ?? defaultProfile.whatsapp).trim(),
    whatsappMessage: (data.whatsappMessage ?? defaultProfile.whatsappMessage).trim(),
    email: (data.email ?? data.correo ?? defaultProfile.email).trim(),
    resume: cvUrl || defaultProfile.resume,
    links: links.length > 0 ? links : defaultProfile.links,
  }
}

function parsePortafolioData(
  config: Record<string, any>,
  perfil: Record<string, any>,
  strapiUrl: string
): Profile {
  const photo =
    resolveMediaUrl(perfil.avatar_foto ?? perfil.photo, strapiUrl) || defaultProfile.photo

  const rawRedes = Array.isArray(config.redes_sociales) ? config.redes_sociales : []

  let foundEmail = sanitizeUrl(config.correo_contacto ?? '').replace(/^mailto:/i, '')
  let foundWhatsapp = extractWhatsappNumber(perfil.whatsapp ?? config.whatsapp ?? '')
  let detectedHandle = ''

  const links: ProfileLink[] = rawRedes
    .map((item: any) => {
      const rawRed = String(item.red ?? item.icon ?? '').toLowerCase().trim()
      const url = sanitizeUrl(item.url)
      const isWhatsapp =
        rawRed === 'numero' ||
        rawRed === 'whatsapp' ||
        rawRed === 'wasap' ||
        rawRed === 'wsp' ||
        rawRed === 'telefono' ||
        /wa\.me|whatsapp/i.test(url)

      if (isWhatsapp && url) {
        const extracted = extractWhatsappNumber(url)
        if (extracted && !foundWhatsapp) {
          foundWhatsapp = extracted
        }
      }

      const icon = isWhatsapp ? 'whatsapp' : normalizeIcon(item.red ?? item.icon)
      const defaults = DEFAULT_METAS[icon]
      const title = (item.etiqueta ?? item.title ?? item.titulo ?? defaults.title).trim()
      const description = (item.description ?? item.descripcion ?? defaults.description).trim()
      const tag = (item.tag ?? item.etiqueta_tag ?? defaults.tag ?? '').trim()

      if (icon === 'mail' && url) {
        const cleanEmail = url.replace(/^mailto:/i, '')
        if (!foundEmail && cleanEmail) foundEmail = cleanEmail
      }

      const candidate = extractHandleFromUrl(url)
      if (candidate) {
        if (!detectedHandle || url.includes('instagram.com')) {
          detectedHandle = candidate
        }
      }

      return {
        title,
        description,
        url,
        icon,
        ...(tag ? { tag } : {}),
      }
    })
    .filter(link => Boolean(link.url) && link.icon !== 'whatsapp')

  // Bloques de biografía en Strapi 5
  const bio =
    extractBlocksText(perfil.biografia_acerca_de ?? perfil.bio) ||
    config.descripcion_sitio ||
    defaultProfile.bio

  // Disponibilidad
  let available = defaultProfile.available
  if (typeof config.disponible_para_trabajar === 'boolean') {
    available = config.disponible_para_trabajar
      ? 'Disponible para nuevos proyectos'
      : 'No disponible actualmente'
  } else if (perfil.available) {
    available = perfil.available
  }

  // Nombre y Rol
  const name = (
    config.nombre_personal ??
    perfil.nombre_personal ??
    perfil.nombre ??
    perfil.name ??
    config.nombre ??
    config.nombre_sitio ??
    defaultProfile.name
  ).trim()
  const role = (perfil.subtitulo_hero ?? perfil.role ?? defaultProfile.role).trim()
  const headline = (perfil.titular_hero ?? perfil.headline ?? defaultProfile.headline).trim()
  const location = (perfil.ubicacion ?? perfil.location ?? defaultProfile.location).trim()
  const handle = (perfil.handle ?? detectedHandle ?? defaultProfile.handle).trim()

  const rawCv =
    config.curriculum_pdf ??
    perfil.curriculum_pdf ??
    config.cv_pdf ??
    perfil.cv_pdf ??
    config.curriculum ??
    perfil.curriculum
  const cvUrl = resolveMediaUrl(rawCv, strapiUrl)

  if (cvUrl && !links.some(l => l.icon === 'cv' || l.url === cvUrl)) {
    links.unshift({
      title: 'Currículum Vitae',
      description: 'Experiencia, habilidades y trayectoria profesional',
      url: cvUrl,
      icon: 'cv',
      tag: 'CV',
    })
  }

  return {
    name,
    handle,
    photo,
    role,
    bio,
    location,
    available,
    headline,
    whatsapp: (foundWhatsapp || defaultProfile.whatsapp).trim(),
    whatsappMessage: (
      perfil.whatsappMessage ??
      config.whatsappMessage ??
      defaultProfile.whatsappMessage
    ).trim(),
    email: foundEmail || defaultProfile.email,
    resume: cvUrl || defaultProfile.resume,
    links: links.length > 0 ? links : defaultProfile.links,
  }
}
