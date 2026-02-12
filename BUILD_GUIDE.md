# SoundWave 모바일 앱 빌드 가이드

## 개요

이 문서는 React Native CLI를 사용하여 SoundWave 모바일 앱을 빌드하고 배포하는 방법을 설명합니다.

---

## 1. 개발 환경 설정

### 1.1 필수 요구사항

#### Windows/Mac/Linux 공통
- Node.js 18+ 
- npm 또는 yarn
- Git

#### Android 개발
- Android Studio
- Android SDK (API 30 이상)
- Java Development Kit (JDK) 11+
- ANDROID_HOME 환경 변수 설정

#### iOS 개발 (Mac만 가능)
- Xcode 14+
- CocoaPods
- iOS 13+ 배포 대상

### 1.2 환경 변수 설정

#### Windows
```bash
# ANDROID_HOME 설정
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"

# 시스템 재부팅 필요
```

#### Mac/Linux
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools

# 적용
source ~/.bashrc  # 또는 source ~/.zshrc
```

### 1.3 프로젝트 설정

```bash
# 저장소 클론
git clone https://github.com/rhgiddpaws-eng/AudioStreamming-ReactNative.git
cd AudioStreamming-ReactNative

# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

---

## 2. 개발 환경에서 실행

### 2.1 Android 에뮬레이터에서 실행

```bash
# 1단계: Android Studio 실행
# AVD Manager에서 에뮬레이터 생성 및 실행

# 2단계: 개발 서버 시작
npm start

# 3단계: Android에서 실행
npm run android

# 또는 직접 빌드
npx react-native run-android
```

### 2.2 iOS 시뮬레이터에서 실행 (Mac만 가능)

```bash
# 1단계: 개발 서버 시작
npm start

# 2단계: iOS에서 실행
npm run ios

# 또는 직접 빌드
npx react-native run-ios

# 특정 시뮬레이터에서 실행
npx react-native run-ios --simulator="iPhone 14"
```

### 2.3 실제 기기에서 실행

#### Android
```bash
# 1단계: USB 디버깅 활성화
# 설정 > 개발자 옵션 > USB 디버깅 활성화

# 2단계: 기기 연결
adb devices

# 3단계: 앱 실행
npm run android
```

#### iOS (Mac)
```bash
# 1단계: 기기 연결 (USB)

# 2단계: Xcode에서 개발 팀 설정
# Xcode > Preferences > Accounts > Apple ID 추가

# 3단계: 앱 실행
npm run ios
```

---

## 3. 프로덕션 빌드

### 3.1 Android 릴리스 빌드

#### 서명 키 생성 (처음 한 번만)

```bash
cd android/app

# 서명 키 생성
keytool -genkey -v -keystore soundwave.keystore \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias soundwave

# 입력 정보
# 키 저장소 비밀번호: [비밀번호 입력]
# 키 비밀번호: [비밀번호 입력]
# 이름: SoundWave
# 조직 단위: Engineering
# 조직: SoundWave Inc
# 도시: Seoul
# 주: Seoul
# 국가 코드: KR
```

#### gradle.properties 설정

`android/gradle.properties` 파일 수정:

```properties
# 서명 설정
MYAPP_RELEASE_STORE_FILE=soundwave.keystore
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_ALIAS=soundwave
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

#### 릴리스 빌드 생성

```bash
cd android

# APK 빌드
./gradlew assembleRelease

# 또는 AAB (Android App Bundle) 빌드
./gradlew bundleRelease

# 빌드 완료 후 위치
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### 3.2 iOS 릴리스 빌드 (Mac만 가능)

#### 개발 팀 설정

```bash
# Xcode에서 프로젝트 열기
open ios/AudioStreamming.xcworkspace

# Xcode UI에서:
# 1. Project Navigator에서 프로젝트 선택
# 2. Targets > AudioStreamming 선택
# 3. Signing & Capabilities 탭
# 4. Team 선택 (Apple Developer Account 필요)
```

#### 릴리스 빌드 생성

```bash
# 명령줄에서 빌드
xcodebuild -workspace ios/AudioStreamming.xcworkspace \
  -scheme AudioStreamming \
  -configuration Release \
  -derivedDataPath build

# 또는 Xcode GUI에서:
# 1. Product > Scheme > AudioStreamming 선택
# 2. Product > Build For > Running 선택
# 3. Product > Archive 선택
```

---

## 4. 앱 스토어 배포

### 4.1 Google Play Store 배포

#### 1단계: Google Play Console 설정

1. https://play.google.com/console에 접속
2. 개발자 계정 생성 ($25)
3. 새 앱 생성

#### 2단계: 앱 정보 입력

- 앱 이름: SoundWave
- 카테고리: 음악 및 오디오
- 콘텐츠 등급: 자체 평가 작성
- 개인정보 보호정책: URL 입력
- 연락처 정보: 입력

#### 3단계: 릴리스 빌드 업로드

```bash
# AAB 빌드 생성
cd android
./gradlew bundleRelease

# Google Play Console에서 업로드
# 1. 릴리스 > 프로덕션
# 2. 새 릴리스 만들기
# 3. app-release.aab 업로드
```

#### 4단계: 스토어 목록 작성

- 스크린샷 (5개 이상)
- 앱 설명
- 짧은 설명
- 아이콘 (512x512)
- 기능 그래픽 (1024x500)

