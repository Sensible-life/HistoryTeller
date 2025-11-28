# HistoryTeller - 조선의 과거제

조선시대 과거제도와 그 불평등성을 탐구하는 인터랙티브 스크롤텔링 웹사이트입니다.

## 🎯 프로젝트 개요

이 프로젝트는 산업디자인학과 데이터 분석 프로젝트로, 조선시대 과거제의 역사와 구조를 시각화하고, 이 제도가 가진 불평등성을 데이터 기반으로 분석합니다.

### 주요 섹션

1. **인재 선발의 문제** - 인터랙티브 원들로 인재 선발의 어려움 표현
2. **여러 선발 제도 비교** - 추첨제, 선거, 세습, 천거, 매관 등을 애니메이션으로 시각화
3. **과거제 소개** - 과거제의 역사적 배경
4. **과거제 상세 설명** - 실록을 인용한 과거제의 구체적인 운영 방식

## 🛠 기술 스택

- **React 18** - UI 컴포넌트
- **Vite** - 빌드 도구
- **Scrollama** - 스크롤 기반 스토리텔링
- **Canvas API** - 애니메이션 및 시각화
- **Vercel** - 배포

## 📦 설치 및 실행

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속하세요.

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

## 🚀 Vercel 배포

### 1. Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 2. Vercel Dashboard 사용

1. [Vercel](https://vercel.com)에 로그인
2. "Import Project" 클릭
3. GitHub 저장소 연결
4. 자동으로 빌드 및 배포 설정 감지
5. "Deploy" 클릭

### 3. GitHub 연동 자동 배포

1. GitHub에 저장소 푸시
2. Vercel에서 저장소 import
3. main 브랜치에 푸시할 때마다 자동 배포

## 📁 프로젝트 구조

```
HistoryTeller/
├── public/              # 정적 파일
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Section1Opening.jsx
│   │   ├── Section2SystemComparison.jsx
│   │   ├── Section3Introduction.jsx
│   │   └── Section4Details.jsx
│   ├── styles/          # CSS 파일
│   │   ├── Section1Opening.css
│   │   ├── Section2SystemComparison.css
│   │   ├── Section3Introduction.css
│   │   └── Section4Details.css
│   ├── App.jsx          # 메인 App 컴포넌트
│   ├── App.css
│   ├── index.css        # 글로벌 스타일
│   └── main.jsx         # 엔트리 포인트
├── index.html
├── package.json
├── vite.config.js
├── vercel.json          # Vercel 설정
├── CLAUDE.md            # 프로젝트 컨텍스트
└── README.md
```

## 🎨 디자인 가이드

- **톤**: 중립적이고 학술적
- **스타일**: 아카이브 느낌
- **색상**: 전통적인 한국 색상 팔레트
  - Primary Blue: #3b5998
  - Accent Gold: #d4af37
  - Accent Red: #c73e3a

## 👥 팀

- **디자이너**: 1명 (비주얼 디자인, UX, 데이터 시각화)
- **개발자**: 1명 (프론트엔드 구현, 애니메이션, 인터랙션)

## 📚 데이터 출처

- 조선왕조실록
- 경국대전
- 역사적 과거제 기록
- 지역별/계층별 합격률 데이터

## 🔜 향후 계획

- [ ] 챗봇 인터페이스 추가 ("진짜 지방 농부도 쉽게 할 수 있었을까?")
- [ ] 과거제 불균형 데이터 시각화
- [ ] 개혁 시도 섹션 추가
- [ ] 반응형 모바일 최적화

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
