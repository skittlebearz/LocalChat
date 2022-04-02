import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { Link } from 'react-router-dom';
import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false)
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);

  function trySendMessage(){
    if(contents !== ''){
      sendMessage(contents, user)
      setContents('')
      setError(false)
    }
    else{setError(true)}
  }

  useEffect(async () => {
    const { user } = await api.get('/users/me');
    setUser(user);
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, []);

  if (loading) return 'Loading...';

  return (
    <div>
      <div className="p-4 m-4 bg-green-600">
        <h1 className="text-2xl font-bold text-white">Local Chatter</h1>
      </div>
      <div className = "p-4 m-4 rounded-lg bg-gray-300">
        <h1 className="text-xl font-bold text-gray">Messages</h1>
      <div>
        {messages.map((message) => (
          <div className = "p-1 m-4 bg-green-800 rounded-3xl" key={message.id}>
            <h3 className = "m-2 bg-green-800 text-bold text-white text-xl">{message.userName}</h3>
            <div className = "m-2 bg-green-200 rounded-3xl">
               <p className = "ml-4 mr-4 text-black text-lg"> {message.contents} </p>
               </div>
          </div>
        ))}
      </div>
      <div>
        <input type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button onClick={() => trySendMessage(contents, user)}>Send</Button>
        {error && <div><h2 className="text-red-500 text-xl">Cannot send a blank message</h2></div>}
      </div>
      </div>
      <Link className="text-white pt-2 pb-2 pr-4 pl-4 m-4 rounded-lg font-bold bg-green-800" to={`/home`}>Back to homepage</Link>
    </div>
  );
};
