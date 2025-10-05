# Android App Configuration for Back Button Handling

## For Cordova/PhoneGap Apps

Add to your `config.xml`:

```xml
<preference name="BackupWebStorage" value="none" />
<preference name="BackButtonHandled" value="true" />
```

## For Capacitor Apps

Add to your `capacitor.config.json`:

```json
{
  "appId": "com.yourcompany.schoolapp",
  "appName": "School Management",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "App": {
      "backButtonHandled": true
    }
  }
}
```

## For React Native WebView

Add this code to your React Native app:

```javascript
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const webViewRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      // Send back button event to WebView
      webViewRef.current?.postMessage('ANDROID_BACK_PRESSED');
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'your-web-app-url' }}
      onMessage={(event) => {
        // Handle messages from WebView
      }}
    />
  );
};
```

## Testing Back Button Functionality

1. **In Browser**: Test using browser back button and Developer Tools device emulation
2. **In Android Emulator**: Test using the virtual back button
3. **On Physical Device**: Test using the hardware back button

## Important Notes

- The navigation system now properly handles Android back button presses
- History is managed automatically across different app environments
- Fallback navigation ensures the app never gets stuck
- The system detects the environment and uses appropriate back button handling

## Debugging

If back button doesn't work:

1. Check browser console for errors
2. Verify that the NavigationProvider is wrapping your app
3. Ensure the useAndroidBackButton hook is being called
4. Test in different environments (browser, Android app, etc.)

## Environment Detection

The system automatically detects:
- Cordova/PhoneGap environment
- Capacitor environment  
- React Native WebView
- Regular browser environment

Each environment uses the appropriate back button handling method.