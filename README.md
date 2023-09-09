# react-native-mr-pullrefresh

![NPM](https://badgen.net/npm/v/react-native-mr-pullrefresh)
![NPM](https://badgen.net/npm/dw/react-native-mr-pullrefresh)
![MIT](https://badgen.net/static/license/MIT/red)
![INSTALLED](https://badgen.net/packagephobia/install/react-native-mr-pullrefresh)
![NODE](https://badgen.net/npm/node/react-native-mr-pullrefresh?color=purple)
![STARS](https://badgen.net/github/stars/little-buddy/react-native-mr-pullrefresh?color=gray)


```

  /\/\  _ __        / _ \_   _| | | /__\ ___ / _|_ __ ___  ___| |__
 /    \| '__|      / /_)/ | | | | |/ \/// _ \ |_| '__/ _ \/ __| '_ \
/ /\/\ \ |     _  / ___/| |_| | | / _  \  __/  _| | |  __/\__ \ | | |
\/    \/_|    (_) \/     \__,_|_|_\/ \_/\___|_| |_|  \___||___/_| |_|

```

react-native pull refresh on iOS, Android and Web

## 💪🏻 Support
| Platform |             |
| -------- | ----------- |
| iOS      | ✅           |
| Android  | ✅ |
| Web      | Soon...     |

| Library |             |
| -------- | ----------- |
| react-native-gesture-handler      | 2.x           |
| react-native-reanimated  | 3.x |

#### ⚠️ Warning
`react-native-mr-pullrefresh` Only support wrapper `Animated.ScrollView` and `Animated.FlatList`

not support nested MrPullRefresh!

## Installation

It relies on `react-native-gesture-handler` and `react-native-reanimated`

so please install them before you use this package

```sh
yarn install react-native-gesture-hanlder react-native-reanimated
```

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

## Example
| <img src="./gifs/ios.gif" alt="ios-example" width="240"> |     <img src="./gifs/android.gif" alt="ios-example" width="250">         |
| :--------: | :-----------: |
| iOS     |   Android        |


## Props
| props             | type      | description                                                  | Default  |
| ----------------- | --------- | ------------------------------------------------------------ | -------- |
| pulldownHeight    | Number    | The height of the drop-down load component is defined, and the judgment of the drop-down state depends on this value | 140      |
| pullupHeight      | Number    | The height of the pull-up component is defined, and the pull-up state is determined by this value | 100      |
| containerFactor   | Number    | The container factor is used to adjust the height of the refresh judgment | 0.5      |
| pullingFactor     | Number    | Determine the coefficient of pulling state length            | 2.2        |
| enablePullup      | Boolean   | whether show pullingupLoading                                | false    |
| pulldownLoading   | Component | You can custom the Component                                 |          |
| pullupLoading     | Component | You can custom the Component                                 |          |
|                   |           |                                                              |          |
| onPulldownRefresh | Function  | callback of pulling down refresh, load data with it          | ()=>void |
| onPullupRefresh   | Function  | callback of pulling up refresh, load data with it            | ()=>void |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
