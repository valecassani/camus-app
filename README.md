# CAMUS Mobile app
Mobile application of the CAMUS (Context Aware Mobile mashUpS) project by DEIB of Politechnic University of Milan

## Installation requirements
- XCode (iOS app)
- Android SDK and NDK (https://facebook.github.io/react-native/docs/android-setup.html)
- For Windows and Linux users see https://facebook.github.io/react-native/docs/linux-windows-support.html

## Installing and running
    npm install -g react-native-cli
    npm install

### iOS
- Open the ios folder in the app root, then open the file camusApp.xcodeproj
- Press the play button

### Android
- Navigate to android/app/src/main/res/values/ and open the file google-maps-api.xml
- Insert the Google Maps API key, if you don't have one follow this guide https://developers.google.com/maps/signup
- In the terminal type:

        react-native run-android

### Editing endpoint
- Replace the endpoint in the config.js file