#### 5단계: 검토 제출

- 모든 필수 항목 완료 확인
- "검토를 위해 제출" 클릭
- 검토 대기 (보통 몇 시간~며칠)

### 4.2 App Store 배포 (iOS)

#### 1단계: Apple Developer Account 설정

1. https://developer.apple.com에 접속
2. 개발자 계정 생성 ($99/년)
3. App Store Connect에 접속

#### 2단계: 앱 생성

1. App Store Connect에서 새 앱 생성
2. 앱 이름: SoundWave
3. 번들 ID: com.soundwave.app
4. SKU: soundwave-001

#### 3단계: 앱 정보 입력

- 앱 설명
- 키워드
- 지원 URL
- 개인정보 보호정책 URL
- 연락처 정보

#### 4단계: 릴리스 빌드 업로드

```bash
# 1. Xcode에서 Archive 생성
open ios/AudioStreamming.xcworkspace

# 2. Product > Archive 선택
# 3. Organizer 창에서 Archive 선택
# 4. "Distribute App" 클릭
# 5. "App Store Connect" 선택
# 6. 자동 서명 선택
# 7. 업로드

# 또는 명령줄에서
xcodebuild -workspace ios/AudioStreamming.xcworkspace \
  -scheme AudioStreamming \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/AudioStreamming.xcarchive \
  archive

# 업로드
xcodebuild -exportArchive \
  -archivePath build/AudioStreamming.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath build/export
```

#### 5단계: 스토어 목록 작성

- 스크린샷 (2-5개, 각 언어별)
- 앱 설명
- 미리보기 비디오 (선택)
- 아이콘 (1024x1024)
- 앱 미리보기

#### 6단계: 검토 제출

- 모든 필수 항목 완료 확인
- "검토를 위해 제출" 클릭
- 검토 대기 (보통 1-3일)

---

## 5. 베타 테스트

### 5.1 Android 베타 테스트 (Google Play)

```bash
# 1. Google Play Console에서 "베타" 트랙 생성
# 2. 베타 APK/AAB 업로드
# 3. 베타 테스터 그룹 생성
# 4. 테스터 이메일 추가
# 5. 테스터들이 Google Play에서 다운로드 가능
```

### 5.2 iOS 베타 테스트 (TestFlight)

```bash
# 1. Xcode에서 Archive 생성
# 2. Organizer에서 Archive 선택
# 3. "Distribute App" > "TestFlight" 선택
# 4. 테스터 추가
# 5. 테스터들이 TestFlight 앱에서 다운로드 가능
```

---

## 6. 버전 관리

### 6.1 버전 업데이트

#### Android

`android/app/build.gradle` 수정:

```gradle
android {
    ...
    defaultConfig {
        ...
        versionCode 2        // 증가
        versionName "1.1.0"  // 업데이트
    }
}
```

#### iOS

`ios/AudioStreamming/Info.plist` 수정:

```xml
<key>CFBundleShortVersionString</key>
<string>1.1.0</string>
<key>CFBundleVersion</key>
<string>2</string>
```

### 6.2 업데이트 배포

```bash
# 1. 버전 업데이트
# 2. 릴리스 빌드 생성
# 3. 앱 스토어에 업로드
# 4. 검토 제출
# 5. 승인 후 배포
```

---

## 7. 문제 해결

### 문제: "command not found: adb"

```bash
# ANDROID_HOME 경로 확인
echo $ANDROID_HOME

# 경로가 없으면 설정
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 문제: "No connected devices"

```bash
# 연결된 기기 확인
adb devices

# USB 디버깅 활성화 확인
# 설정 > 개발자 옵션 > USB 디버깅 활성화

# 기기 재연결
adb kill-server
adb start-server
```

### 문제: "Gradle build failed"

```bash
# 캐시 삭제
cd android
./gradlew clean

# 다시 빌드
./gradlew assembleRelease
```

### 문제: "Xcode build failed"

```bash
# Pod 재설치
cd ios
rm -rf Pods
pod install

# 캐시 삭제
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 다시 빌드
xcodebuild -workspace AudioStreamming.xcworkspace \
  -scheme AudioStreamming \
  -configuration Release \
  clean build
```

---

## 8. 성능 최적화

### 8.1 번들 크기 최소화

```bash
# 번들 분석
npm run analyze

# 불필요한 의존성 제거
npm prune --production

# 이미지 최적화
npm install image-minimizer-webpack-plugin
```

### 8.2 앱 성능 개선

```javascript
// React.memo 사용
const MemoizedComponent = React.memo(MyComponent);

// useMemo 사용
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback 사용
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 9. 체크리스트

배포 전 확인사항:

- [ ] 모든 기능 테스트 완료
- [ ] 버그 수정 완료
- [ ] 버전 번호 업데이트
- [ ] 스크린샷 준비 (각 언어별)
- [ ] 앱 설명 작성
- [ ] 개인정보 보호정책 URL 준비
- [ ] 서명 키 생성 (Android)
- [ ] 개발 팀 설정 (iOS)
- [ ] 베타 테스트 완료
- [ ] 성능 최적화 완료

---

## 10. 지원

빌드 관련 문제는 다음을 확인하세요:

1. React Native 공식 문서: https://reactnative.dev
2. Android 개발 문서: https://developer.android.com
3. iOS 개발 문서: https://developer.apple.com

---

**마지막 업데이트:** 2026-02-11
