export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

const isDev = process.env.NODE_ENV === 'development'

export const domain = isDev ? '/api' : '/showPages/api'
