import { useState } from "react";
import FloatingButton from "../components/FloatingButton";
import LPGrid from "../components/LPGrid";
import type { LP } from "../types/lp";

type SortType = "oldest" | "newest";

const MOCK_LPS: LP[] = [
  { id: 1,  title: "Bill Evans - Portrait in Jazz",  content: "", thumbnail: "https://picsum.photos/seed/lp1/300/300",  published: true, authorId: 1, createdAt: "2024-01-15T00:00:00.000Z", updatedAt: "2024-01-15T00:00:00.000Z", tags: [], likes: [{id:1,userId:1,lpId:1},{id:2,userId:2,lpId:1},{id:3,userId:3,lpId:1},{id:4,userId:4,lpId:1},{id:5,userId:5,lpId:1}] },
  { id: 2,  title: "Everybody Digs Bill Evans",       content: "", thumbnail: "https://picsum.photos/seed/lp2/300/300",  published: true, authorId: 1, createdAt: "2024-02-10T00:00:00.000Z", updatedAt: "2024-02-10T00:00:00.000Z", tags: [], likes: [{id:6,userId:1,lpId:2},{id:7,userId:2,lpId:2},{id:8,userId:3,lpId:2}] },
  { id: 3,  title: "Dark Side Sessions",              content: "", thumbnail: "https://picsum.photos/seed/lp3/300/300",  published: true, authorId: 1, createdAt: "2024-03-05T00:00:00.000Z", updatedAt: "2024-03-05T00:00:00.000Z", tags: [], likes: Array.from({length:12},(_,i)=>({id:100+i,userId:i+1,lpId:3})) },
  { id: 4,  title: "Hyukoh - 23",                    content: "", thumbnail: "https://picsum.photos/seed/lp4/300/300",  published: true, authorId: 1, createdAt: "2024-03-20T00:00:00.000Z", updatedAt: "2024-03-20T00:00:00.000Z", tags: [], likes: Array.from({length:7}, (_,i)=>({id:200+i,userId:i+1,lpId:4})) },
  { id: 5,  title: "Colorful Chaos",                 content: "", thumbnail: "https://picsum.photos/seed/lp5/300/300",  published: true, authorId: 1, createdAt: "2024-04-01T00:00:00.000Z", updatedAt: "2024-04-01T00:00:00.000Z", tags: [], likes: Array.from({length:2}, (_,i)=>({id:300+i,userId:i+1,lpId:5})) },
  { id: 6,  title: "Neon Dreams",                    content: "", thumbnail: "https://picsum.photos/seed/lp6/300/300",  published: true, authorId: 1, createdAt: "2024-04-15T00:00:00.000Z", updatedAt: "2024-04-15T00:00:00.000Z", tags: [], likes: Array.from({length:9}, (_,i)=>({id:400+i,userId:i+1,lpId:6})) },
  { id: 7,  title: "Night Ride",                     content: "", thumbnail: "https://picsum.photos/seed/lp7/300/300",  published: true, authorId: 1, createdAt: "2024-04-28T00:00:00.000Z", updatedAt: "2024-04-28T00:00:00.000Z", tags: [], likes: Array.from({length:6}, (_,i)=>({id:500+i,userId:i+1,lpId:7})) },
  { id: 8,  title: "Ed Sheeran - Divide",            content: "", thumbnail: "https://picsum.photos/seed/lp8/300/300",  published: true, authorId: 1, createdAt: "2024-05-03T00:00:00.000Z", updatedAt: "2024-05-03T00:00:00.000Z", tags: [], likes: Array.from({length:18},(_,i)=>({id:600+i,userId:i+1,lpId:8})) },
  { id: 9,  title: "Warm Casio",                     content: "", thumbnail: "https://picsum.photos/seed/lp9/300/300",  published: true, authorId: 1, createdAt: "2024-05-14T00:00:00.000Z", updatedAt: "2024-05-14T00:00:00.000Z", tags: [], likes: Array.from({length:4}, (_,i)=>({id:700+i,userId:i+1,lpId:9})) },
  { id: 10, title: "HONNE - Good Side / Bad Side",   content: "", thumbnail: "https://picsum.photos/seed/lp10/300/300", published: true, authorId: 1, createdAt: "2024-05-22T00:00:00.000Z", updatedAt: "2024-05-22T00:00:00.000Z", tags: [], likes: Array.from({length:11},(_,i)=>({id:800+i,userId:i+1,lpId:10})) },
  { id: 11, title: "Animated Souls",                 content: "", thumbnail: "https://picsum.photos/seed/lp11/300/300", published: true, authorId: 1, createdAt: "2024-06-01T00:00:00.000Z", updatedAt: "2024-06-01T00:00:00.000Z", tags: [], likes: Array.from({length:8}, (_,i)=>({id:900+i,userId:i+1,lpId:11})) },
  { id: 12, title: "Summer Road",                    content: "", thumbnail: "https://picsum.photos/seed/lp12/300/300", published: true, authorId: 1, createdAt: "2024-06-10T00:00:00.000Z", updatedAt: "2024-06-10T00:00:00.000Z", tags: [], likes: [] },
  { id: 13, title: "Übermensch",                     content: "", thumbnail: "https://picsum.photos/seed/lp13/300/300", published: true, authorId: 1, createdAt: "2024-06-20T00:00:00.000Z", updatedAt: "2024-06-20T00:00:00.000Z", tags: [], likes: [] },
  { id: 14, title: "Team Baby - Wedding",             content: "", thumbnail: "https://picsum.photos/seed/lp14/300/300", published: true, authorId: 1, createdAt: "2024-06-28T00:00:00.000Z", updatedAt: "2024-06-28T00:00:00.000Z", tags: [], likes: Array.from({length:3}, (_,i)=>({id:1000+i,userId:i+1,lpId:14})) },
  { id: 15, title: "Ed Sheeran - X",                 content: "", thumbnail: "https://picsum.photos/seed/lp15/300/300", published: true, authorId: 1, createdAt: "2024-07-05T00:00:00.000Z", updatedAt: "2024-07-05T00:00:00.000Z", tags: [], likes: Array.from({length:15},(_,i)=>({id:1100+i,userId:i+1,lpId:15})) },
  { id: 16, title: "Maroon 5 - Songs About Jane",    content: "", thumbnail: "https://picsum.photos/seed/lp16/300/300", published: true, authorId: 1, createdAt: "2024-07-12T00:00:00.000Z", updatedAt: "2024-07-12T00:00:00.000Z", tags: [], likes: Array.from({length:22},(_,i)=>({id:1200+i,userId:i+1,lpId:16})) },
  { id: 17, title: "Infinity World",                 content: "", thumbnail: "https://picsum.photos/seed/lp17/300/300", published: true, authorId: 1, createdAt: "2024-07-18T00:00:00.000Z", updatedAt: "2024-07-18T00:00:00.000Z", tags: [], likes: [{id:1300,userId:1,lpId:17}] },
  { id: 18, title: "Collector's Series",             content: "", thumbnail: "https://picsum.photos/seed/lp18/300/300", published: true, authorId: 1, createdAt: "2024-07-25T00:00:00.000Z", updatedAt: "2024-07-25T00:00:00.000Z", tags: [], likes: Array.from({length:7}, (_,i)=>({id:1400+i,userId:i+1,lpId:18})) },
  { id: 19, title: "Midnight Jazz",                  content: "", thumbnail: "https://picsum.photos/seed/lp19/300/300", published: true, authorId: 1, createdAt: "2024-08-02T00:00:00.000Z", updatedAt: "2024-08-02T00:00:00.000Z", tags: [], likes: Array.from({length:9}, (_,i)=>({id:1500+i,userId:i+1,lpId:19})) },
  { id: 20, title: "Golden Hours",                   content: "", thumbnail: "https://picsum.photos/seed/lp20/300/300", published: true, authorId: 1, createdAt: "2024-08-10T00:00:00.000Z", updatedAt: "2024-08-10T00:00:00.000Z", tags: [], likes: Array.from({length:4}, (_,i)=>({id:1600+i,userId:i+1,lpId:20})) },
];

const HomePage = () => {
  const [sort, setSort] = useState<SortType>("oldest");

  const sortedLps = [...MOCK_LPS].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sort === "oldest" ? diff : -diff;
  });

  return (
    <div className="relative min-h-full px-12">
      {/* 정렬 버튼 */}
      <div className="flex justify-end p-4">
        <div className="flex rounded-lg border border-zinc-600 overflow-hidden">
          <button
            onClick={() => setSort("oldest")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "oldest" ? "bg-white text-black" : "text-white hover:bg-zinc-800"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setSort("newest")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "newest" ? "bg-white text-black" : "text-white hover:bg-zinc-800"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 앨범 그리드 */}
      <LPGrid lps={sortedLps} />
      
      {/* 플로팅 + 버튼 */}
      <FloatingButton />
    </div>
  );
};

export default HomePage;
