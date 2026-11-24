export const messages = {
  home: {
    title: 'Invitaciones digitales',
    body: 'Si te mandaron una invitación, abrí el link completo que te compartieron.',
  },
  loading: 'Cargando la invitación…',
  notFound: {
    title: 'No encontramos esta invitación',
    body: 'Revisá que el link esté completo.',
  },
  unavailable: {
    title: 'Esta invitación ya no está disponible',
    body: 'Gracias por haber sido parte.',
  },
  error: {
    title: 'No pudimos cargar la invitación',
    body: 'Puede ser un problema de conexión. Probá de nuevo en unos segundos.',
    retry: 'Reintentar',
  },
  babyShower: {
    cover: {
      title: '¡Tenés una invitación!',
      hint: 'Tocá el sobre para abrirla',
      open: 'Abrir la invitación',
    },
    presentation: {
      kicker: 'Estás invitado/a a mi',
      title: 'Baby Shower',
      hostsLead: 'Con amor,',
    },
    countdown: {
      title: 'Falta muy poco',
      arrived: '¡Llegó el día!',
      days: 'días',
      hours: 'horas',
      minutes: 'minutos',
      seconds: 'segundos',
    },
    date: { title: 'Fecha y hora' },
    location: { title: 'Ubicación', button: 'Cómo llegar' },
    gifts: { title: 'Regalos' },
    rsvp: {
      title: 'Confirmar asistencia',
      nameLabel: 'Nombre y apellido',
      hint: 'Cada persona responde desde su celular: escribí solo tu nombre.',
      attend: 'Sí, asistiré',
      notAttend: 'No podré ir',
      sending: 'Guardando tu respuesta…',
      thanksAttending: (name: string) => `¡Gracias, ${name}! Tu asistencia está confirmada.`,
      thanksNotAttending: (name: string) => `¡Gracias por avisarnos, ${name}! Te vamos a extrañar.`,
      nameProblems: {
        empty:
          '¿Podrías poner tu nombre, por favor? Solo para no insistirte con la confirmación :D',
        too_short: 'Escribí tu nombre completo, con al menos 2 letras.',
        too_long: 'El nombre puede tener hasta 60 caracteres.',
      },
      networkError: 'No pudimos guardar tu respuesta. Probá de nuevo en unos segundos.',
      closed: 'Las confirmaciones ya están cerradas.',
    },
    comingSoon: 'Muy pronto',
    placeholderArt: 'Ilustración provisoria',
  },
};
