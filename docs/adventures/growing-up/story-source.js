// Pip Grows Up (12 November 2026): the story chapter that opens at 44,000 XP. Four story-only parts,
// no fights. The last right answer takes Pip past 45,000 XP, and he grows into the saddled form Artus rides.
// Answers are written with the right one first ('0'); the game shuffles them.
module.exports = {
  names: ['artus', 'pip', 'jet'],
  parts: [
    {
      id: 'grow-egg', title: 'The Little Red Egg',
      pages: [
        ['It is evening, and Artus and Pip sit by the fire. Pip is very quiet. He does not want any cake.', '“Pip, what is it?” asks Artus.', '“My back is hot,” says Pip. “And my wings feel funny. Look! I have a little light on me.”', 'Artus looks. There is a soft gold light all over Pip.', '“I think you are going to grow again,” says Artus.'],
        ['Pip looks at the fire. “Do you remember when I was very little?” he asks.', 'Artus smiles. “Yes. You were in an egg,” he says.', 'It was a long time ago. Artus was in the forest, and he saw a little red egg under an old tree. The egg was warm. Artus put it in his bag, and he took it home. He put it by the fire, and he waited and waited.'],
        ['Then one morning, there was a sound. Crack! Crack, crack!', 'A very small dragon came out of the egg. He was as small as a cup. He had big eyes and little wings.', 'He looked up at Artus. “Breakfast?” he said.', 'Artus laughed. “I will call you Pip,” he said.', '“That was my first word,” says Pip now. “It is still my best word.”'],
        ['Little Pip was hungry all the time. He ate bread. He ate cheese. He ate a red apple and a green apple. Then he went to sleep in Artus’s bag, with only his little tail out.', '“He is so small,” said Artus. “I will keep him safe.”', '“And you did,” says Pip. “Every day.”'],
      ],
      questions: [
        ['What is on Pip at the fire?', 1, 'A soft gold light', 'Some cake', 'A red bag'],
        ['Where did Artus find the egg?', 2, 'Under an old tree in the forest', 'In the river', 'On Thunder Mountain'],
        ['What was Pip’s first word?', 3, 'Breakfast', 'Cake', 'Artus'],
      ],
    },
    {
      id: 'grow-little', title: 'Little Pip',
      pages: [
        ['“You were so small,” says Artus. “You fell over your own feet!”', '“I remember,” says Pip. “And I could not jump over the stream. A fox had to help me.”', 'Then the forest lights were lost, and the trees were very dark. Little Pip did not like the dark, so he walked close to Artus. But he did not go home. They found six light seeds, and the trees could shine again.'],
        ['Then there was the big ship. A shark swam by it in the water. Little Pip was afraid of the shark. “Is he going to eat me?” he asked.', 'But the shark was very kind. He took them over the water, and he found the last seed for them.', '“I was afraid of everything,” says Pip.', '“And now you are afraid of nothing,” says Artus.'],
        ['Then they went to the river. The river had no song, and the boats could not go.', '“You rang the bells,” says Artus. “You were too small to carry them, but you rang them all.”', '“Ding, ding!” says Pip. “I was very good at that.”', 'When the last bell rang, the water ran again, and the boats could sail.'],
        ['Every day, Artus learned new words. Every day, Pip ate a lot of food. And every day, they got a little bit bigger.', '“You helped me in the dark,” says Pip.', '“And you helped me in every fight,” says Artus. “You were small, but you were brave.”', '“I was small,” says Pip. “But my fire was big!”'],
      ],
      questions: [
        ['Who helped little Pip over the stream?', 1, 'A fox', 'An owl', 'Jet'],
        ['What did Pip not like in the forest?', 1, 'The dark', 'The trees', 'The fox'],
        ['What did Pip do at the river?', 3, 'He rang the bells', 'He made a boat', 'He ate the bells'],
      ],
    },
    {
      id: 'grow-big', title: 'Big Pip',
      pages: [
        ['“Then one day, you were big,” says Artus.', 'Pip laughs. “I hit my head on the door!”', 'It was true. One morning, Pip woke up, and he was big. His wings were long, and his feet were very big. He could not get in the door, so that night he had to sleep by the house, under the stars.'],
        ['Big Pip went with Artus up into the snow. The stars were lost there, and the sky was dark. They found eight star pieces, and they made a lot of new friends.', 'Then they went up Thunder Mountain. There was a big storm, and they found Jet in a cave. Pip made a fire, and he kept Jet warm all night.', '“You were a good friend to Jet,” says Artus.'],
        ['In the morning, the storm was over. Jet found a star piece, and they took it home to Grandma. Grandma was so happy that she made a big cake for them.', '“That was the best cake,” says Pip. “I had four pieces.”', '“Five,” says Artus.', '“Five is better than four,” says Pip.'],
        ['“And then the owl came to the window,” says Pip. “The moon was not in the sky.”', '“And you helped the beaver,” says Artus. “You were so strong. You put the boat on your back.”', 'Pip smiles. “I am strong because I eat a lot of cake,” he says.', '“No,” says Artus. “You are strong because you are kind.”'],
      ],
      questions: [
        ['Why did Pip sleep by the house?', 1, 'He could not get in the door', 'He was afraid', 'He wanted to see the moon'],
        ['Where did they find Jet?', 2, 'In a cave on Thunder Mountain', 'By the river', 'In the snow'],
        ['What did Pip carry for the beaver?', 4, 'The boat', 'The cake', 'A bell'],
      ],
    },
    {
      id: 'grow-ride', title: 'Hop On!',
      pages: [
        ['Now the light on Pip is bright, and it gets brighter and brighter.', '“Artus,” says Pip. “You grew up too. When I came out of my egg, you could only read little words. Now you can read a big story all by yourself!”', 'Artus is very happy. “We grew up together,” he says.'],
        ['Then there is a knock at the door. It is Jet, and Grandma is with him. Grandma has a big bag.', '“We saw the light,” says Grandma. “I think it is time. This is for you.”', 'In the bag, there is a saddle! It is brown and very soft.', '“A saddle is a seat for a big dragon,” says Jet. “Now Artus can ride on your back!”'],
        ['Jet puts the saddle on Pip’s back. But it is too big! It goes down over Pip’s eyes.', '“I can’t see!” says Pip.', 'Jet laughs, and Grandma laughs, and Artus laughs too.', '“Wait,” says Grandma. “It will be just right very soon.”'],
        ['Pip looks at the saddle. “Can I carry Artus?” he asks. “And can we fly?”', '“Not yet,” says Grandma. “Your wings are not big enough for two. One day you will fly. But now you can run, and Artus can ride on your back.”', 'The light on Pip is so bright now that Artus has to close his eyes.', '“Here I go!” says Pip. “I am ready to grow!”'],
      ],
      questions: [
        ['What can Artus do now?', 1, 'He can read a big story by himself', 'He can fly', 'He can make a saddle'],
        ['What is in Grandma’s bag?', 2, 'A saddle', 'A cake', 'An egg'],
        ['Why can’t Pip fly with Artus yet?', 4, 'His wings are not big enough for two', 'He is too hungry', 'It is night'],
      ],
    },
  ],
};
