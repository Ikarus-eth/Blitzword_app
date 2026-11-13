// Pip and the Wizard's Tower (14 November 2026). Original story, no source tale.
// Oren is an original old wizard and Gus an original friendly giant; they are not taken from any book or film.
// Written for Artus's progress report of 14 November 2026 (07:40 Bali time): almost every word is one he has
// secured or kept, a name, or one of the eight words each quest pre-teaches in its fights.
module.exports = {
  names: ['artus', 'pip', 'oren', 'gus'],
  // Story words outside the 1,000-word curriculum; each has a simple meaning and can be tapped.
  tapWords: ['tower', 'beard', 'boom', 'hello'],
  quests: [
    {
      id: 'wt-giant', targets: ['giant', 'shy', 'gentle', 'friendly', 'hand', 'behind', 'letter', 'pocket'],
      mid: { title: 'Boom, Boom, Boom', pages: [
        ['It is a sunny morning. Artus is at home, and he reads a book about magic. Pip is by the fire. He eats bread and cheese.', 'Then the house starts to move. Boom! Boom! Boom!', '“What is that?” says Pip. “Is it thunder?”', '“No,” says Artus. “The sky is blue. It is not thunder.”'],
        ['Boom! Boom! Then it stops.', 'Artus looks out of the window. Then he looks up, and up, and up.', 'It is a giant! He is as tall as a tree. He has red hair and a big red beard, and he has a very big pocket.'],
        ['Pip hides behind the door. “Artus,” he says. “Giants eat little dragons. All dragons know that!”', 'The giant sits down. Then he looks in at the window. He has big blue eyes, and they are very kind.', '“Hello,” he says in a small voice. “Please don’t be afraid.”'],
        ['“My name is Gus,” says the giant. “I do not eat dragons. I eat soup and bread and cake.”', 'Pip looks out from behind the door. “Cake?” he says. “I like you already.”', 'Gus is very shy. He looks down at his big hands. Then he says, “I have a letter for you. It is from Oren, the old wizard.”'],
      ] },
      end: { title: 'The Letter', pages: [
        ['Gus holds out the letter. It is very small in his big hand. Artus opens it and reads it.', '“Hello, Artus. My name is Oren. I am a very old wizard, and I have a tall tower. The magic in my tower is not well, and I need a brave wizard to help me. Please come. Gus will bring you.”'],
        ['“A wizard wants my help!” says Artus. He is very excited.', '“Is the tower a long way away?” asks Pip.', '“It is a long way for you,” says Gus. “But it is not a long way for me. I can jump over a river. You can sit in my pocket.”'],
        ['Artus puts his book, his map and some food in his bag. Pip puts in a lot of bread, a lot of cheese and a big piece of cake.', '“Pip,” says Artus. “Is that cake for you?”', '“No,” says Pip. “Giants are very big, and they get very hungry. This cake is for Gus.”', 'Artus smiles. He knows that the cake is not for Gus.'],
        ['Gus puts his big hand down by the door, and Artus and Pip get on it. His hand is warm and gentle.', 'Then he puts them in his big pocket. It is like a little room in there. There is a red tomato in it. The tomato is as big as Pip!'],
        ['Then Gus walks. Boom! Boom! Boom! Soon the house is very small behind them. They go over the trees, over the river and over the forest. The wind is in their hair.', '“This is better than a boat!” says Pip.', 'Gus smiles. He is shy, but he is a very friendly giant.', '“First, we can stop at my house,” he says. “It is on the way.”'],
      ] },
    },
    {
      id: 'wt-farm', targets: ['farm', 'carrot', 'bean', 'egg', 'field', 'honey', 'leaves', 'sick'],
      mid: { title: 'The Giant Farm', pages: [
        ['At lunch time, Gus stops by a little house. Well, it is little for a giant. For Artus and Pip, it is as big as a castle.', '“This is my farm,” says Gus, and he puts them down.'],
        ['Artus looks around. All the food on the farm is very big!', 'There is a carrot as tall as a tree. There are beans as long as boats. And there is a field of red tomatoes. Every tomato is as big as a ball.', '“Is it all magic?” asks Pip.'],
        ['“Yes,” says Gus. “Oren gives magic to my farm. Every night, a light comes from his tower. It makes all the food big and strong.”', 'Then a big brown chicken comes out of the house. She is as big as a horse! She sits down, and when she gets up, there is an egg. It is as big as Pip!'],
        ['Pip hides behind Artus. “She is very big,” he says.', '“She is very kind,” says Gus. “And she made an egg for your lunch.”', 'Gus makes the egg, and they eat it with bread and honey. It is a very big lunch, and Pip eats a lot.', '“Is there more?” asks Pip.'],
      ] },
      end: { title: 'The Sick Farm', pages: [
        ['After lunch, Gus shows them all of his farm. But it is not all good.', 'At the end of the field, the leaves on the trees are brown. The beans are small and grey. And the carrots are very thin.'],
        ['“Why are the leaves brown?” asks Artus.', 'Gus looks sad. “The farm is sick,” he says. “Every night, the light from the tower is not as bright. And every day, more leaves go brown.”'],
        ['“And it is not just my farm,” says Gus. “All the land is sick. In the town, there is no light at night. The animals in the forest are cold and hungry. And there is no more honey.”', 'Gus sits down. He is very, very sad.', 'Artus looks at Pip, and Pip looks at Artus. They are sad too.'],
        ['Pip goes to Gus. He takes the big piece of cake out of his bag.', '“Here,” says Pip. “It is for you. When I am sad, cake helps.”', 'Gus looks at the cake. It is very small in his big hand. But he smiles. “Thank you, Pip,” he says. “You are a good friend.”'],
        ['Artus stands up tall. “Oren needs help, and the farm needs help,” he says. “We must go to the tower now!”', 'Gus puts them back in his pocket with some honey for Oren. Then he walks on, over the field and down a long path.', 'Behind them, more brown leaves fall from the trees.'],
      ] },
    },
    {
      id: 'wt-lake', targets: ['road', 'woods', 'lake', 'across', 'along', 'below', 'stone', 'proud'],
      mid: { title: 'The Dark Woods', pages: [
        ['Gus walks along the road all day. Then the road goes into the woods. The trees are very tall, and it is dark and quiet.', '“I don’t like the woods,” says Gus. “I am too big for them. The trees are in my way.”', 'He has to be very careful.'],
        ['Then Gus stops. “Look,” he says. There are some little birds on the road. They are very cold, and they can’t fly.', 'Artus looks at them. “The magic is going away here too,” he says. “The birds need light and fire.”'],
        ['“I can help,” says Pip. He jumps down from the pocket, and he makes a little fire on the road. It is small and warm, like a fire in a house.', 'The little birds come to the fire. Soon they are warm again.'],
        ['One bird flies up. Then two more fly up. Soon all of the birds are up in the trees, and they are happy.', 'Pip is very proud. “Did you see that?” he says. “I am a good dragon!”', '“You are the best dragon,” says Artus.', '“Can we have a snack now?” asks Pip. “I am a hungry dragon.” Gus gives him a big piece of bread from his pocket, and they walk on.'],
      ] },
      end: { title: 'Across the Lake', pages: [
        ['At the end of the woods, there is a big lake. The water is very still and dark. Over the lake, they can see the tall tower.', '“How can we get across?” asks Artus. “There is no boat.”'],
        ['“I can walk across,” says Gus. “The lake is big, but I am a giant.”', 'He walks into the water. Soon it comes up to his pocket. “Hold on!” says Gus. Artus and Pip look down. The water is very dark. They can’t see what is below it.'],
        ['Then Gus stops. “Oh no,” he says. “There are big stones in this lake. I must walk on them. If I can’t see them, I will fall!”', 'Pip looks at Artus. “You are a wizard,” he says. “Can you make a light?”'],
        ['Artus holds up his hand. He says a light spell, and a white light comes out of his hand. It goes down, down into the water.', 'Now they can see it all. Below them, there is a path of big white stones. It goes all the way across the lake.'],
        ['Gus walks on the stones, one, two, three, all the way across. Then they are at the door of the tall tower.', '“You are a good wizard,” says Gus.', 'Artus is very proud. But he is a little worried too. At the top of the tower, the light is very, very small.'],
      ] },
    },
    {
      id: 'wt-tower', targets: ['hill', 'hundred', 'above', 'silly', 'sitting', 'beside', 'hat', 'until'],
      mid: { title: 'A Hundred Stairs', pages: [
        ['The tower is on a hill, and it is very tall. It goes up above the clouds. The door is very small for a giant.', '“I can’t go in,” says Gus. “I will wait here.” He sits down beside the door. He is so big that he is like a little hill.'],
        ['Artus and Pip go in. There are stairs, and the stairs go up and around and up and around.', '“One, two, three,” says Pip. “Ten, eleven, twelve . . .”', 'There are a hundred stairs! At the top, Pip is very tired. “Can we have a snack?” he says.'],
        ['At the top of the stairs, there is a big room with a lot of books and maps. There is a big fire, and a very old man is sitting beside it.', 'He has long white hair and a long white beard. His beard is as long as Pip! He has a tall blue hat with gold stars on it.'],
        ['“Hello, hello!” says the old man. “You must be Artus. And this must be Pip. My name is Oren.”', 'Oren gets up. He looks all around the room. “Where is my hat?” he says. “I can’t find my hat.”', '“It is on your head,” says Artus.', 'Oren smiles. “Oh, I am a silly old wizard,” he says.'],
      ] },
      end: { title: 'The Star Stone', pages: [
        ['Oren takes them up more stairs, to the very top of the tower. There is only the sky above them.', 'In the room, there is a big round stone. It is as old as the hills. But it is grey, and only a very small light comes from it.'],
        ['“This is the Star Stone,” says Oren. “It gives light and magic to all the land. It makes the farms big and green, and it keeps the animals warm.', 'But after a hundred years, the stone needs a new spell. If it does not get a new spell, the light will go out.”'],
        ['“And now it is time for the new spell,” says Oren. “But I am very old now. My voice is not strong, and I can’t see the little letters in the spell book. That is why I need you, Artus. You can read.”'],
        ['Artus looks at the stone. “I am only a little wizard,” he says. “I can read, but I can’t read very well yet.”', 'Oren smiles. “You can read better than you think,” he says. “And every time you read, you get better.”'],
        ['“Where is the spell book?” asks Pip.', 'Oren looks at the door. “It is in the book room,” he says. “But the books in my tower can fly. They will not sit still until you read to them.”', 'Pip flies to the door. “Come on!” he says.'],
      ] },
    },
    {
      id: 'wt-books', targets: ['jumping', 'hop', 'stopped', 'let', 'while', 'without', 'against', 'page'],
      mid: { title: 'The Book Room', pages: [
        ['Oren opens the door to the book room. Artus and Pip look in. Oh!', 'There are books everywhere, and they all fly around the room! Big books fly like birds. Little books hop around. Some books are jumping up and down.'],
        ['“I will get one!” says Pip. He jumps up high. But a big blue book flies at him, and Pip falls down. “That book is not very friendly,” he says.', 'More books fly at the walls and the window. Boom! Boom! Boom! They fly against the walls, and then they fly up again.'],
        ['“Stop, Pip!” says Oren. “You can’t get a book like that. Books are like birds. They are happy when you read them. If you read to them, they will come to you.”'],
        ['Artus sees a little green book. He opens it, and he reads it to the books.', 'The little book is very still while he reads. Then the other books stop. One by one, they come down and sit around Artus. They want to hear it too.', 'Soon all the books have stopped.', 'Oren smiles. “Good,” he says. “You see? Books love it when you read to them.”'],
      ] },
      end: { title: 'The Big Spell Book', pages: [
        ['“Now, where is my spell book?” says Oren. Then he sees it. “There it is!”', 'The spell book is very big and very old. It is red and gold, and it is up high, at the top of the room. It does not want to come down.'],
        ['“Let me help,” says Artus. He sits down and opens the little green book again.', 'He reads a book about a little dragon who can’t find his mum. He reads it very well.', 'While he reads, the big red book comes down. It comes down, down, down, and it sits beside him.'],
        ['Oren takes the book. “Thank you, Artus,” he says. He opens it, and he looks for the spell.', 'Then he stops. “Oh no,” he says. “Two pages are not here!”'],
        ['“Where did they go?” asks Artus.', '“One night, there was a big wind,” says Oren. “The window was open, and the wind got two pages out of the book. Without them, we can’t make the spell. And without the spell, the light will go out!”'],
        ['Then there is a big voice at the window. It is Gus! He is so tall that he can look in at the window.', '“I can see one page!” he says. “It is at the top of the mountain. And I think one page is in the woods, by the old tree.”', '“Then let’s go now,” says Artus. “Pip and I will find them.”'],
      ] },
    },
    {
      id: 'wt-pages', targets: ['snow', 'ground', 'root', 'trunk', 'bark', 'dirt', 'dirty', 'seed'],
      mid: { title: 'The Page in the Snow', pages: [
        ['Gus puts Artus and Pip in his pocket, and he walks up the mountain. It is very cold at the top. There is snow everywhere, and the wind is strong.', 'Pip flies around and around. “It is so cold!” he says. “My wings are cold!”', '“There it is!” says Gus. Under a little tree, there is a white page.'],
        ['But the page is under the snow, and it is very cold. Artus pulls it, but it does not move.', '“I can make a fire,” says Pip.', '“No, Pip!” says Artus. “Your fire is too hot for a page!”'],
        ['Pip thinks. Then he makes a very, very little fire. It is not hot. It is just warm, like the sun in the morning.', 'Soon the snow goes away. Then the page comes out from under the tree.'],
        ['Artus holds it up. It has gold letters on it.', '“Good work, Pip,” says Artus. “That was a very good idea.”', 'Pip is very proud. “I am big, and I am strong,” he says. “And now I can make a small fire too.”'],
      ] },
      end: { title: 'The Old Tree', pages: [
        ['Then Gus walks down the mountain and into the woods. In the woods, there is a very old tree. It has a big trunk, and its bark is grey.', 'Artus looks at the tree. The bark looks like a face. Then the tree opens its eyes!'],
        ['“Who is there?” says the old tree in a very old voice.', '“We are looking for a page from a book,” says Artus. “It is white, with gold letters on it.”', '“Yes, I have it,” says the tree. “The wind put it in my roots. But I am very old, and I am sick. My roots need water.”'],
        ['“We can help you,” says Artus. Gus goes to the lake. He comes back with a lot of water in his big hat, and he puts it on the roots of the tree.', 'Pip puts his hands into the dirt, and soon he finds the page. He is very dirty, but he is happy.'],
        ['The old tree is better now. Its leaves are a little more green.', '“Thank you,” it says. “This is for you.” A little brown seed falls down from the tree into Artus’s hand.', '“When the light comes back, put this seed in the ground,” says the tree. “Then a new tree will come up.”'],
        ['Artus puts the page and the seed in his bag. Then they go back to the tower.', 'Pip looks at his hands. They are very dirty.', '“Look at me,” he says. “I am a dirt dragon now!”', 'Artus and Gus look at Pip, and they all smile.'],
      ] },
    },
    {
      id: 'wt-spell', targets: ['second', 'third', 'fourth', 'cup', 'sweet', 'cookie', 'chocolate', 'word'],
      mid: { title: 'Night in the Tower', pages: [
        ['Back at the tower, Oren puts the two pages in the big spell book. “Now the book is all here,” he says. “Thank you, my friends.”', '“Can we do the spell now?” asks Artus.', '“Not yet,” says Oren. “We must do it at night, when the moon is at the top of the sky.”'],
        ['So they wait. Oren makes hot chocolate in a big pan. He gives Artus a cup, and he gives Pip a cup.', 'Then he gets a cup for Gus. It is the biggest cup in the tower, but for Gus it is very, very small. Gus smiles, and he drinks it all at once.'],
        ['Then Oren gets some cookies. They are sweet and warm.', 'Pip has one cookie. Then he has a second cookie, and a third cookie, and a fourth cookie.', '“Pip!” says Artus.', '“They are very small cookies,” says Pip.'],
        ['Oren smiles. He gives Pip some more chocolate too.', 'Then he looks at the sky. It is very dark. The moon is up, but there are no stars, and the land is dark too.', '“It is time,” says Oren.'],
      ] },
      end: { title: 'The Spell', pages: [
        ['They go up to the very top of the tower. The Star Stone is very grey now. There is almost no light in it.', 'Oren opens the spell book, and he gives it to Artus. “Read it to the stone,” he says. “Read every word.”'],
        ['There are only four words in the spell, but they are big words. Artus is a little afraid.', 'He reads the first word. He can read it well. A little light comes into the stone.', 'He reads the second word. It is a long word, but he reads it. The light gets a little bigger.'],
        ['Then he gets to the third word, and he stops. It is very long, and he does not know it.', '“I can’t read it,” he says. “It is too long.”', '“Look at every letter,” says Oren. “Say it slowly, one sound at a time.”'],
        ['Artus looks at every letter. He says it slowly, one sound at a time. And then he can read it!', 'He reads the third word, and the stone gets very bright.', '“Good!” says Oren. “Only one more word.”'],
        ['Then he gets to the fourth word. It is the biggest word in the book. Artus thinks of all the words he can read now. He can read well now, and he is brave.', 'He reads the fourth word to the stone.', 'For a second, it is very quiet. Then the stone is as bright as the sun!'],
      ] },
    },
    {
      id: 'wt-light', targets: ['village', 'men', 'mother', 'father', 'boy', 'thousand', 'plate', 'bowl'],
      mid: { title: 'The Light Comes Back', pages: [
        ['The light from the Star Stone goes up into the sky. Then it goes out over all the land.', 'A thousand stars come out in the sky. The moon is bright. And all over the land, there is light again.'],
        ['On the farm, the leaves on the trees are green again. The beans are long and strong. And the big brown chicken has a new egg.', 'In the woods, the old tree opens its eyes, and it smiles. In the forest, the animals are warm again, and the birds fly up into the sky.'],
        ['Down the hill, there is a little village. All the houses were dark. But now there is light in every window.', 'Men come out of their houses. Mothers and fathers come out with their girls and boys. They all look up at the tower.'],
        ['Oren puts his hand on Artus’s back. “You did it,” he says. “You read the spell, and the light is back. Now the stone will be bright for a hundred more years.”', 'Gus is so happy that he jumps up and down. Boom! Boom! Boom! Pip has to hold on to the tower.'],
      ] },
      end: { title: 'A Star for Artus', pages: [
        ['In the morning, the people of the village come up the hill. They want to see the little wizard.', 'A little boy comes to Artus. “Are you the wizard who made the light?” he asks.', '“Yes,” says Artus. Then he smiles. “But I had a lot of help.”'],
        ['Then Gus comes with a plate. It is the biggest plate in all the land. On it, there is a giant cake!', '“I made it for you,” says Gus. He is shy, and his face is red. “It is for all of you.”', 'Pip looks at the cake. Then he looks at Gus. “You are my best giant friend,” he says.'],
        ['The mothers, the fathers and the girls and boys all have some cake. Pip has a big bowl of cake, and then he has one more bowl.', 'Then Artus takes the little brown seed out of his bag. He puts it in the ground at the top of the hill. Soon a little green tree comes up.'],
        ['Then Oren gives Artus a little gold star.', '“Put it on your hat,” says Oren. “Now you are a good wizard. Please come back to my tower again and again. Every time, I will show you a new spell.”', '“Again and again?” says Artus. He is very happy. “Yes, please!”'],
        ['Then Gus takes Artus and Pip home. They go back across the lake, along the road and over the hills.', 'Artus looks at his gold star. Pip sleeps in the pocket with some cake on his face.', 'And that night, the land is full of light.'],
      ] },
    },
  ],
};
