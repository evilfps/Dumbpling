const u = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=max&w=${w}&q=80`

export type Photo = { id: string; src: string; w: number; h: number; by: 'you' | 'them'; place: string; date: string; alt: string; tag: 'Dates' | 'Places' | 'Little things' }

export const gallery: Photo[] = [
  { id: 'window', src: u('1612991235428-330ef78c26da'), w: 3798, h: 5685, by: 'you', place: 'Home', date: '8 June', alt: 'Jamie by the window in a white jumper', tag: 'Little things' },
  { id: 'bridge', src: u('1773769171923-0943345df743'), w: 6542, h: 4338, by: 'them', place: 'Prague', date: '2 May', alt: 'A couple kissing on a bridge', tag: 'Places' },
  { id: 'dog', src: u('1764709125144-4294c1d4a87c'), w: 4753, h: 7129, by: 'them', place: 'Hampstead Heath', date: '12 June', alt: 'A couple on a stone bench with a small dog', tag: 'Dates' },
  { id: 'mug', src: u('1662038271111-5b1c0b4157e8'), w: 4000, h: 6000, by: 'you', place: 'Home', date: '14 June', alt: 'A steaming mug in front of a sunlit window', tag: 'Little things' },
  { id: 'dance', src: u('1777659948044-988afa12f401'), w: 6240, h: 4160, by: 'you', place: 'Soho', date: '24 May', alt: 'A couple dancing in a busy street', tag: 'Dates' },
  { id: 'tower', src: u('1574854986069-a8653af0944e'), w: 4000, h: 6000, by: 'them', place: 'Tower Bridge', date: '19 May', alt: 'People walking near Tower Bridge at golden hour', tag: 'Places' },
  { id: 'flowers', src: u('1623406795110-99f1c4325084'), w: 4351, h: 3264, by: 'them', place: 'Columbia Road', date: '11 May', alt: 'Pink and white flowers on lace', tag: 'Little things' },
  { id: 'hands', src: u('1561287495-a3fe1fd28504'), w: 3376, h: 6000, by: 'you', place: 'Bath', date: '6 April', alt: 'Two hands held together', tag: 'Dates' },
  { id: 'walk', src: u('1792181672189-c6b03e6d77e9'), w: 4000, h: 2710, by: 'them', place: 'Pyrenees', date: '29 March', alt: 'Two people walking along a gravel path', tag: 'Places' },
  { id: 'book', src: u('1677846092922-5b685ba0afb2'), w: 3890, h: 5171, by: 'them', place: 'Home', date: '17 March', alt: 'A cup of coffee and a book on a window sill', tag: 'Little things' },
  { id: 'sea', src: u('1767844075709-457613db5747'), w: 6000, h: 4000, by: 'you', place: 'Margate', date: '2 March', alt: 'Gentle waves under a pastel sky', tag: 'Places' },
  { id: 'bus', src: u('1534800891164-a1d96b5114e7'), w: 4000, h: 5062, by: 'you', place: 'Strand', date: '26 February', alt: 'A double-decker bus between buildings', tag: 'Places' },
]

/** Spare shots offered in the “New post” sheet. */
export const cameraRoll: Photo[] = [
  { id: 'hold', src: u('1585844428796-8abe4f28fb7d'), w: 5743, h: 3511, by: 'you', place: 'Richmond', date: 'Today', alt: 'Two people in white shirts holding hands', tag: 'Dates' },
  { id: 'sunset', src: u('1581047800850-0cb82075a02f'), w: 4896, h: 3116, by: 'you', place: 'Whitstable', date: 'Today', alt: 'People on a beach at sunset', tag: 'Places' },
  { id: 'daisy', src: u('1458929526027-052f5d6a3c5e'), w: 6000, h: 4000, by: 'you', place: 'Garden', date: 'Today', alt: 'A pink daisy', tag: 'Little things' },
  { id: 'cup', src: u('1551727609-1f89c019b5ca'), w: 4000, h: 5831, by: 'you', place: 'Café', date: 'Today', alt: 'A white cup on a saucer', tag: 'Little things' },
  { id: 'river', src: u('1699939114047-839373fa88aa'), w: 4011, h: 6048, by: 'you', place: 'Thames', date: 'Today', alt: 'A river with a bridge in black and white', tag: 'Places' },
  { id: 'ring', src: u('1484876632310-ddb3b48133cc'), w: 4752, h: 3168, by: 'you', place: 'Home', date: 'Today', alt: 'Hands with a ring', tag: 'Dates' },
]

export const snapShots = [u('1662038271111-5b1c0b4157e8', 800), u('1574854986069-a8653af0944e', 800), u('1458929526027-052f5d6a3c5e', 800)]

export const wallpapers = {
  lock: u('1767844075709-457613db5747', 1200),
  home: u('1779079516628-2063d98212c0', 1200),
}
