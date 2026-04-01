import Link from '../router/Link'

function HomePage() {
  return (
    <div>
      <h1>홈 페이지</h1>
      <p>React Router 없이 History API로 구현한 SPA입니다.</p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Link to="/about">소개 페이지로 이동</Link>
        <Link to="/movies">영화 목록으로 이동</Link>
      </div>
    </div>
  )
}

export default HomePage