# react-native-mr-refresh

react-native pull refresh on iOS, Android and Web

<!-- ## Installation

```sh
npm install react-native-mr-pullrefresh
``` -->

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

## Note
`react-native-mr-pullrefresh` Only support wrapper `Animated.ScrollView` and `Animated.FlatList`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
