/* Original learning materials. Add another unit using the same stable-ID schema. */
window.HEAR_UNITS = [
  {
    id: 'teenage-life', title: 'Teenage Life', titleZh: '校园与青少年生活', label: 'UNIT 01',
    introduction: '从选社团、安排作业到一起做小项目，听见校园里真实而自然的交流。',
    characters: {
      Mia: {photo:'assets/portraits/mia-20261101.jpg',position:'50% 24%',caption:'有点紧张，也愿意尝试'},
      Lily: {photo:'assets/portraits/lily-20261101.jpg',position:'50% 28%',caption:'耐心倾听，陪朋友一起出发'}
    },
    dialogues: [
      {
        id: 'club', title: 'A club to try', titleZh: '一起试试新社团',
        context: '放学后，Mia 想参加一个社团，又有些担心自己不够擅长。Lily 和她聊起这周的体验活动。',
        roles: ['Mia', 'Lily'], goal: '询问信息、表达顾虑、提出邀请',
        supports: ['What do you usually do in ...?', 'Could I ...?', 'Why not try ...?', 'Would you like to ...?'],
        lines: [
          {s:'Mia', en:'Are you going to the club fair after class?', zh:'下课后你要去社团展示活动吗？', keys:['club fair', 'after class']},
          {s:'Lily', en:'Yes. I want to find out more about the drama club. What about you?', zh:'去呀。我想多了解一下戏剧社。你呢？', keys:['drama club', 'find out']},
          {s:'Mia', en:'I am interested, but I feel nervous about speaking in front of people.', zh:'我挺感兴趣，但当众说话让我有点紧张。', keys:['interested', 'nervous', 'in front of people']},
          {s:'Lily', en:'That is understandable. We can start with a small role or help behind the scenes.', zh:'这很正常。我们可以从小角色开始，或者做幕后工作。', keys:['small role', 'behind the scenes']},
          {s:'Mia', en:'What do students usually do at the first meeting?', zh:'第一次活动时，同学们通常做些什么？', keys:['first meeting', 'usually do']},
          {s:'Lily', en:'They play a few speaking games and read a short scene together.', zh:'大家会玩几个口语小游戏，再一起读一小段戏。', keys:['speaking games', 'short scene']},
          {s:'Mia', en:'Could I just watch for a while before joining in?', zh:'我能先看一会儿，再参与进去吗？', keys:['watch for a while', 'joining in']},
          {s:'Lily', en:'Of course. You do not need to decide everything today.', zh:'当然。你不用今天就决定好所有事情。', keys:['of course', 'today']},
          {s:'Mia', en:'That sounds better. When does the meeting start?', zh:'这样听起来好多了。活动几点开始？', keys:['when', 'start']},
          {s:'Lily', en:'At half past four, in Room Two. Would you like to go with me?', zh:'四点半，在二号教室。你想跟我一起去吗？', keys:['half past four', 'Room Two', 'with me']},
          {s:'Mia', en:'Yes, please. Can we meet outside our classroom first?', zh:'好呀。我们可以先在教室外面碰面吗？', keys:['meet', 'outside our classroom']},
          {s:'Lily', en:'Sure. Let us give it a try and see how we feel.', zh:'当然。我们先试试看，再看看感觉如何。', keys:['give it a try', 'how we feel']}
        ]
      },
      {
        id:'homework', title:'A little room to breathe', titleZh:'给课后生活留点空间',
        context:'午休时，Ben 发现 Lucy 一直在看作业清单。Lucy 想兼顾作业、运动和休息，两人一起商量一个小计划。',
        roles:['Ben','Lucy'], goal:'表达感受、询问原因、协商安排',
        supports:['How are you feeling about ...?', 'What takes the most time?', 'How about ...?', 'Could we ... first?'],
        lines:[
          {s:'Ben', en:'You seem a little worried. Is everything all right?', zh:'你看起来有点担心。还好吗？', keys:['worried', 'all right']},
          {s:'Lucy', en:'I have quite a lot of homework, and I still want to play basketball today.', zh:'我有不少作业，但今天还想打篮球。', keys:['homework', 'basketball']},
          {s:'Ben', en:'Which subject is taking the most time?', zh:'哪一科最费时间？', keys:['which subject', 'most time']},
          {s:'Lucy', en:'Maths. I keep going back to the same problem instead of taking a break.', zh:'数学。我一直反复看同一道题，也没有休息一下。', keys:['maths', 'same problem', 'break']},
          {s:'Ben', en:'How about working together in the library for half an hour?', zh:'要不要去图书馆一起学半个小时？', keys:['together', 'library', 'half an hour']},
          {s:'Lucy', en:'That might help. Could we look at the difficult part first?', zh:'也许有用。我们能先看看难的部分吗？', keys:['difficult part', 'first']},
          {s:'Ben', en:'Certainly. We can explain our ideas to each other, rather than copy answers.', zh:'当然。我们可以互相解释思路，而不是抄答案。', keys:['explain', 'each other']},
          {s:'Lucy', en:'Good idea. What time would we finish?', zh:'好主意。那我们几点结束？', keys:['what time', 'finish']},
          {s:'Ben', en:'Around five. Then you would still have time for basketball.', zh:'五点左右。这样你还有时间打篮球。', keys:['around five', 'still have time']},
          {s:'Lucy', en:'I like that plan. Could you remind me to stop checking my phone?', zh:'我喜欢这个计划。你能提醒我别老看手机吗？', keys:['plan', 'remind me', 'phone']},
          {s:'Ben', en:'Only if you remind me too. My phone can stay in my bag.', zh:'你也得提醒我才行。我的手机可以放在包里。', keys:['remind me too', 'in my bag']},
          {s:'Lucy', en:'Deal. A small plan feels much better than worrying all afternoon.', zh:'说定了。做个小计划，比担心一整个下午舒服多了。', keys:['small plan', 'better', 'worrying']}
        ]
      },
      {
        id:'garden', title:'One small shared project', titleZh:'一起照顾班级的小花园',
        context:'Anna 和 Jack 要为班级准备一个小花园方案。他们在课间商量任务分工，也想给安静的同学留下参与的空间。',
        roles:['Anna','Jack'], goal:'提出建议、比较方案、请求帮助',
        supports:['What if we ...?', 'I think ... because ...', 'Would ... be easier than ...?', 'Could you help with ...?'],
        lines:[
          {s:'Anna', en:'What do you think we should grow in the class garden?', zh:'你觉得班级的小花园适合种些什么？', keys:['grow', 'class garden']},
          {s:'Jack', en:'What if we start with a few plants that are easy to care for?', zh:'不如先种几株容易照顾的植物？', keys:['a few plants', 'easy to care for']},
          {s:'Anna', en:'That makes sense. Would small pots be easier than one large box?', zh:'有道理。几个小花盆会不会比一个大箱子更方便？', keys:['small pots', 'easier than']},
          {s:'Jack', en:'I think so. We could move them when we need more sunlight.', zh:'我觉得会。需要更多阳光时，我们还能把它们挪动。', keys:['move', 'sunlight']},
          {s:'Anna', en:'Could you help me draw a simple plan after lunch?', zh:'午饭后，你能帮我画一张简单的方案图吗？', keys:['draw', 'simple plan', 'after lunch']},
          {s:'Jack', en:'Sure. I can draw, but I do not know much about plants.', zh:'当然。我会画画，但对植物不太了解。', keys:['draw', 'plants']},
          {s:'Anna', en:'We could ask Mei. She grows vegetables with her grandfather.', zh:'可以问问 Mei。她会和爷爷一起种蔬菜。', keys:['ask Mei', 'vegetables', 'grandfather']},
          {s:'Jack', en:'Good idea. Would she prefer to talk in our small group?', zh:'好主意。她会不会更愿意在我们的小组里聊？', keys:['prefer', 'small group']},
          {s:'Anna', en:'Let us ask her. We can offer to write down her suggestions.', zh:'问问她吧。我们可以提出帮她记下建议。', keys:['ask her', 'write down', 'suggestions']},
          {s:'Jack', en:'When do we need to share the plan with the class?', zh:'我们什么时候要把方案分享给全班？', keys:['when', 'share the plan']},
          {s:'Anna', en:'On Friday. We have time to listen to everyone before we choose.', zh:'周五。在做选择前，我们有时间听听每个人的想法。', keys:['Friday', 'everyone', 'choose']},
          {s:'Jack', en:'Great. A shared garden should begin with a shared plan.', zh:'很好。共同的花园，就应该从共同的计划开始。', keys:['shared garden', 'shared plan']}
        ]
      }
    ],
    stories:[
      {
        id:'lunch', title:'A seat at lunch', titleZh:'午餐时的一个座位', level:'short', levelZh:'短故事',
        context:'刚转学的 Sara 对新校园还不熟悉。一件很小的事，让她的午休有了不同。',
        lines:[
          {en:'Sara moved to a new school last Monday.', zh:'Sara 上周一转到了一所新学校。', keys:['Sara', 'new school', 'last Monday']},
          {en:'At lunchtime, she sat alone near a window.', zh:'午餐时，她独自坐在窗边。', keys:['lunchtime', 'alone', 'window']},
          {en:'She wanted to talk to someone but did not know how to begin.', zh:'她想和人聊聊，却不知道怎样开口。', keys:['talk', 'how to begin']},
          {en:'A girl called Li noticed the empty seat beside her.', zh:'一个叫 Li 的女孩注意到她旁边的空位。', keys:['Li', 'empty seat']},
          {en:'Li asked if she could sit there and showed Sara a photo of her dog.', zh:'Li 问能不能坐在那里，并给 Sara 看了一张自家小狗的照片。', keys:['sit there', 'photo', 'dog']},
          {en:'Soon they were laughing and sharing stories about their pets.', zh:'不久，她们笑着聊起了各自宠物的故事。', keys:['laughing', 'sharing stories', 'pets']},
          {en:'The next day, Sara saved a seat for Li.', zh:'第二天，Sara 给 Li 留了一个座位。', keys:['next day', 'saved a seat']},
          {en:'The new school already felt a little friendlier.', zh:'这所新学校已经显得更亲切了一些。', keys:['school', 'friendlier']}
        ],
        w5h:{Who:'Sara; Li',What:'sat alone → talked → saved a seat',When:'last Monday; lunchtime; the next day',Where:'a new school; near a window',Why:'Sara did not know how to begin',How:'an empty seat; a photo of a dog'},
        points:['Sara 是新来的学生，一开始独自吃饭。','Li 主动询问能否坐下，用宠物照片开启交谈。','两人开始交流；第二天 Sara 为 Li 留了座位。'],
        retelling:'This story is about Sara and her new friend Li. Sara was new at school and sat alone at lunch. Then Li asked to sit beside her and showed her a photo of her dog. They talked about their pets and soon felt comfortable together. In the end, Sara saved a seat for Li the next day. A small friendly action helped her feel welcome.'
      },
      {
        id:'book-swap', title:'An idea worth sharing', titleZh:'一个值得分享的想法', level:'standard', levelZh:'标准故事',
        context:'班级要办一次旧书交换活动。安静的 Tom 有一个想法，但一开始，他并没有在大组讨论时说出来。',
        lines:[
          {en:'Our class decided to hold a book swap at the end of the month.', zh:'我们班决定在月底办一次旧书交换活动。', keys:['class', 'book swap', 'end of the month']},
          {en:'Everyone was excited, but planning the event was not as simple as we expected.', zh:'大家都很兴奋，但策划活动没有想象中那么简单。', keys:['excited', 'planning', 'not simple']},
          {en:'Some students wanted to put all the books on one long table.', zh:'一些同学想把所有书放在一张长桌上。', keys:['all the books', 'one long table']},
          {en:'Others thought we should arrange them by subject so that visitors could find things easily.', zh:'另一些同学认为应该按主题摆放，方便来的人寻找。', keys:['by subject', 'find things easily']},
          {en:'Tom listened quietly and drew a small map in his notebook.', zh:'Tom 安静地听着，在笔记本里画了一张小地图。', keys:['Tom', 'quietly', 'small map']},
          {en:'During a break, I asked him what he was working on.', zh:'休息时，我问他在做什么。', keys:['break', 'asked him']},
          {en:'He suggested using different corners for different kinds of books, with clear signs on the walls.', zh:'他建议在不同角落摆放不同种类的书，并在墙上贴上清晰的标识。', keys:['different corners', 'clear signs']},
          {en:'I asked whether he would like me to help explain his idea to the group.', zh:'我问他是否愿意让我帮忙向小组介绍这个想法。', keys:['help explain', 'idea', 'group']},
          {en:'He smiled and said we could show the map together.', zh:'他笑着说，我们可以一起展示这张地图。', keys:['smiled', 'show the map', 'together']},
          {en:'The group liked the plan and added a quiet corner where visitors could read before choosing.', zh:'小组很喜欢这个方案，还增加了一个可以先阅读再选书的安静角落。', keys:['liked the plan', 'quiet corner', 'read']},
          {en:'On the day of the event, the room was busy but well organised.', zh:'活动当天，房间里很热闹，却井然有序。', keys:['event', 'busy', 'well organised']},
          {en:'Tom helped people find books and even recommended a favourite story to a new student.', zh:'Tom 帮大家找书，还向一位新同学推荐了自己喜欢的故事。', keys:['find books', 'recommended', 'new student']},
          {en:'Later, he told me that sharing an idea felt easier when someone was ready to listen.', zh:'后来，他告诉我，有人愿意倾听时，分享想法就容易多了。', keys:['sharing an idea', 'easier', 'listen']}
        ],
        w5h:{Who:'Tom; the narrator; classmates',What:'planned a book swap; shared a map',When:'the end of the month; during a break; event day',Where:'at school; different corners of the room',Why:'help visitors find books; make sharing easier',How:'clear signs; a map; explaining together'},
        points:['班级策划旧书交换活动，同学们对摆放方式有不同意见。','Tom 安静地画出方案；叙述者主动倾听，并提出一起介绍。','小组采用不同角落和清晰标识，还加入阅读区域。','活动顺利；Tom 参与帮助别人，也更愿意分享想法。'],
        retelling:'This story is about Tom and a class book swap. At first, the class had different ideas about arranging the books. Tom listened and drew a map, but he did not speak to the whole group. Then a classmate asked about his idea and offered to explain it with him. The group used different corners and clear signs. They also added a quiet reading area. On the day, the room was busy but well organised. Tom helped visitors and recommended a story. In the end, he felt that sharing was easier when someone was willing to listen.'
      }
    ],
    patterns:[
      {id:'information',type:'询问信息',en:'What do you usually do in ...?',zh:'你们在……通常做什么？',example:'What do you usually do in the drama club?',replace:'the drama club → the reading club / your group'},
      {id:'feeling',type:'表达感受',en:'I feel ... when ...',zh:'当……时，我感到……。',example:'I feel nervous when I speak in front of people.',replace:'nervous → excited / relaxed; speak → sing'},
      {id:'request',type:'委婉请求',en:'Could you help me with ...?',zh:'你能在……方面帮我吗？',example:'Could you help me with the class plan?',replace:'the class plan → this word / my notes'},
      {id:'suggest',type:'提出建议',en:'How about ...?',zh:'……怎么样？（后接名词或动词 -ing 形式）',example:'How about working together after class?',replace:'working together → taking a break / reading aloud'},
      {id:'opinion',type:'表达观点',en:'I think ... because ...',zh:'我认为……，因为……。',example:'I think small pots are better because we can move them.',replace:'small pots → a small group; reason → your own reason'},
      {id:'compare',type:'比较方案',en:'Would ... be easier than ...?',zh:'……会不会比……更容易？',example:'Would small pots be easier than one large box?',replace:'small pots → working together; one large box → working alone'},
      {id:'clarify',type:'请求说清楚',en:'Could you say that again, please?',zh:'请你再说一遍，可以吗？',example:'Could you say that again, please? I missed the time.',replace:'the time → the place / the last word'},
      {id:'invite',type:'发出邀请',en:'Would you like to ... with me?',zh:'你想和我一起……吗？',example:'Would you like to go to the meeting with me?',replace:'go to the meeting → visit the library / try the club'},
      {id:'respond',type:'自然回应',en:'That sounds ... . Let us ... .',zh:'听起来……。我们……吧。',example:'That sounds helpful. Let us give it a try.',replace:'helpful → interesting / lovely; give it a try → meet after class'}
    ],
    vocabulary:[
      {word:'club fair',meaning:'社团展示、招新活动',example:'We can visit the club fair after class.'},
      {word:'behind the scenes',meaning:'在幕后',example:'I would like to help behind the scenes.'},
      {word:'join in',meaning:'参加，加入活动',example:'You can watch before you join in.'},
      {word:'nervous',meaning:'紧张的',example:'I feel nervous before speaking.'},
      {word:'remind',meaning:'提醒',example:'Please remind me to take a break.'},
      {word:'suggestion',meaning:'建议（可数名词）',example:'Thank you for your suggestion.'},
      {word:'care for',meaning:'照顾，照料',example:'These plants are easy to care for.'},
      {word:'sunlight',meaning:'阳光',example:'The plants need more sunlight.'},
      {word:'book swap',meaning:'旧书交换活动',example:'Our class is planning a book swap.'},
      {word:'arrange',meaning:'安排，整理，摆放',example:'We can arrange the books by subject.'},
      {word:'recommend',meaning:'推荐',example:'Could you recommend a story?'},
      {word:'give it a try',meaning:'试试看',example:'We do not have to be perfect. Let us give it a try.'}
    ]
  }
];
