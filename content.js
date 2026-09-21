(function(root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.BlitzContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  // A reviewed practice slice, not the complete 30-word free chapter.
  // Artwork teaches meaning only; it is never displayed with answer choices.
  const words = [
    {w:'sat', d:['sat','set','sap','sad'], sentence:'Pip sat on the rock.', image:'sat-rock', alt:'Pip sits with bent hind legs and bottom resting on a broad gray rock.'},
    {w:'rock', d:['rock','lock','rack','ruck'], sentence:'Pip sat on the rock.', image:'sat-rock', alt:'Pip sits on one large, clearly visible gray rock.'},
    {w:'tree', d:['tree','free','three','trie'], sentence:'The tree is green.', image:'green-tree', alt:'Pip holds a branch of a tree with green leaves.'},
    {w:'green', d:['green','seen','greet','grain'], sentence:'The tree is green.', image:'green-tree', alt:'A tree with rich green leaves stands against a warm, pale clearing.'},
    {w:'fox', d:['fox','box','fix','fax'], sentence:'Pip follows the fox.', image:'fox', alt:'A fox with pointed ears and a bushy white-tipped tail leads Pip along a path.'},
    {w:'cave', d:['cave','save','came','cove'], sentence:'Pip is by the cave.', image:'cave', alt:'Pip stands at the entrance of a large dark cave in a rocky hillside.'}
  ];
  // Existing assessment items, axes, and stopping thresholds are preserved.
  const assessmentPools = [
    [{w:'you',d:['you','your','yuo','yue']},{w:'cat',d:['cat','can','cap','cet']},{w:'car',d:['car','cat','can','cor']},{w:'can',d:['can','cat','cap','cen']},{w:'fox',d:['fox','box','fix','fax']},{w:'map',d:['map','man','mat','mop']}],
    [{w:'rock',d:['rock','lock','rack','ruck']},{w:'tree',d:['tree','free','three','trie']},{w:'green',d:['green','seen','greet','grain']},{w:'ship',d:['ship','shop','shin','chip']},{w:'cave',d:['cave','save','came','cove']},{w:'star',d:['star','scar','stay','stir']}],
    [{w:'night',d:['night','light','right','nigth']},{w:'shark',d:['shark','sharp','share','shork']},{w:'bright',d:['bright','right','bring','brigt']},{w:'stone',d:['stone','store','stove','ston']},{w:'storm',d:['storm','store','story','starm']}],
    [{w:'dragon',d:['dragon','drigon','wagon','drayon']},{w:'forest',d:['forest','fortest','forst','forset']},{w:'castle',d:['castle','cattle','candle','castel']},{w:'shadow',d:['shadow','shallow','shade','shado']},{w:'silver',d:['silver','sliver','river','silvar']}],
    [{w:'whisper',d:['whisper','whisker','whimper','wisper']},{w:'journey',d:['journey','jersey','joyous','jorney']},{w:'lantern',d:['lantern','pattern','later','lantren']},{w:'creature',d:['creature','feature','create','creatuer']}]
  ];
  const demoWords = ['sat','fox','rock','tree','green','cave'];
  return {words, assessmentPools, demoWords};
});
