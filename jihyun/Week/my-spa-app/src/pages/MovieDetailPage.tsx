type MovieDetailPageProps = {
  movieId: string
}

const movieMap: Record<string, { title: string; description: string }> = {
  '1': {
    title: '인터스텔라',
    description: '우주를 배경으로 한 SF 영화입니다.',
  },
  '2': {
    title: '인셉션',
    description: '꿈과 현실의 경계를 다루는 영화입니다.',
  },
  '3': {
    title: '기생충',
    description: '계층 구조와 사회 문제를 다루는 영화입니다.',
  },
}

function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const movie = movieMap[movieId]

  if (!movie) {
    return (
      <div>
        <h1>영화를 찾을 수 없습니다.</h1>
        <p>잘못된 ID입니다.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>영화 ID: {movieId}</p>
      <p>{movie.description}</p>
    </div>
  )
}

export default MovieDetailPage