# react-native-mr-pullrefresh

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
