// Redux
import { dispatch } from 'store';
import { updateCurrentCharacter } from "redux/characters/reducer";

export function onKeyDown(event: any){
  const { key, target }: { key: string, target: HTMLElement } = event;
  if (['Enter', 'Esc', 'Escape'].includes(key)) {
    target.blur()
  }
}

export function update(path: string, value: any){
  dispatch(
    updateCurrentCharacter({ path, value })
  )
}

export function changeListener(path: string, is_integer=false) {
  return function (event: any) {
    let value: string | number = event.target.value;
    if (is_integer && typeof value === 'string') {
      value = parseInt(value)
    }
    dispatch(
      updateCurrentCharacter({ path, value })
    )
  }
}
