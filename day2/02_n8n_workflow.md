# 2. n8n 워크플로우 자동화 실습

## 실습 목표
**"특정 내용이 포함된 메일이 오면, 메일 내용을 요약해서 스프레드시트에 정리하기"**

이 실습을 통해 다음을 학습합니다:
- Gmail 트리거 설정
- 조건부 로직 구현
- Gemini API를 활용한 텍스트 요약
- Google Sheets 데이터 입력
- 전체 워크플로우 연결 및 테스트

## 워크플로우 구조
```
Gmail 트리거 → IF 조건 확인 → Gemini 요약 → Google Sheets 입력
     ↓              ↓              ↓              ↓
새 메일 수신    키워드 포함?      AI 텍스트 요약    스프레드시트 저장
```

## 필요한 준비사항
1. **Gmail 계정** - 메일 수신을 위한 계정
2. **Google Sheets** - 데이터를 저장할 스프레드시트
3. **Gemini API 키** - 이전 단계에서 발급받은 API 키
4. **테스트용 이메일** - 실습 진행을 위한 샘플 메일
5. **Google OAuth2.0 credential** - 구글 연동시 필요

**Authorization URL** *   
```
https://accounts.google.com/o/oauth2/auth
```
> 사용자를 Google 로그인 페이지로 리디렉션하는 URL. 사용자가 앱에 권한을 부여하도록 요청하는 시작점입니다.

**Access Token URL** *   
```
https://oauth2.googleapis.com/token
```
> 인증 코드를 실제 액세스 토큰으로 교환하는 엔드포인트. Google API에 접근할 수 있는 토큰을 받기 위한 URL입니다.

**Client ID** *   
```
449844294692-9p4iv75akfavg7i6qlj3mur0jvotjngk.apps.googleusercontent.com
```
> Google Cloud Console에서 생성한 앱의 공개 식별자. 앱을 Google에게 식별시키는 역할을 합니다 (공개 정보).

**Client Secret** * -> [디스코드 채널 참고](https://discord.com/channels/1404361509735366799/1406913232832041011)   
> 앱의 비밀 키 (보안상 디스코드 채널에서 별도 제공). 서버 간 통신에서 앱의 신원을 확인하는 용도입니다.

**Auth URI Query Parameters**   
```
access_type=offline&prompt=consent
```
> - `access_type=offline`: 사용자가 오프라인일 때도 토큰 갱신 가능하도록 refresh token 요청
> - `prompt=consent`: 매번 사용자에게 권한 승인 화면을 표시

**Authentication** -> body   

![Gmail 연동 창 예시](/ewha-lecture/assets/이대수업사진3.png)   
<br>
<br>
<br>
## **[실습]**
이제 단계별로 워크플로우를 구성해보겠습니다.