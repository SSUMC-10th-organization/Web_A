import api from './axios';

const getLocalDB = (): any[] => {
  const data = localStorage.getItem('lp_comments_db');
  return data ? JSON.parse(data) : [];
};

const saveLocalDB = (data: any[]) => {
  localStorage.setItem('lp_comments_db', JSON.stringify(data));
};

export const fetchComments = async ({
  lpId,
  pageParam,
  order,
}: {
  lpId: string;
  pageParam: number;
  order: 'latest' | 'oldest';
}) => {
  const db = getLocalDB();
  
  let filtered = db.filter((item) => item.lpId === lpId);

  if (order === 'latest') {
    filtered.sort((a, b) => b.id - a.id);
  } else {
    filtered.sort((a, b) => a.id - b.id);
  }

  return {
    data: filtered,
    result: filtered
  };
};

export const createComment = async ({
  lpId,
  content,
}: {
  lpId: string;
  content: string;
}) => {
  const db = getLocalDB();
  
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const currentUserName = userInfo.nickname || userInfo.name || '사용자';
  
  const newId = db.length > 0 ? Math.max(...db.map((o: any) => o.id)) + 1 : 1;
  
  const newComment = {
    id: newId,
    lpId,
    content,
    userName: currentUserName,
    user: { name: currentUserName },
    createdAt: new Date().toISOString(),
    isMyComment: true 
  };

  db.push(newComment);
  saveLocalDB(db); 

  return newComment;
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: string;
  commentId: number;
  content: string;
}) => {
  const db = getLocalDB();
  const index = db.findIndex((item) => item.id === commentId);

  if (index !== -1) {
    db[index].content = content;
    saveLocalDB(db);
    return db[index];
  }
  
  throw new Error("수정할 댓글을 찾을 수 없습니다.");
};

export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: string;
  commentId: number;
}) => {
  const db = getLocalDB();
  const updatedDB = db.filter((item) => item.id !== commentId);
  
  saveLocalDB(updatedDB);
  return { success: true };
};