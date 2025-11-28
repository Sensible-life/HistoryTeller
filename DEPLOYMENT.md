# Vercel 배포 가이드

## 배포 방법

### 방법 1: Vercel CLI (가장 빠름)

1. Vercel CLI 설치
```bash
npm i -g vercel
```

2. 로그인
```bash
vercel login
```

3. 프로젝트 배포
```bash
vercel
```

4. 프로덕션 배포
```bash
vercel --prod
```

### 방법 2: Vercel Dashboard (가장 간단)

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "Add New Project" 클릭
3. GitHub 계정 연결
4. HistoryTeller 저장소 선택
5. 빌드 설정 확인:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. "Deploy" 클릭

### 방법 3: GitHub 자동 배포

1. GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/HistoryTeller.git
git push -u origin main
```

2. Vercel에서 GitHub 저장소 import
3. main 브랜치에 푸시할 때마다 자동 배포됨

## 환경 변수 (필요시)

Vercel Dashboard에서 Settings > Environment Variables에서 추가:

```
# 예시
VITE_API_URL=https://api.example.com
```

## 커스텀 도메인 설정

1. Vercel Dashboard에서 프로젝트 선택
2. Settings > Domains
3. 도메인 추가
4. DNS 레코드 설정 (Vercel이 안내)

## 빌드 설정

프로젝트의 `vercel.json` 파일이 자동으로 설정을 제공합니다:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 배포 후 확인사항

✅ 모든 섹션이 올바르게 로드되는지 확인
✅ Canvas 애니메이션이 작동하는지 확인
✅ 스크롤 인터랙션이 정상 작동하는지 확인
✅ 모바일 반응형이 제대로 동작하는지 확인
✅ 성능 최적화 (Lighthouse 점수 확인)

## 트러블슈팅

### 빌드 실패
- `npm install` 후 로컬에서 `npm run build` 테스트
- Node.js 버전 확인 (18 이상 권장)

### Canvas 애니메이션 안보임
- 브라우저 호환성 확인
- 콘솔 에러 확인

### Scrollama 작동 안함
- Intersection Observer API 지원 확인
- 폴리필 추가 필요시 설치

## 성능 최적화

1. 이미지 최적화 (webp 포맷 사용)
2. Code splitting (이미 적용됨)
3. Lazy loading 적용
4. Bundle 크기 분석: `npm run build -- --analyze`

## 유용한 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# Vercel 배포 (CLI)
vercel

# Vercel 프로덕션 배포 (CLI)
vercel --prod
```
