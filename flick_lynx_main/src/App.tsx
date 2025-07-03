import './App.css'
import {useState} from "@lynx-js/react";
import {Key as KeyComponent} from "./components/Key.tsx";
import type {Key} from "./configs/keyboard.ts";
import {keyboard} from "./configs/keyboard.ts";
import {getSentences} from "./configs/sentences.js";


export function App() {

  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const [activeCharSet, setActiveCharSet] = useState<Key | null>(null);

  function onKeyConfirm(key: Key, text: string) {
    console.warn("confirm!", key, text)
    setActiveCharSet(null)

    setPrevChar(text)

    if (text === currentSentence[0]) {
      hit()
    }
  }

  const [prevChar, setPrevChar] = useState("")

  const [sentences, setSentences] = useState(getSentences())

  const [currentSentence, setCurrentSentence] = useState(sentences[0].hiragana)

  function hit() {
    const nextHiragana = currentSentence.slice(1)
    setCurrentSentence(nextHiragana)
    if (nextHiragana.length === 0) {
      const next = sentences.slice(1)
      setSentences(next)
      setCurrentSentence(next[0].hiragana)
    }
  }


  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <text className='Title'>flick test</text>
        </view>

        <view className='Content'>
          <view className='TargetChar'>
            <text className='CharDisplay'>{sentences[0].text}</text>
            <text className='CharDisplay'>{currentSentence}</text>
          </view>

          <view className='MobileKeyboard'>
            {keyboard.map(keys => {
              return (
                <view className='KeyboardRow'>
                  {keys.map(key => KeyComponent({
                    setStartPosition,
                    setActiveCharSet,
                    charSet: key,
                    startPosition,
                    isActive: key.center === activeCharSet?.center,
                    onKeyConfirm,
                    nextKey: currentSentence[0],
                    prevChar: prevChar
                  }))}
                </view>
              )
            })}
          </view>
        </view>
      </view>
    </view>
  )
}

