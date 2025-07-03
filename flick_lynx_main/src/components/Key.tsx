import {useRef, useState} from "@lynx-js/react";
import type {BaseTouchEvent, EventHandler, NodesRef, Target} from "@lynx-js/types";
import hintMap from "../configs/hintMap.ts";
import {capitalize} from "lodash";

const convertMap = Object.entries(hintMap).reduce((reduce, values) => {
  const [after, before] = values
  if (!reduce[before]) {
    reduce[before] = []
  }
  reduce[before].push(after)
  return reduce
}, {} as {[key:string]: string[]})

type DirectionKeys = 'left' | 'right' | 'up' | 'down';

type Key = {
  center: string;
  isCommand: boolean
  isConvertKey?: boolean;
} & {
  [key in DirectionKeys]?: string;
}


export function Key({
                      setActiveCharSet,
                      setStartPosition,
                      charSet,
                      startPosition,
                      isActive,
                      onKeyConfirm,
  nextKey,
  prevChar
                    }: {
  setActiveCharSet: (charSet: Key) => void,
  setStartPosition: (position: { x: number, y: number }) => void,
  charSet: Key,
  startPosition: { x: number, y: number },
  isActive: boolean,
  onKeyConfirm: (key: Key, text: string) => void,
  nextKey: string,
  prevChar: string
}) {
  const elRef = useRef<NodesRef | null>(null)
  const [currentChar, setCurrentChar] = useState("")

  function isNextKey() {
    // nextKey=ょ prev=よのときはconvertkeyを光らせる
    const hint = hintMap[nextKey as keyof typeof hintMap]
    if (hint && hint === prevChar) {
      return charSet.isConvertKey
    }
    const chars = Object.values(charSet)
    return !!(chars.includes(nextKey) || (hint && chars.includes(hint)));

  }
  function touchStart(e: BaseTouchEvent<Target>) {
    setActiveCharSet(charSet)
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY
    console.log('setstartposition', {x, y}, e)
    setStartPosition({x, y})
    setCurrentChar(charSet.center)
  }

  function touchMove(e: BaseTouchEvent<Target>) {
    const endX = e.touches[0].clientX
    const endY = e.touches[0].clientY
    const direction = calculateDirection(startPosition.x, startPosition.y, endX, endY)
    console.log('dir', direction)
    console.log('current', currentChar, charSet[direction])

    elRef.current?.invoke(
      {
        // Specify the operation for the target node
        method: 'boundingClientRect',
        success: function (res) {
          if (!res) {
            return
          }
          const {left, right, top, bottom} = res;
          const isWithinBounds = endX >= left && endX <= right && endY >= top && endY <= bottom;
          setCurrentChar(isWithinBounds ? charSet.center : charSet[direction] ?? '')
        },
        fail: function (res) {
          console.log(res.code, res.data);
        },
      }
    ).exec()
  }

  function touchEnd(e: BaseTouchEvent<Target>) {
    const value = currentChar
    let emitValue
    if (charSet.isConvertKey) {
      if (value.includes("゛") && convertMap[prevChar]) {
        emitValue = convertMap[prevChar][0]
      } else if(convertMap[prevChar] && convertMap[prevChar][1]) {
        emitValue = convertMap[prevChar][1]
      }
    } else {
      emitValue = value
    }

    if (emitValue) {
      onKeyConfirm(charSet, emitValue)
    }
  }

  function directionKeyClass(direction: DirectionKeys) {
    return [`Flick${capitalize(direction)}`, currentChar === charSet[direction] ? 'active': 'inactive'].join(' ')
  }

  return (
    <view
      className={`KeyboardKey ${isActive ? 'ActiveKey' : ''} ${isNextKey() ? 'NextKey' : ''}`}
      ref={elRef}
      bindtouchstart={touchStart}
      bindtouchmove={touchMove}
      bindtouchend={touchEnd}
    >
      <text className='MainChar'>{charSet.center}</text>
      {isActive && (
        <>
          {
            (['up', 'right', 'down', 'left'] as DirectionKeys[]).map((direction) =>
              charSet[direction] ? <text className={directionKeyClass(direction)}>{charSet[direction]}</text> : null)
          }
        </>
      )}
    </view>
  )
}


// 判定ロジック：移動距離が大きい方を優先
function calculateDirection(startX: number, startY: number, endX: number, endY: number): DirectionKeys {
  const deltaX = endX - startX
  const deltaY = endY - startY

  // 絶対値で比較
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)

  if (absDeltaX > absDeltaY) {
    return deltaX > 0 ? "right" : "left"; // X方向
  } else {
    return deltaY > 0 ? "down" : "up"; // Y方向
  }
}
