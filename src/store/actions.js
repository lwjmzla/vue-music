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

export function insertSong ({commit, state}, song) {
  let playlist = state.playlist.slice() // playlist = state.playlist 如果这种  有点 指针指向的意味  改了playlist,state里也改
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // const currentSong = playlist[currentIndex]
  // 查找当前列表是否有想插入的歌
  let findSameSongIndex = playlist.findIndex((item) => {
    return item.id === song.id
  })
  if (findSameSongIndex > -1) { // 列表找到相同歌曲
    commit(types.SET_CURRENT_INDEX, findSameSongIndex) // 直接播放，顺序不掉转，跟黄老师方式不同
  } else {
    playlist.splice(currentIndex + 1, 0, song)
    sequenceList.splice(currentIndex + 1, 0, song)
    currentIndex++
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
