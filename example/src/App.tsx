import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { delayTime, MrPullRefresh } from 'react-native-mr-pullrefresh';

export default function App() {
  const [data, setData] = React.useState<number[]>([]);

  const downLoader = async () => {
    await delayTime(5000);
    setData(Array(400).fill(0));
  };

  const upLoader = async () => {
    await delayTime(5000);
    setData(Array(300).fill(0));
  };
  // React.useEffect(() => {
  //   loader();
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MrPullRefresh
            onPulldownRefresh={downLoader}
            onPullupRefresh={upLoader}
            style={{ width: '100%' }}
            scrollProps={{
              bounces: false,
              style: { flex: 1, backgroundColor: 'yellow', width: '100%' },
            }}
          >
            {data.map((_, index) => (
              <Text key={index}>Result: {index} </Text>
            ))}
          </MrPullRefresh>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#ff8080',
    overflow: 'hidden',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
