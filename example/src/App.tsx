import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { delayTime, MrPullRefresh } from 'react-native-mr-pullrefresh';
import Animated from 'react-native-reanimated';

export default function App() {
  const [data, setData] = React.useState<number[]>([]);

  const pulldownLoader = async () => {
    await delayTime(5000);
    setData(Array(200).fill(0));
  };

  const pullupLoader = async () => {
    await delayTime(5000);
    setData(Array(300).fill(1));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MrPullRefresh
            onPulldownRefresh={pulldownLoader}
            onPullupRefresh={pullupLoader}
          >
            {/* <Animated.FlatList
              data={[]}
              renderItem={() => null}
              style={{ flex: 1, backgroundColor: 'yellow' }}
            /> */}

            <Animated.ScrollView style={{ flex: 1, backgroundColor: 'yellow' }}>
              {data.map((flag, index) => (
                <View style={styles.text} key={index}>
                  <Text>
                    Result {flag ? 'Down' : 'Up'}: {index}{' '}
                  </Text>
                </View>
              ))}
            </Animated.ScrollView>
          </MrPullRefresh>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  text: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
});
