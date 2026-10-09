// PERSONALIZA TU PÁGINA AQUÍ. Guarda y verás los cambios automáticamente.
// Los enlaces vacíos muestran un aviso: nunca envían a cuentas de otra persona.
export type LinkIcon =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'portfolio'
  | 'facebook'
  | 'linkedin'
  | 'github'
  | 'twitter_x'
  | 'whatsapp'
  | 'cv'
  | 'mail'
  | 'other'
export type ProfileLink = { title: string; description: string; url: string; icon: LinkIcon; tag?: string }

export const profile = {
  name: 'Tu nombre',
  handle: '@tu.usuario',
  // Opcional: coloca tu foto en public/foto.jpg y escribe './foto.jpg'.
  photo: '',
  role: 'Quién soy y qué hago',
  bio: 'Cuéntales un poco de ti: a qué te dedicas, qué te apasiona y cómo puedes ayudar. Este es tu espacio para conectar.',
  location: 'Lima, Perú',
  available: 'Disponible para nuevas ideas',
  headline: 'Todo empieza con una conexión.',
  // Código de país + número, solo dígitos. Ejemplo de formato Perú: 51 + 9 dígitos.
  whatsapp: '',
  whatsappMessage: '¡Hola! Vi tu página y me gustaría saber más sobre tu trabajo.',
  email: '',
  resume: '',
  links: [
    { title: 'Instagram', description: 'Mi día a día, en imágenes', url: '', icon: 'instagram', tag: 'SÍGUEME' },
    { title: 'Mi portafolio', description: 'Ideas que se convirtieron en proyectos', url: '', icon: 'portfolio', tag: 'EXPLORA' },
    { title: 'GitHub', description: 'Mi código, proyectos y experimentos', url: '', icon: 'github', tag: 'CÓDIGO' },
    { title: 'TikTok', description: 'El proceso también es parte de la historia', url: '', icon: 'tiktok' },
    { title: 'YouTube', description: 'Un espacio para crear y compartir', url: '', icon: 'youtube' },
  ] satisfies ProfileLink[],
}

export type Profile = Omit<typeof profile, 'links'> & { links: ProfileLink[] }
