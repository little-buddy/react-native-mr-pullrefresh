# react-native-mr-pullrefresh

![NPM](https://badgen.net/npm/v/react-native-mr-pullrefresh)
![NPM](https://badgen.net/npm/dw/react-native-mr-pullrefresh)
![MIT](https://badgen.net/static/license/MIT/red)
![INSTALLED](https://badgen.net/packagephobia/install/react-native-mr-pullrefresh)
![NODE](https://badgen.net/npm/node/react-native-mr-pullrefresh?color=purple)
![STARS](https://badgen.net/github/stars/little-buddy/react-native-mr-pullrefresh?color=gray)

![BITCON](https://badgen.net/https/napkin-examples.npkn.net/bitcoin-badge)

react-native pull refresh on iOS, Android and Web

```

  /\/\  _ __        / _ \_   _| | | /__\ ___ / _|_ __ ___  ___| |__
 /    \| '__|      / /_)/ | | | | |/ \/// _ \ |_| '__/ _ \/ __| '_ \
/ /\/\ \ |     _  / ___/| |_| | | / _  \  __/  _| | |  __/\__ \ | | |
\/    \/_|    (_) \/     \__,_|_|_\/ \_/\___|_| |_|  \___||___/_| |_|

```

## ⚠️ Warning
`react-native-mr-pullrefresh` Only support wrapper `Animated.ScrollView` and `Animated.FlatList`

not support nested MrPullRefresh!

## 💪🏻 Support
| Platform |             |
| -------- | ----------- |
| iOS      | ✅           |
| Android  | ✅ |
| Web      | Soon...     |


## Installation

```sh
yarn install react-native-mr-pullrefresh
```

## Usage

```js
import { MrPullRefresh } from 'react-native-mr-pullrefresh';

// ...

 <MrPullRefresh
  onPulldownRefresh={downLoader}
  onPullupRefresh={upLoader}
  style={{ flex: 1 }}
>

  <Animated.FlatList
    data={[]}
    renderItem={() => null}
  />

 {/* or*/}

  <Animated.ScrollView>
    {/* children */}
  </Animated.ScrollView>
</MrPullRefresh>
```

## Example on iOS
<img src="./gifs/ddd.gif" alt="ios-example" width="240">

## Props
| props           | description |
| --------------- | ----------- |
| pulldownHeight  |             |
| pullupHeight    |             |
| enablePullup    |             |
| pulldownLoading | Component   |
| pullupLoading   | Component   |

| event             | description |
| ----------------- | ----------- |
| onPulldownRefresh |             |
| onPullupRefresh   |             |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
