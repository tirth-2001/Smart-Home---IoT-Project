import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
  Platform,
} from 'react-native';

import Voice from '@react-native-community/voice';

import {NativeEventEmitter} from 'react-native';
import Shortcuts from 'react-native-actions-shortcuts';

import Icon from 'react-native-vector-icons/Ionicons';

// import * as googleTTS from 'google-tts-api';

import Tts from 'react-native-tts';

export default function TextToSpeech() {
  const [started, setStarted] = useState('');
  const [end, setEnd] = useState('');

  // initialize pitch state
  const [pitch, setPitch] = useState('');

  // initialize error state
  const [error, setError] = useState('');

  // initialize results state
  const [results, setResults] = useState([]);

  // initialize partialResults state
  const [partialResults, setPartialResults] = useState([]);

  useEffect(async () => {
    function onSpeechStart(e) {
      console.log('onSpeechStart: ', e);
      setStarted('√');
    }
    function onSpeechResults(e) {
      console.log('onSpeechResults: ', e);
      setResults(e.value);
      speakAudio(e.value[0]);
    }
    function onSpeechPartialResults(e) {
      console.log('onSpeechPartialResults: ', e);
      setPartialResults(e.value);
    }
    function onSpeechVolumeChanged(e) {
      // console.log('onSpeechVolumeChanged: ', e);
      setPitch(e.value);
    }

    function onSpeechError(e) {
      console.log('onSpeechError: ', e);
      setError(e.error.message);
    }
    function onSpeechEnd(e) {
      console.log('onSpeechEnd: ', e);
      setEnd('√');
    }

    // you can also `await` to get the current dynamic shortcuts / actions
    // const shortcutItems = await Shortcuts.setShortcuts([shortcutItem]);

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(async () => {
    const allShortcuts = [
      {
        type: 'iot.voice.bulb',
        title: 'Open Light Settings',
        shortTitle: 'On/Off',
        subtitle: 'Smart Light',
        iconName: 'iot_bulb',

        // iconName: 'iot_bulb',
        data: {
          page: 'bulb',
        },
      },
      {
        type: 'iot.voice.fan',
        title: 'Fan On/Off',
        shortTitle: 'On/Off',
        subtitle: 'Smart Fan',
        iconName: 'iot_fan',

        data: {
          page: 'fan',
        },
      },
    ];

    console.log(allShortcuts[0]);

    const shortcutItem = {
      type: 'my.awesome.action',
      title: 'Do awesome things',
      shortTitle: 'Do it',
      subtitle: 'iOS only',
      iconName:
        'https://firebasestorage.googleapis.com/v0/b/smart-home-9497d.appspot.com/o/Other%20Images%2Fidea.png?alt=media&token=0736bf23-a82c-403d-8c72-7e3f13466d5e',
      data: {
        foo: 'bar',
      },
    };

    // Shortcuts.setShortcuts([shortcutItem]);
    Shortcuts.setShortcuts(allShortcuts);

    const selectedShortcutItem = await Shortcuts.getInitialShortcut();
    if (selectedShortcutItem) {
      console.log('shortcutItem: ', selectedShortcutItem);
      speakAudio(shortcutItem.value);
    }

    const ShortcutsEmitter = new NativeEventEmitter(Shortcuts);

    // 2. add the listener in a `useEffect` hook or `componentDidMount`
    ShortcutsEmitter.addListener('onShortcutItemPressed', handleShortcut);
    return () => {
      ShortcutsEmitter.removeAllListeners(
        'onShortcutItemPressed',
        handleShortcut,
      );
      // 3. remove the listener in a `useEffect` hook or `componentWillUnmount`
    };
  }, []);

  _startRecognizing = async () => {
    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };
  _stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
    setError(e.error.message);
  };
  _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');
  };

  const speakAudio = text => {
    Tts.getInitStatus().then(() => {
      Tts.speak(text);
    });
  };

  // 1. define the listener
  function handleShortcut(item) {
    const {type, data} = item;
    console.log('Handle Logic', item);
    // your handling logic
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text style={styles.welcome}>Speech Recognition</Text>
        <Text style={styles.instructions}>Press mike to start Recognition</Text>

        {/* <View
          style={{
            flexDirection: 'row'
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#B0171F',
            }}>{`Started: ${started}`}</Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#B0171F',
            }}>{`End: ${end}`}</Text>
        </View>
         */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#B0171F',
            }}>{`Pitch \n ${pitch}`}</Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#B0171F',
            }}>{`Error \n ${error}`}</Text>
        </View> */}

        <TouchableHighlight
          onPress={_startRecognizing}
          style={{marginVertical: 80}}>
          <Icon name="mic" color="#2e3e7e" size={90} opacity={1} />
          {/* <Image
            style={styles.button}
            source={{
              uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png',
            }}
          /> */}
        </TouchableHighlight>
        <Text
          style={{
            textAlign: 'center',
            color: '#2e3e7e',
            marginBottom: 1,
            fontWeight: '700',
          }}>
          Partial Results
        </Text>
        <ScrollView>
          {partialResults.map((result, index) => {
            return (
              <Text
                key={`partial-result-${index}`}
                style={{
                  textAlign: 'center',
                  color: '#2e3e7e',
                  marginBottom: 1,
                  fontWeight: '700',
                }}>
                {result}
              </Text>
            );
          })}
        </ScrollView>
        <Text style={styles.stat}>Results</Text>
        {/* <ScrollView style={{marginBottom: 42}}>
          {results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })}
        </ScrollView> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'space-between',
            position: 'absolute',
            bottom: 0,
          }}>
          <TouchableHighlight
            onPress={() => speakAudio('Turning on lights!')}
            style={{flex: 1, backgroundColor: '#2e3e7e'}}>
            <Text style={styles.action}>Turn On 💡</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => speakAudio('Lights turned off!')}
            style={{flex: 1, backgroundColor: 'grey'}}>
            <Text style={styles.action}>Turn Off </Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  mic: {
    marginVertical: 70,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#2e3e7e',
    marginBottom: 1,
    marginTop: 30,
  },
});
