export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export function getPurlParams (songmid) {
  return {
    comm: {
      'g_tk': 5381,
      'inCharset': 'utf-8',
      'outCharset': 'utf-8',
      'notice': 0,
      'format': 'json',
      'platform': 'h5',
      'needNewCode': 1,
      'uin': 0
    },
    'url_mid': {
      'module': 'vkey.GetVkeyServer',
      'method': 'CgiGetVkey',
      'param': {
        'guid': '1647338026',
        'songmid': songmid,
        // 'songmid': ['001LqZUG426bf5', '0049C3wC0AveAU', '001ffMIV0Pl3Q9', '0026omXJ32kFy3', '002d2pdr00Z0RI', '001pX1t02wmleo', '000gvpIK4L6GCQ', '004LLLTw2hcUeE', '0018ZGwR2P7W2J', '001MRX1v0OLzTI', '002aeZo50FBt0i', '000540hD0WGNIy', '003CjRvE0ASwPk', '0044DBoi0OCTWj', '003itHXb3dxeaF', '002PNoz60KtdRd', '0026OlSr1Elmmw', '004MEYj21mncvb', '000Y4Ov91HqkGV', '000H93JP2sw1C5'],
        'songtype': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'uin': '0',
        'loginflag': 0,
        'platform': '23'
      }
    }
  }
}

const isDev = process.env.NODE_ENV === 'development'

export const prefix = isDev ? 'http://120.79.57.19:3335' : 'http://120.79.57.19:3335'

export const domain = '/api' // ngnix用这个
