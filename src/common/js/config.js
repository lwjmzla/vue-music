export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

const isDev = process.env.NODE_ENV === 'development'

export const domain = isDev ? '/api' : '/showPages/api' // build不能用直接反向代理。还要设置IIS之类的
