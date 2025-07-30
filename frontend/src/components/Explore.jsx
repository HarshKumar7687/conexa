import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp } from 'lucide-react';

const Explore = () => {
  const { posts } = useSelector(store => store.post);

  const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());

  return (
    <div className="pl-[18%] pr-8 py-8 min-h-screen bg-[#0a0a0a] text-white">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-yellow-400">
        <TrendingUp className="w-6 h-6" />
        Explore
      </h1>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shuffledPosts.map((post) => (
          <div
            key={post._id}
            className="rounded-md overflow-hidden border border-[#2a2a2a] hover:shadow-[0_0_10px_#facc15aa] transition-all"
          >
            <img
              src={post.image}
              alt="post"
              className="w-full aspect-square object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
