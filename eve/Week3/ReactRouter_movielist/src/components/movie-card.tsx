import styled from "styled-components";

export default function MovieCard({ movie }: any) {
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image"; 

    return (
        <Card>
            <Poster src={posterUrl} alt={movie.title} />
            <Info>
                <Title>{movie.title}</Title>
                <ReleaseDate>{movie.release_date}</ReleaseDate>
                <Rating>⭐ {movie.vote_average.toFixed(1)}</Rating>
            </Info>
        </Card>
    );
}

const Card = styled.div`
    background-color: #1e1e1e;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px); 
        box-shadow: 0 10px 20px rgba(255, 71, 87, 0.2);
    }
`;

const Poster = styled.img`
    width: 100%;
    height: 280px;
    object-fit: cover;
`;

const Info = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Title = styled.h3`
    font-size: 14px;
    color: white;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
`;

const ReleaseDate = styled.span`
    font-size: 12px;
    color: #999;
`;

const Rating = styled.span`
    font-size: 13px;
    color: #ffbd39;
    font-weight: bold;
`;