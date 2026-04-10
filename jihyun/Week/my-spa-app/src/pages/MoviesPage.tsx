import Link from '../router/Link'

const movies = [
  { id: 1, title: '인터스텔라' },
  { id: 2, title: '인셉션' },
  { id: 3, title: '기생충' },
]

function MoviesPage() {
  return (
    <div>
      <h1>영화 목록</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MoviesPage