import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://connexa-0mua.onrender.com/api/v1/user/suggested", {
        withCredentials: true
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Could not fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === '') {
      setFiltered([]);
    } else {
      const matched = users.filter(u =>
        u.username.toLowerCase().includes(value)
      );
      setFiltered(matched);
    }
  };

  const goToProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className='ml-[16%] px-6 py-6 text-white min-h-screen bg-[#0a0a0a]'>
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-6">Search Users</h1>

      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={handleSearch}
        className="bg-[#1e1e1e] text-white placeholder-yellow-600 border border-gray-700 rounded-lg p-3 w-full max-w-md
                   outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:ring-offset-[#0a0a0a]
                   transition duration-300 mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchTerm && filtered.length > 0 ? (
          filtered.map(u => (
            <div
              key={u._id}
              onClick={() => goToProfile(u._id)}
              className="cursor-pointer flex items-center gap-4 p-4 bg-[#111111] border border-[#2a2a2a] rounded-xl
                         hover:shadow-[0_0_12px_#facc15aa] active:shadow-[0_0_16px_#facc15] transition-all"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={u.profilePicture} alt={u.username} />
                <AvatarFallback>{u.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-yellow-400">{u.username}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
            </div>
          ))
        ) : (
          searchTerm && (
            <p className="text-gray-500 col-span-full text-center">No users found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
