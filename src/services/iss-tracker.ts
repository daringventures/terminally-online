export interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number; // unix seconds
}

export interface PersonInSpace {
  name: string;
  craft: string;
}

export interface PeopleInSpaceData {
  number: number;
  people: PersonInSpace[];
}

export async function fetchISSPosition(): Promise<ISSPosition> {
  const res = await fetch('http://api.open-notify.org/iss-now.json');
  if (!res.ok) throw new Error(`ISS Tracker: ${res.status}`);

  const data = await res.json() as {
    message: string;
    timestamp: number;
    iss_position: {
      latitude: string;
      longitude: string;
    };
  };

  if (data.message !== 'success') throw new Error('ISS Tracker: bad response');

  return {
    latitude: parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp,
  };
}

export async function fetchPeopleInSpace(): Promise<PeopleInSpaceData> {
  const res = await fetch('http://api.open-notify.org/astros.json');
  if (!res.ok) throw new Error(`ISS Astros: ${res.status}`);

  const data = await res.json() as {
    message: string;
    number: number;
    people: Array<{ name: string; craft: string }>;
  };

  if (data.message !== 'success') throw new Error('ISS Astros: bad response');

  return {
    number: data.number,
    people: data.people,
  };
}
