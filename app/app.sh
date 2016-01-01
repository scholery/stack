jarsigner -verbose -keystore demo.keystore -signedjar stack.apk ../platforms/android/build/android-release-unsigned.apk stack

keytool -genkey -alias mykey -keyalg RSA -validity 40000 -keystore demo.keystore