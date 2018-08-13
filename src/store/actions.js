import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

export function selectPlay ({commit, state}, {list, index}) {
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    let newIndex = randomList.findIndex((item) => {
      return item.id === list[index].id
    })
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, newIndex)
  } else {
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export function randomtPlay ({commit, state}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAY_MODE, playMode.random)
}
