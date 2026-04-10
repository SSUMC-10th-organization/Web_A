import { defineConfig } from 'vite'

export default defineConfig({
  // appType을 'spa'로 설정하면 Vite 개발 서버가
  // /about 같은 경로로 새로고침해도 index.html을 반환해줘서
  // History API가 정상 동작함
  appType: 'spa',
})
