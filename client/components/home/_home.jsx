import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';


function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [location, setLocation] = useState(null)
  const [lat, setLat] = useState(null)
  const [error, setError] = useState(false)
  const [long, setLong] = useState(null)

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  
  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    setChatRooms(chatRooms);
    navigator.geolocation.getCurrentPosition(locate = (position) => {setLocation(position)
    setLat(position.coords.latitude)
    setLong(position.coords.longitude)
    })
    setUser(res.user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async () => {
    if(name !== ''){
      const { chatRoom } = await api.post('/chat_rooms', { name, lat, long });
      setChatRooms([...chatRooms, chatRoom]);
      setName('');
      setError(false)
    }
    else{setError(true)}
  };

  return (
    <div>
      <div className="p-4 m-4 bg-green-600">
        <h1 className="text-2xl font-bold text-white">Local Chatter</h1>
      </div>
    <div className="p-4 m-4 bg-green-300 rounded-lg">
      <h1 className="text-xl font-bold">Welcome {user.firstName}</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={createRoom}>Create New Room At Your Location</Button>
      {error && <div><h2 className="text-red-500 text-xl">Must enter a name for the room</h2></div>}
      <br></br>
      <br></br>
      <br></br>
      <div>
      <h1 className="text-xl font-bold">Showing all rooms created within 10 miles</h1>
      </div>
      <div className="p-4 m-4 -gray-400 rounded-lg">
        {chatRooms.map((chatRoom) => (
          distance(lat, long, chatRoom.latitude, chatRoom.longitude, "M") < 10 &&
            <Link className="text-white pt-2 pb-2 pr-4 pl-4 m-4 rounded-lg font-bold bg-green-800" to={`/chat_rooms/${chatRoom.id}`}>Join: {chatRoom.name}</Link>
        ))}
      </div>
      {location==null &&
      <h1> Location unavailable, please enable location permissions and refresh page </h1>
      }
    </div>
    </div>
  );
};
