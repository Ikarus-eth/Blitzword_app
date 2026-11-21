// Pip and the Dark Wizard (chapters 7 and 8, 21 November 2026). Original story, no source tale.
// Grax (a dark wizard) and Rook (his helper) are original characters. Jet, Grandma, Oren and Gus come from earlier stories.
// Story arc set by the parent: a dark wizard takes Pip's friend; someone seems to help but leads them into a trap;
// in the fight the wizard lets his own helper be lost so that he can stop Artus, and Artus escapes; Grax is beaten,
// but nobody knows if he can come back. Written for Artus's progress report of 21 November 2026 (07:02 Bali time).
// Rule: every word is a curriculum word, a name, or one of storyWords. build-campaign.js picks each quest's eight
// battle targets (picked by frequency from words he does not know yet, 21 November report) and marks the rest
// as stretch words (dotted, tap to hear). Stretch lists were computed from that report and are stored here.
module.exports = {
 names: [
  "artus",
  "pip",
  "jet",
  "grandma",
  "oren",
  "gus",
  "rook",
  "grax"
 ],
 storyWords: [
  "tower",
  "cage",
  "camel",
  "pelican",
  "okapi",
  "triceratops",
  "chain",
  "horns",
  "boom",
  "storm",
  "ring",
  "staff",
  "octopus",
  "phoenix"
 ],
 quests: [
  {
   id: "dw-storm",
   chapter: 7,
   targets: [
    "smoke",
    "held",
    "flew",
    "ran",
    "laughed",
    "sound",
    "eye",
    "woke"
   ],
   mid: {
    title: "A Night at Grandma’s",
    pages: [
     [
      "It was a cold night. Artus, Pip and Jet were at Grandma’s house. Grandma made hot soup, and they ate it by the fire.",
      "Pip was big now. He was as big as a horse, and Artus could sit on his back. But Pip could not fly yet.",
      "Jet was small, but he had strong wings. He could fly over the trees and back again in no time."
     ],
     [
      "After dinner, Jet had a new trick. He flew up to the roof and down again, very fast.",
      "“Look at me!” said Jet. “I am the best flying dragon in the land!”",
      "“You are the only flying dragon in this house,” said Pip, and they all laughed.",
      "Then Grandma told them a story about a dark wizard. He wanted all the magic in the land for himself."
     ],
     [
      "Jet flew around the room again. This time, he flew a little too fast. He hit the soup, and all the soup went on the floor!",
      "“Oh no!” said Jet.",
      "Grandma looked at the soup. Then she looked at Jet. Then she laughed and laughed.",
      "“That is a very good trick,” she said. “But next time, please do it outside.”"
     ],
     [
      "“Is the dark wizard real?” asked Artus.",
      "“It is just an old story,” said Grandma. “Now it is time for bed.”",
      "Jet went to sleep by the window, because he wanted to see the moon. Pip went to sleep by the fire. Artus got into his warm bed.",
      "Soon they all slept. The house was very quiet."
     ],
     [
      "In the middle of the night, Artus woke up. There was a sound on the roof.",
      "“It is just the rain,” he said.",
      "But it was not the rain. The sound came again, and it was very big. Then it stopped.",
      "Artus sat up in his bed. Then he saw it. Black smoke was coming in under the door."
     ]
    ],
    stretch: [
     "bed",
     "floor",
     "flying",
     "himself",
     "hit",
     "next",
     "outside",
     "real",
     "roof",
     "slept",
     "story",
     "told",
     "trick",
     "wanted"
    ]
   },
   end: {
    title: "The Black Smoke",
    pages: [
     [
      "Artus jumped out of bed. “Pip! Jet! Wake up!” he shouted.",
      "Pip woke up at once. He saw the black smoke, and a little flame came out of his mouth.",
      "“Is it a fire?” asked Pip.",
      "“No,” said Artus. “This smoke is cold. It is magic smoke.”"
     ],
     [
      "Then the window opened. The wind came in, and all the lights went out.",
      "A man stood at the window. He was tall and thin, and he had a long black coat. His eyes were green, like the eyes of a cat.",
      "“Good night,” he said in a small voice. “My name is Grax. I am a wizard, like you.”"
     ],
     [
      "“You are not like me,” said Artus. “What do you want?”",
      "Grax smiled. It was not a kind smile. “I want dragon fire,” he said. “It is the best magic in the land. And now I will have it.”",
      "He held up his hand. The black smoke went around Jet, and it made a big black ball. Jet was in it!"
     ],
     [
      "“Help!” shouted Jet. He hit the smoke with his wings, but he could not get out.",
      "Pip ran to the window. A big flame came out of his mouth, as hot as the sun. But the flame went into the smoke, and the smoke ate it.",
      "Grax laughed. “Your fire can’t help him, little dragon,” he said."
     ],
     [
      "Then Grax jumped out of the window and up to the roof. The ball of smoke went with him, and Jet went with it.",
      "Artus and Pip ran out of the house. Up in the sky, they saw a black cloud. It flew away over the trees, to the dark mountains.",
      "Grandma came out of the house. Her face was white.",
      "“The old story is true,” she said in a small voice. “The dark wizard is back.”"
     ],
     [
      "That night, nobody went back to bed. Grandma sat by the fire with Artus and Pip. She did not tell any more stories.",
      "Pip looked out of the window at the dark sky. Then he cried a little.",
      "“He is my cousin,” said Pip. “He is little, and he is my best friend. We have to get him back.”",
      "“We will,” said Artus. “I don’t know how yet. But we will.”"
     ]
    ],
    stretch: [
     "bed",
     "coat",
     "cried",
     "face",
     "flame",
     "hit",
     "jumped",
     "mouth",
     "nobody",
     "opened",
     "roof",
     "shouted",
     "smiled",
     "stood",
     "stories",
     "story",
     "true",
     "wake"
    ]
   }
  },
  {
   id: "dw-trail",
   chapter: 7,
   targets: [
    "sea",
    "torch",
    "something",
    "silver",
    "whispered",
    "journey",
    "sand",
    "trick"
   ],
   mid: {
    title: "Oren’s Plan",
    pages: [
     [
      "Nobody slept again that night. In the morning, Pip sat by the door. He was very sad, and he could not eat.",
      "“Pip,” said Artus. “We will find Jet. We won’t stop until we find him.”",
      "Pip looked up. “Do you think so?” he asked.",
      "“I know so,” said Artus."
     ],
     [
      "“We need help,” said Grandma. “Go to Oren. He is a very old wizard, and he knows about Grax.”",
      "So Artus got on Pip’s back, and Pip ran all day, over the fields and along the river. At night they came to Oren’s tall tower.",
      "Gus the giant was by the door. “Artus! Pip!” he said. “Why are you here?”"
     ],
     [
      "On the way, they saw that something was not right with the land. The grass by the river was grey. The flowers were grey too.",
      "An old farmer stood by his field. “The magic is going away,” he said. “Every night, a black cloud goes over, and in the morning, more of the land is grey.”",
      "“That is Grax,” Artus whispered to Pip. “He takes the magic from everything.”"
     ],
     [
      "They told Oren and Gus about the black smoke, the black ball and Jet.",
      "Oren was quiet for a long time. Then he said, “I know Grax. A long time ago, he was my friend. He wasn’t bad then. But he wanted more and more magic, and it made him bad.”",
      "“Now he wants dragon fire,” said Artus. “We must rescue Jet.”"
     ],
     [
      "Oren opened a big old book. “Here is a plan,” he said. “Grax lives in a castle on a black island in the sea. It is a long journey. You must go through the wild forest, over the sand and under the fire mountain.”",
      "“And then?” asked Pip.",
      "“Then you must be very brave,” said Oren."
     ]
    ],
    stretch: [
     "ago",
     "everything",
     "farmer",
     "flowers",
     "grass",
     "lives",
     "nobody",
     "opened",
     "plan",
     "rescue",
     "slept",
     "stood",
     "told",
     "tower",
     "wanted",
     "wasnt",
     "wild",
     "wont"
    ]
   },
   end: {
    title: "The Silver Torch",
    pages: [
     [
      "Oren went to a box by the window. He took out a little silver torch.",
      "“This is a magic torch,” he said. “Its light is not like other light. It can see through tricks and lies.”",
      "“How does it work?” asked Artus.",
      "“Hold it up, and it will show you what is true,” said Oren. “But it only works three times. Use it well.”"
     ],
     [
      "Artus held the torch. It was cold and heavy in his hand. He put it in his bag.",
      "Then Gus came in. He had a very big bag of food for them: bread, cheese, apples and a cake.",
      "“The cake is for the journey,” said Gus.",
      "“I will look after it,” said Pip. Gus and Artus looked at each other, and they smiled for the first time that day."
     ],
     [
      "“Can you come with us, Gus?” asked Artus.",
      "Gus looked sad. “I wish I could,” he said. “But I am too big. Grax will see me from a long way away. You must go without me.”",
      "“And I am too old for a long journey,” said Oren. “But I will look for you in my magic water every day. If you need me, call my name three times.”"
     ],
     [
      "Then Oren took Artus up to the top of the tower. There was a big bowl of water there.",
      "“This is my magic water,” said Oren. He put his hand over it, and in the water they could see a picture. It was a black island in a grey sea, with a dark castle on it.",
      "“Grax is there,” said Oren. “And so is Jet. Look.”",
      "At the top of the castle, in a tall tower, there was a little red light. It was very small, like a candle in the night.",
      "“That is Jet’s fire,” said Oren. “It is still bright. You have time. But not a lot of time.”"
     ],
     [
      "That night, Artus could not sleep. He looked out of the window at the dark sky.",
      "“Pip,” he said. “Are you afraid?”",
      "“Yes,” said Pip. “But I am more afraid for Jet. He is little, and he is alone.”",
      "“He isn’t alone,” said Artus. “We are coming.”"
     ],
     [
      "In the morning, Gus held Pip in his big hands, and Oren put his hand on Artus’s head.",
      "“Remember,” said Oren. “Grax is very good at tricks. Don’t believe everything you see.”",
      "Then Pip ran, and Artus held on with both hands. The journey to rescue Jet began."
     ]
    ],
    stretch: [
     "alone",
     "apples",
     "believe",
     "box",
     "candle",
     "everything",
     "head",
     "heavy",
     "isnt",
     "lies",
     "picture",
     "remember",
     "rescue",
     "smiled",
     "tower",
     "true",
     "use"
    ]
   }
  },
  {
   id: "dw-jungle",
   chapter: 7,
   targets: [
    "tiger",
    "creature",
    "walked",
    "huge",
    "quickly",
    "flame",
    "legs",
    "jumped"
   ],
   mid: {
    title: "Into the Wild Forest",
    pages: [
     [
      "After two days, they came to a wild forest. The trees were huge, and they were very close together. It was hot and green.",
      "Birds called from the trees. Monkeys jumped in the trees. Something big was in the leaves.",
      "“I don’t like this forest,” said Pip in a small voice."
     ],
     [
      "Artus looked up. In the sky, over the trees, there was a long river of black smoke.",
      "“Look,” he said. “That is Grax’s smoke. We can follow it.”",
      "So they followed the smoke, deep into the forest. The path was small, and Pip had to go slowly."
     ],
     [
      "Then they heard a big sound. The leaves opened, and a huge orange tiger came out on the path. It had a green coat on its back.",
      "Pip stopped. Artus did not move.",
      "“Who are you?” said the tiger. “Are you a friend, or are you an enemy?”"
     ],
     [
      "“We are friends,” said Artus. “A dark wizard took our friend Jet. We follow his smoke.”",
      "The tiger looked at them for a long time. Then it said, “Grax is my enemy too. He took the light from this forest. Come with me, quickly. I know a better path.”"
     ],
     [
      "Sun went first, and Pip and Artus walked behind. The tiger was very big, but it did not make a sound.",
      "“How do you walk with no sound?” asked Pip. “I make a lot of sound.”",
      "“You are a dragon,” said Sun. “Dragons can’t hide well. But you are good at fire, and that is better.”",
      "Pip was very happy with that."
     ]
    ],
    stretch: [
     "close",
     "coat",
     "deep",
     "enemy",
     "follow",
     "followed",
     "monkeys",
     "opened",
     "orange",
     "wild"
    ]
   },
   end: {
    title: "The Tiger’s Path",
    pages: [
     [
      "The tiger walked quickly through the forest, and they followed it. It knew every tree and every stone.",
      "“My name is Sun,” said the tiger. “I look after this forest. But But Grax is too strong for me now.”",
      "“We can help,” said Artus. “When we stop Grax, the light will come back.”"
     ],
     [
      "They went deep into the forest. It was dark there, and it was cold. The trees were grey, and they had no leaves.",
      "“This is what Grax does,” said Sun. “He takes the magic from the trees, and then they go grey and cold.”",
      "Pip looked at the grey trees. He was angry now. A little smoke came out of his nose."
     ],
     [
      "They came to a little river. The water was black, and it was cold.",
      "“Don’t drink it,” said Sun. “Grax has made it bad.”",
      "Pip put his nose near the water. Then he made a small, warm flame over it. Slowly, the black went away, and the water was clean and blue again.",
      "Sun looked at Pip. “Your fire can make things better,” said the tiger. “That is why Grax wants it.”"
     ],
     [
      "Then an animal ran out on the path. It had long black and white legs and big ears. It was an okapi, and it was afraid.",
      "“Help!” said the okapi. “There are bad creatures in the forest. Grax sent them. They are coming!”",
      "Then they heard the sound of many feet."
     ],
     [
      "“Run!” said Sun. But it was too late. Three huge grey creatures came out of the trees. They were made of smoke and stone, and their eyes were green like the eyes of Grax.",
      "Artus held up his hand. He said a light spell, and a bright white light came out.",
      "The smoke creatures stopped. They did not like the light."
     ],
     [
      "Pip made a big flame, and Sun jumped at the creatures. The okapi kept them away with its long legs.",
      "Soon the smoke creatures ran away into the dark.",
      "“Thank you,” said the okapi. “You are brave. Not many come into this forest now.”",
      "Sun looked at Artus. “You are a good wizard,” said the tiger. “Now go quickly. The sand is over the river, and the smoke goes that way.”"
     ]
    ],
    stretch: [
     "deep",
     "ears",
     "feet",
     "followed",
     "kept",
     "knew",
     "late",
     "near",
     "nose",
     "okapi",
     "sent",
     "things"
    ]
   }
  },
  {
   id: "dw-camp",
   chapter: 7,
   targets: [
    "tunnel",
    "coat",
    "thought",
    "believe",
    "young",
    "later",
    "drank",
    "nothing"
   ],
   mid: {
    title: "The Sand",
    pages: [
     [
      "After the forest, there was no more green. There was only sand, everywhere they looked. The sun was very hot.",
      "Pip walked and walked. His feet were hot, and he was very thirsty.",
      "“Is it a long way?” asked Pip.",
      "“Yes, a long way,” said Artus, and he gave Pip some water."
     ],
     [
      "Later that day, they saw a camel. It was purple, and it had little stars in its coat.",
      "“This is a star camel,” said Artus. “They only walk at night. It must be lost.”",
      "The camel looked at them with big sad eyes. Then it walked away over the sand, and they followed it."
     ],
     [
      "The star camel took them to a little lake with three trees. It had cold, clean water.",
      "Pip drank and drank. “This camel is my best friend now,” he said.",
      "“I thought Jet was your best friend,” said Artus.",
      "“Jet is my best cousin,” said Pip. “That is different.”"
     ],
     [
      "They made a camp by the lake. Artus put up his little tent, and Pip made a fire.",
      "When the sun went down, the sand was very cold. The stars came out, one by one."
     ],
     [
      "Then the star camel did something beautiful. All the little stars in its coat got bright.",
      "It was like the night sky was on the sand. Pip looked at it for a long time.",
      "“Jet will like this,” he said in a small voice. “When we find him, we must show him the star camel.”",
      "“We will,” said Artus.",
      "Then Artus heard a sound. Someone was walking over the sand, very slowly."
     ]
    ],
    stretch: [
     "beautiful",
     "camel",
     "camp",
     "different",
     "feet",
     "followed",
     "lost",
     "purple",
     "someone",
     "tent",
     "walking"
    ]
   },
   end: {
    title: "A Young Man at the Camp",
    pages: [
     [
      "A young man came to the fire. He was thin and tired, and he had an old grey coat. His hands were cold.",
      "“Please,” he whispered. “Can I sit by your fire?”",
      "“Yes, come and sit,” said Artus. “Who are you?”",
      "“My name is Rook,” said the young man. “Grax had me in his castle for a long time. But I got away.”"
     ],
     [
      "Artus and Pip looked at each other.",
      "“We are going to Grax’s castle,” said Artus. “He took our friend Jet.”",
      "Rook’s eyes got very big. “The little dragon? I saw him!” he said. “He is in a cage at the top of the tower. He is not hurt, but he is very sad.”"
     ],
     [
      "Pip jumped up. “Jet is not hurt! Did you hear that, Artus?”",
      "“I know the way into the castle,” said Rook. “There is a secret tunnel under the fire mountain. I can take you.”",
      "Artus looked at Rook. He seemed like a kind and tired person. But something was not right. How did he get away from such a strong wizard?"
     ],
     [
      "That night, Pip whispered to Artus, “Do you believe him?”",
      "“I want to believe him,” Artus whispered back. “And we need his help. But Oren said, Don’t believe everything you see.”",
      "“You have the silver torch,” said Pip. “You can use it.”",
      "“It only works three times,” said Artus. “I want to keep it for Grax.”"
     ],
     [
      "Later that night, Artus could not sleep. He looked at Rook. Rook slept by the fire, and he had something in his hand.",
      "It was a little black stone. When the fire was bright, the stone looked green, like the eyes of a cat.",
      "Artus thought about Grax’s green eyes. He did not like it. But he said nothing, and in the end, he went to sleep."
     ],
     [
      "In the morning, Rook was by the fire. He gave Pip some bread, and he told funny stories.",
      "Pip laughed. “I like Rook,” he said.",
      "Rook smiled. But when he looked at the fire mountain, his smile went away. He looked afraid.",
      "Then the three of them walked on over the sand, to the fire mountain."
     ]
    ],
    stretch: [
     "cage",
     "everything",
     "person",
     "seemed",
     "slept",
     "smiled",
     "stories",
     "told",
     "tower",
     "use"
    ]
   }
  },
  {
   id: "dw-tunnel",
   chapter: 7,
   targets: [
    "head",
    "stood",
    "led",
    "pushed",
    "heavy",
    "hard",
    "near",
    "knew"
   ],
   mid: {
    title: "The Fire Mountain",
    pages: [
     [
      "The fire mountain was very big and very black. Smoke came out of the top, and the ground was hot.",
      "Rook led them to the side of the mountain. There was a huge stone there.",
      "“The tunnel is behind this stone,” said Rook. “Can your dragon push it?”"
     ],
     [
      "Pip pushed the stone with his head. It was very heavy, and it did not go.",
      "Then he pushed again, as hard as he could. Slowly, the stone began to go. Behind it, there was a dark tunnel.",
      "“Good dragon,” said Rook. But he did not look happy. He looked at the tunnel for a long time."
     ],
     [
      "“I will lead the way,” said Rook. “I know this tunnel.”",
      "They went into the dark. Artus made a little light in his hand. The walls of the tunnel were red and hot.",
      "It was very quiet. They could hear nothing, only their feet on the stones."
     ],
     [
      "After a while, the tunnel went in two ways. One way went up, and one way went down.",
      "“This way,” said Rook, and he went down. He did not stop to think.",
      "“How do you know?” asked Pip.",
      "“I… I remember it,” said Rook. But he did not look at them."
     ],
     [
      "After a long time, Artus asked, “Rook, how did you know about this tunnel?”",
      "Rook stopped. “I… I found it when I got away from the castle,” he said.",
      "Then he walked on quickly. Artus kept his hand on his bag, on the silver torch."
     ]
    ],
    stretch: [
     "feet",
     "kept",
     "lead",
     "push",
     "remember",
     "side"
    ]
   },
   end: {
    title: "The Fire Creature",
    pages: [
     [
      "In the middle of the mountain, the tunnel got very big. It was like a red room, and there was a river of fire in it.",
      "And by the river of fire stood a huge creature. It had three horns, and they were as hot as fire. Its back was like black stone with red fire in it.",
      "“A fire triceratops,” whispered Artus."
     ],
     [
      "The creature looked at them, and it made a big sound. The ground went up and down.",
      "“Stop!” said Rook. “Don’t go near it. It can’t see well. If you don’t move, it will go away.”",
      "They stood very still. The creature walked to them. It was very close now, and it was very hot."
     ],
     [
      "Then Pip did something that nobody thought he could do. He walked to the creature, slowly.",
      "“Pip, no!” whispered Artus.",
      "But Pip put his head down, and the creature put its head down too. Their noses were together.",
      "“It is a fire creature, and I am a fire creature,” said Pip. “It knew that I am a friend.”"
     ],
     [
      "The triceratops was not angry any more. It was sad. It had a black chain on one of its back legs.",
      "“Grax did this,” said Artus. “He keeps it here to stop people in the tunnel.”",
      "Pip made a very hot flame. The chain was heavy, but it got red, and then it broke.",
      "The creature ran away down the tunnel. It was happy at last."
     ],
     [
      "Before it ran away, the triceratops stopped. It turned and looked at Pip for a long time.",
      "Then it made a small, happy sound, and put its big head down on the ground.",
      "“It says thank you,” said Pip. “And it says, be careful. The man with the green eyes is not your friend.”",
      "Artus looked at Rook. But Rook was a long way away, and he did not hear."
     ],
     [
      "Rook looked at Pip. “I didn’t know a dragon could do that,” he said in a small voice.",
      "Then he led them to the end of the tunnel. There was a little door, and light came in.",
      "They looked out. Below them was the sea, and in the sea was a black island. On the island stood a dark castle with a tall tower.",
      "“Jet is in there,” said Pip."
     ]
    ],
    stretch: [
     "broke",
     "chain",
     "close",
     "horns",
     "nobody",
     "noses",
     "tower",
     "triceratops",
     "turned"
    ]
   }
  },
  {
   id: "dw-trap",
   chapter: 7,
   chapterFinale: true,
   targets: [
    "bridge",
    "shouted",
    "fell",
    "wanted",
    "moment",
    "floor",
    "opened",
    "gone"
   ],
   mid: {
    title: "The Long Bridge",
    pages: [
     [
      "A long stone bridge went over the sea to the black island. It was old, and some of the stones were gone.",
      "The sea was grey and angry. Big waves hit the bridge.",
      "“We must go over the bridge,” said Rook. “There is no other way.”"
     ],
     [
      "They walked out on the bridge. The wind was very strong. Pip walked slowly, and Artus held on with both hands.",
      "The wind was so strong that Pip had to stop. He put his head down and held on to the bridge with his big feet.",
      "Rook went first. He was very small and thin, and the wind was very strong. But he did not fall.",
      "“How can he do that?” whispered Pip.",
      "“I don’t know,” said Artus. “Maybe he has done it before.”",
      "In the middle of the bridge, a stone fell into the sea. Then another one fell. The bridge began to break!",
      "“Run!” shouted Rook."
     ],
     [
      "Pip ran, but more stones fell. There was a big hole in the bridge, and they could not jump over it.",
      "Then a white bird with blue wings came down from the sky. It was a huge pelican, and it had a little sea in its mouth.",
      "The pelican made a bridge of water over the hole. Pip ran over it, and they were on the island."
     ],
     [
      "“Thank you!” Artus shouted to the pelican. It flew away over the waves.",
      "Behind them, the old bridge fell into the sea. Now there was no way back.",
      "Rook looked at the castle. His face was white. “This way,” he said. “The door to the tower is at the back.”"
     ]
    ],
    stretch: [
     "done",
     "face",
     "feet",
     "hit",
     "mouth",
     "pelican",
     "tower"
    ]
   },
   end: {
    title: "The Trap",
    pages: [
     [
      "Rook led them around the castle to a big black door. He opened it, and they went in.",
      "It was a long room with no windows. At the end of it, there was a cage. And in the cage was a little dragon!",
      "“Jet!” shouted Pip. He ran to the cage."
     ],
     [
      "But at that moment, the door closed behind them. BOOM!",
      "Artus looked at the cage again. The little dragon in it did not move. It was not real. It was only black smoke that looked like a dragon.",
      "“It is a trick,” said Artus. “It is a trap!”"
     ],
     [
      "Then Grax laughed. He was by the door, in his long black coat.",
      "“Thank you, Rook,” said Grax. “You did well. You got me a big dragon and a young wizard.”",
      "Pip turned to Rook. “You told us a lie,” he said. “Grax never had you in his castle. You work for him!”"
     ],
     [
      "Artus looked at Rook, and Rook looked at the floor.",
      "Then Artus thought about the green stone in Rook’s hand, and how Rook knew the tunnel, and the bridge, and the door.",
      "“You knew,” said Artus. “You knew all the time.”",
      "Rook did not say anything. But his face was very sad."
     ],
     [
      "Rook looked down at the floor. “I am sad about it,” he said in a small voice. “He said he will give me a gold crown. I wanted it so much.”",
      "“A crown?” said Artus. “Jet is in a cage, and you wanted a crown?”",
      "Rook said nothing."
     ],
     [
      "Grax held up his hand, and black smoke came out of the walls. It was cold, and it was all around them.",
      "Artus put his hand in his bag. The silver torch was still there.",
      "“Now I have two dragons,” said Grax. “Soon I will have all the dragon fire in the land!”",
      "And he laughed again, a long, cold laugh, as the smoke came up and up and up."
     ]
    ],
    stretch: [
     "anything",
     "boom",
     "cage",
     "closed",
     "face",
     "laugh",
     "lie",
     "real",
     "told",
     "trap",
     "turned"
    ]
   }
  },
  {
   id: "wf-room",
   chapter: 8,
   targets: [
    "stair",
    "next",
    "closed",
    "smiled",
    "trap",
    "real",
    "anything",
    "tonight"
   ],
   mid: {
    title: "In the Smoke",
    pages: [
     [
      "The black smoke was everywhere. It was cold, and it was hard to see.",
      "Then Grax went out, and the big door closed behind him. Rook went with him.",
      "“Pip!” said Artus. “Where are you?”",
      "“I am here,” said Pip. “But I can’t see you!”"
     ],
     [
      "Artus took out the silver torch. He held it up, and a bright silver light came out.",
      "This was the first time. Oren said it only works three times.",
      "In the silver light, the smoke was not black any more. It was only thin, grey air. They could see the room again."
     ],
     [
      "“The smoke is a trick too,” said Artus. “It can’t hurt us. It only wants us to be afraid.”",
      "Pip looked around. The room had no windows. The walls were black stone, and the door was very heavy.",
      "Pip made a big flame. The door got hot, but it did not open."
     ],
     [
      "Pip sat down on the floor. He was very tired, and he was very angry with Rook.",
      "“I gave him my bread,” he said. “I laughed at his funny stories. And he took us to Grax.”",
      "“I know,” said Artus. He sat down next to Pip. “But we are not done yet. We are still together, and we still have the torch.”"
     ],
     [
      "“We are in a trap,” said Pip. “And Jet is up in the tower. What can we do?”",
      "Artus thought for a moment. “Grax knows a lot of tricks,” he said. “But Oren said, if we need him, we must call his name three times.”"
     ]
    ],
    stretch: [
     "air",
     "done",
     "stories",
     "tower"
    ]
   },
   end: {
    title: "Three Times",
    pages: [
     [
      "Artus stood in the middle of the room. “Oren!” he called. “Oren! Oren!”",
      "For a moment, there was nothing. Then they heard a small sound. It came from the wall.",
      "One of the black stones in the wall was not black any more. It was blue, and it had a little light in it."
     ],
     [
      "Artus put his hand on the blue stone. It was warm. Then they heard Oren’s voice, very small, from a long way away.",
      "“Artus,” said the voice. “I can see you in my magic water. Listen to me. In every room in that castle, there is one stone that is not real. Find it, and push it.”"
     ],
     [
      "Artus and Pip looked at every stone. There were so many! They looked high and low.",
      "Then Pip saw it. Near the floor, there was a stone that was a little different. When Pip put his nose near it, it was cold, like the smoke.",
      "“This one!” said Pip."
     ],
     [
      "Pip pushed it with his head. The stone went in, and a little secret door opened in the wall.",
      "Behind it, there were old stone stairs. They went up and up into the dark.",
      "“The stairs go up to the tower,” said Artus. “Jet is up there.”"
     ],
     [
      "Pip looked at the stairs. They were very small, and he was very big.",
      "“I will try,” said Pip. “For Jet, I can do anything.”",
      "Artus smiled. “I know you can,” he said."
     ],
     [
      "But then they heard voices on the other side of the big door. It was Grax and Rook.",
      "“Tonight, all the dragon fire will be for me,” said Grax.",
      "“And my crown?” asked Rook.",
      "“Yes, yes, your crown,” said Grax. But his voice was cold, and Artus did not believe him.",
      "Artus and Pip went quickly up the secret stairs."
     ]
    ],
    stretch: [
     "different",
     "listen",
     "low",
     "nose",
     "push",
     "side",
     "tower",
     "try"
    ]
   }
  },
  {
   id: "wf-stairs",
   chapter: 8,
   targets: [
    "climbed",
    "great",
    "ready",
    "weak",
    "making",
    "half",
    "taken",
    "remember"
   ],
   mid: {
    title: "The Secret Stairs",
    pages: [
     [
      "The stairs were very old and very small. Pip was big now, and it was hard for him to climb them.",
      "“I am too big for this castle,” said Pip.",
      "“You are just right,” said Artus. “Go slowly.”",
      "They climbed and climbed. It was dark and cold. Artus made a little light in his hand."
     ],
     [
      "After a long time, they came to a little window. They looked out.",
      "Down below was the sea. The waves were very big, and the sky was black. A big storm was coming.",
      "Something jumped out of the sea and flew over the waves. It was a blue fish with long, bright wings, like a bird."
     ],
     [
      "“A wind fish,” said Artus. “They fly when a storm is coming.”",
      "The wind fish flew up to the window. It looked at them with big round eyes.",
      "Then it flew up, to the top of the tower, and back again, many times.",
      "“It wants to show us something,” said Pip."
     ],
     [
      "Half way up the stairs, there was a small door in the wall. Behind it, they could hear many little voices.",
      "Artus looked in. The room was full of birds in small cages. Grax had taken them from the land.",
      "“We will come back for you,” Artus whispered to the birds. “We will.” A little blue bird made a happy sound."
     ],
     [
      "They climbed on. At the top of the stairs, there was a door. It was open.",
      "Artus opened it slowly. Behind it was a big round room at the top of the tower.",
      "In the middle of the room, there was a cage. And in the cage was a little dragon. He was very still."
     ]
    ],
    stretch: [
     "cage",
     "cages",
     "storm",
     "tower"
    ]
   },
   end: {
    title: "Is It Real?",
    pages: [
     [
      "“Jet!” whispered Pip. He wanted to run to the cage.",
      "But Artus put his hand on Pip’s back. “Wait,” he said. “Last time it was a trick. Remember?”",
      "Artus took out the silver torch. This was the second time. He held it up, and the silver light went all around the room."
     ],
     [
      "This time, the little dragon did not go away. It was real! It was Jet, and he was very weak and tired. His wings were down, and his eyes were closed.",
      "Next to the cage, there was a big glass ball. It was full of red and gold fire.",
      "“That is Jet’s fire,” said Artus. “Grax takes it from him.”"
     ],
     [
      "Pip ran to the cage. “Jet! Jet! It’s me, Pip!”",
      "Jet opened his eyes. “Pip?” he said in a very small voice. “You came!”",
      "“I came because you are my cousin,” said Pip. “You are my best cousin.”",
      "Jet smiled a little."
     ],
     [
      "The cage was closed with magic. Pip made a flame, but the cage did not get hot.",
      "“Only Grax can open it,” said Jet. “He has the key. It is a black ring on his hand.”"
     ],
     [
      "“How can we get the ring?” asked Pip. “Grax will never give it to us.”",
      "Jet looked at the window. “There is one way,” he said in a weak voice. “But it is not easy. You must go to the great room. Grax is there now, making his big spell.”",
      "“Then that is where we will go,” said Artus.",
      "Then they heard a sound on the stairs. Someone was coming up."
     ],
     [
      "The door opened. It was Rook. He looked at Artus, and he looked at Pip, and he looked at Jet in the cage.",
      "Artus held up his hand, ready for a spell.",
      "But Rook did not shout for Grax. He closed the door behind him.",
      "“I want to help you,” he whispered. “This time, it is true.”"
     ]
    ],
    stretch: [
     "cage",
     "easy",
     "glass",
     "ring",
     "someone",
     "true"
    ]
   }
  },
  {
   id: "wf-hall",
   chapter: 8,
   targets: [
    "told",
    "lie",
    "felt",
    "midnight",
    "thing",
    "everything",
    "won't",
    "person"
   ],
   mid: {
    title: "Rook’s Choice",
    pages: [
     [
      "“Why do you want to help us now?” asked Artus. “You told us a lie before.”",
      "Rook looked at the floor. “I know,” he said. “I wanted the crown so much. But then I saw what Grax does to the dragons. He takes their fire, and they get weak and grey.”"
     ],
     [
      "“And he will not give me a crown,” said Rook. “I heard him tonight. He laughed about me. He said, Rook is a silly boy. When I have the dragon fire, I won’t need him any more.”",
      "Rook was very sad. Artus felt sad for him too."
     ],
     [
      "“I am not a bad person,” said Rook. “I had no money, and I was hungry, and Grax was kind to me. He gave me food and a warm place to sleep. Then he said, help me, and I will give you a gold crown.”",
      "“But you were with him when he took Jet,” said Pip.",
      "“I know,” said Rook. “And I will never be happy again until I make it right.”"
     ],
     [
      "“Where is Grax now?” asked Pip.",
      "“In the great room under the tower,” said Rook. “He is making a big spell. At midnight, he will put all the dragon fire in his staff. Then nobody can stop him.”",
      "“Then we must stop him before midnight,” said Artus."
     ],
     [
      "Rook held out a little piece of paper. On it, there was a map of the castle.",
      "“This is the way to the great room,” he said. “I will go first. Grax thinks I still work for him. When he looks at me, you can get the ring.”",
      "Artus looked at Rook for a long moment. Then he took the map."
     ]
    ],
    stretch: [
     "money",
     "nobody",
     "paper",
     "place",
     "ring",
     "staff",
     "tower"
    ]
   },
   end: {
    title: "The Great Room",
    pages: [
     [
      "The great room was very big and very dark. In the middle of it, Grax stood by a fire. The fire was black.",
      "Rook walked in. “The dragon and the boy are still in the trap,” he said.",
      "Grax did not look at him. He was looking at his staff. It had red and gold light in it now."
     ],
     [
      "Artus and Pip came in behind Rook, very slowly. Artus was ready with a spell. Pip was ready with his fire.",
      "But Grax turned around. His green eyes were cold.",
      "“Did you think I didn’t know, Rook?” he said. “I know everything in my castle.”"
     ],
     [
      "Then Grax held up his staff. The big stones in the top of the room began to break.",
      "“Grax, no!” shouted Rook. “I am still in here!”",
      "Grax looked at Rook. For a moment, he did not move. Then he said, “I don’t need you any more, Rook.” And he did not stop the spell."
     ],
     [
      "Big stones began to fall. Pip ran to Artus. “Get on my back! Now!” he shouted.",
      "Artus jumped on Pip’s back. He looked for Rook. “Rook! Come with us!” he called.",
      "But there were too many stones and too much smoke. Pip ran through the stones and the smoke and out of the great room, very fast."
     ],
     [
      "Behind them, the top of the great room fell down with a huge sound. Then it was very quiet.",
      "Artus looked back. There was only a big hill of stones and grey smoke. Rook did not come out.",
      "Artus felt very sad. Rook told them a lie. But at the end, he wanted to help.",
      "“Grax let Rook fall,” said Pip in a small voice. “He is the worst wizard in the land.”"
     ],
     [
      "Pip ran and ran, out of the castle and into the rain. Then he stopped.",
      "Artus held on to Pip for a long time. They did not say anything.",
      "In the end, Artus said, “Rook did a bad thing when he was with Grax. But Grax is the worst. Rook did what Grax said, and Grax did not care.”",
      "“We will not be like Grax,” said Pip. “We never leave a friend.”",
      "“Never,” said Artus."
     ]
    ],
    stretch: [
     "care",
     "leave",
     "staff",
     "turned"
    ]
   }
  },
  {
   id: "wf-ring",
   chapter: 8,
   targets: [
    "hit",
    "broke",
    "life",
    "inside",
    "ever",
    "flying"
   ],
   mid: {
    title: "Fire Under the Sea",
    pages: [
     [
      "Artus and Pip were in a small dark room. They were not hurt, but they were tired and sad.",
      "“Where is Grax?” asked Pip.",
      "Artus looked out of a little window. Down by the sea, there was a black boat. Grax was on it, with his staff.",
      "“He is going to the sea rocks,” said Artus. “He wants to make his big spell there.”"
     ],
     [
      "Then they saw something in the water. It was green and blue, and it had eight long legs with gold on them. It was a huge octopus with a crown on its head.",
      "The octopus came up out of the waves, right next to the castle.",
      "“Grax took the light from the sea too,” it said. “I can help you. Hold on to my legs.”"
     ],
     [
      "Pip looked at the sea. He did not like water. Fire and water are not good friends.",
      "“I don’t like this,” he said.",
      "“I know,” said Artus. “But Jet needs us.”",
      "So Pip held on to the legs of the octopus, and Artus held on to Pip."
     ],
     [
      "The octopus went down into the sea and fast through the water, by fish and big rocks. Then it came up again, near the sea rocks.",
      "There, on the biggest rock, stood Grax. The storm was all around him. His staff was full of red and gold light."
     ],
     [
      "The rain was very hard now, and the waves were very big. The octopus held them with its strong legs.",
      "“Are you ready?” asked Artus.",
      "Pip looked at the rock, and at Grax, and at the staff full of Jet’s fire.",
      "“I am ready,” said Pip. And for the first time, he was not afraid."
     ]
    ],
    stretch: [
     "octopus",
     "staff",
     "storm"
    ]
   },
   end: {
    title: "The Black Ring",
    pages: [
     [
      "Grax saw them. “You again!” he shouted. “You are like a little bird that does not go away!”",
      "He held up his staff, and a big black light came out of it. It came at Artus.",
      "Artus held up the silver torch. This was the third time, the last time. The silver light hit the black light, and the black light broke."
     ],
     [
      "Grax was angry now. “That torch is Oren’s!” he shouted. “That old man always gets in my way!”",
      "He held up his staff again. But this time, Pip was ready. He made the biggest flame of his life. It was red and gold and white, and it was very, very hot.",
      "The flame hit the staff, and the staff began to break."
     ],
     [
      "All the dragon fire came out of the staff. It was like a river of red and gold light. It went up into the sky, and over the sea, back to the tower, to Jet.",
      "High in the tower, a little dragon opened his eyes. The fire was back inside him.",
      "And the black cage around him broke into a thousand pieces."
     ],
     [
      "For a moment, everything was very quiet. The rain stopped. The waves stopped.",
      "Then Artus heard a sound. It was the birds in the tower! The cages were open, and all the birds flew out, high into the sky.",
      "The magic was going back to the land."
     ],
     [
      "On the rock, Grax shouted, “No!” He took the black ring from his hand. He held it up to the sky.",
      "Then the storm came down, all around him. There was thunder and lightning and black smoke.",
      "When the smoke went away, Grax was gone. Only his black ring was on the rock."
     ],
     [
      "Artus took the ring. It was very cold.",
      "“Is he gone for ever?” asked Pip.",
      "Artus did not know. He put the ring in his bag. Then they saw a little dragon flying to them over the sea. It was Jet!",
      "“Pip! Artus!” shouted Jet. “I can fly again!”"
     ]
    ],
    stretch: [
     "cage",
     "cages",
     "ring",
     "staff",
     "storm",
     "tower"
    ]
   }
  },
  {
   id: "wf-home",
   chapter: 8,
   chapterFinale: true,
   targets: [
    "flower",
    "party",
    "everybody",
    "box",
    "lost",
    "cried",
    "outside",
    "table"
   ],
   mid: {
    title: "The Way Home",
    pages: [
     [
      "Jet flew around them three times. He was so happy.",
      "“You came for me!” he said. “You came all the way!”",
      "Pip laughed, and he held Jet with his wings. “We came because we love you,” he said. “You are my best cousin, and my best friend too.”"
     ],
     [
      "The storm was gone. The sun came out over the sea, and the black island was not black any more. It was green, with flowers and birds.",
      "The octopus took them back over the water. The pelican came too, and the wind fish flew next to them, jumping over the waves."
     ],
     [
      "On the way home, they went over the sand. The star camel was there, and it was not lost now.",
      "They went through the forest. It was not grey any more. It was green, and there were flowers everywhere. Sun the tiger was on the path.",
      "“The light is back,” said Sun. “Thank you, young wizard.”"
     ],
     [
      "Then they saw something in the sky. It was a big red and gold bird, like a fire. It came down next to them.",
      "“A red phoenix!” said Jet. “Grax had it in the tower too. The magic is back, so it can fly again.”",
      "The phoenix flew around them three times, and then it flew away to the sun."
     ],
     [
      "But Artus was quiet. He thought about Rook.",
      "“Rook did a bad thing,” he said. “But at the end, he did a good thing. I wish he could see the green forest.”",
      "Jet put his head on Artus’s hand. “Me too,” he said."
     ]
    ],
    stretch: [
     "camel",
     "octopus",
     "pelican",
     "phoenix",
     "storm",
     "tower"
    ]
   },
   end: {
    title: "A Party for Jet",
    pages: [
     [
      "When they got home, Grandma ran out of the house. She held Jet, and then Pip, and then Artus.",
      "“You are home! You are all home!” she said, and she cried, because she was so happy.",
      "That night, there was a big party at Grandma’s house."
     ],
     [
      "Oren came, and Gus came too. Gus could not get in the door, so he sat outside and looked in at the window.",
      "There was soup and bread and cheese and a huge cake. Jet ate three pieces of cake. Pip ate five.",
      "“Pip,” said Artus. “That is a lot of cake.”",
      "“I was very brave,” said Pip. “Brave dragons need a lot of cake.”"
     ],
     [
      "Then Jet stood up on the table. “I want to say something,” he said.",
      "Everybody stopped and looked at him.",
      "“Thank you, Pip,” said Jet. “Thank you, Artus. You came all the way across the land for me. You are the best friends a little dragon could have.”",
      "Then he flew up to the roof and down again, very fast. And this time, Grandma did not say a word about the soup."
     ],
     [
      "After the party, Artus gave Oren the black ring.",
      "Oren took it and looked at it for a long time. His face was worried.",
      "“Is Grax gone?” asked Artus. “Can he come back?”",
      "“I don’t know,” said Oren. “Grax knows a lot of tricks. This ring still has some of his magic in it.”"
     ],
     [
      "“I will keep it in my tower,” said Oren, “in a box with a strong spell on it. And I will look at it every day.”",
      "“And if Grax comes back?” asked Pip.",
      "Oren smiled. “Then he will meet a brave young wizard and two brave dragons,” he said. “And I don’t think he will like that.”",
      "Everybody laughed."
     ],
     [
      "That night, Jet went to sleep by the window, because he wanted to see the moon. Pip went to sleep by the fire. Artus got into his warm bed.",
      "A long way away, in Oren’s tower, the black ring was in its box.",
      "And in the dark, just for a moment, it was not black any more. It was green, like the eyes of a cat.",
      "THE END… for now."
     ]
    ],
    stretch: [
     "bed",
     "face",
     "meet",
     "ring",
     "roof",
     "tower"
    ]
   }
  }
 ]
};
