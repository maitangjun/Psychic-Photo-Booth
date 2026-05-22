const fs = require('fs');
const path = require('path');
const titleTemplates = ['★{w1}·{w2}★','☆{w1}の{w2}☆','◆{w1}·化忌◆','卍{w1}·{w2}卍','【{w1}‖{w2}】'];
const wordsPool = ['八字','星盤','紫微','宿命','因果','神煞','五行','輪迴','劫財','七殺','梟神','傷官','孤辰','寡宿','魁罡','天乙'];
const fortuneTemplates = [
  '沵の八字【{bazi}】透出，天幹地支皆湜{shasha}，預吂著伱網速{num}Kの背後，隱藏著宿命的羈絆，痣爲七星印記，終究迯芣鋽因果鎖鏈。',
  '紫微星盤中【{ziwei}】化忌，正照沵の命宮，髮色如霓虹也掩蓋芣ㄋ{shasha}の命格，掵理誮紋巳茬脖頸鎔図，注定浪跡網絡。',
  '看沵五行【{wuxing}】，局中{shasha}過旺，網速{num}+卻連芣菿沵の咫咫迗涯，這場【{bazi}】の相遇紸國湜①場情劫。',
  '煋軌流轉，沵の星盤裏【{xinpan}】呈現凶相，鎻愛哖崮裏趉図{num}個寂寞，{shasha}入命，早巳預訁ㄋ這場因果蕜劇。',
  '掵運紸顄沵【{bazi}】逢沖，大運正走【{dayun}】，沵婹茬汏頭貼裏尋找五行所喜の【{xiyong}】，否則終究茬第{num}個秋兲徹底沉淪。',
  '精算神煞，沵命帶【{shasha}】，煋軌縗敗指姠斷網の角喥，與【{ziwei}】相克，沵們の緣衯巳經被因果格式化。',
  '四柱八字【{bazi}】財星被劫，煙熏妝 MakeUp 芣鋽【{shasha}】の淚痕，這場因果輪迴湜場{num}Kの寂寞。'
];
const adviceTemplates = [
  '流涙の眼線會花，呮冇多穿【{wuxing_color}】色衣物、補足【{wuxing_elm}】氣，方能照亮伱の吢。',
  '芣婹悩悩，汏頭貼裏の藍髮，財湜沵化解【{shasha}】の唯一解葯。',
  '鎻緊沵のQQ空間，在【{fangwei}】方點燃霓虹燈，方能看穿沵命運の枷鎖。',
  '莂茬網絡裏調涙，沵の八字喜用【{xiyong}】，煙熏妝能幫沵擋掉【{shasha}】の煞氣。',
  '做個煙熏妝吧，今年流年逢【{bazi}】，網速從来芣給沵留生路，唯有玄學可解。',
  '等霓虹熄滅，伱終究婹在【{fangwei}】方尋找沵の天乙貴人，莫忘因果。',
  '莂洇斷網莣誋ㄋ，沵命格裏【{ziwei}】高照，嶒湜殺馬特家族裏最 flash の煋。'
];
const baziList = ['梟神奪食','傷官見官','殺印相生','羊刃逢沖','財多身弱','魁罡格','天地雙合'];
const shashaList = ['孤辰寡宿','天羅地網','亡神劫煞','桃花劫','陰差陽錯','十惡大敗','六害孤虛'];
const ziweiList = ['貪狼化忌','太陰落陷','地空地劫','擎羊陀羅','七殺獨坐','破军化禄'];
const wuxingList = ['水多木漂','火炎土燥','金寒水冷','木亢金缺','土重埋金'];
const xinpanList = ['土星刑海王星','火星合冥王星','金星天王星刑相','月亮落入第十二宮','水星逆行命宮'];
const dayunList = ['七殺大運','劫財大運','梟神大運','傷官大運','死絕大運'];
const xiyongList = ['庚金喜用','丙火解凍','壬水淘沙','乙木向陽','戊土固局'];
const wuxingColorList = ['發光純黑','昏暗慘白','高飽和翠綠','霓虹粉紫','復古土黃'];
const wuxingElmList = ['甲木','丁火','庚金','癸水','戊土'];
const fangweiList = ['正東網吧','正南水泥地','西北蹦迪擺動','正北火星基地'];
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const buildUnique = (target, build) => {
  const items = [];
  const found = new Set();
  while (items.length < target) {
    const item = build();
    if (!found.has(item)) {
      found.add(item);
      items.push(item);
    }
  }
  return items;
};
const titles = buildUnique(80, () => {
  const w1 = sample(wordsPool);
  let w2 = sample(wordsPool);
  while (w2 === w1) w2 = sample(wordsPool);
  return sample(titleTemplates).replace('{w1}', w1).replace('{w2}', w2);
});
const fortunes = buildUnique(240, () => {
  return sample(fortuneTemplates)
    .replace('{bazi}', sample(baziList))
    .replace('{shasha}', sample(shashaList))
    .replace('{ziwei}', sample(ziweiList))
    .replace('{wuxing}', sample(wuxingList))
    .replace('{xinpan}', sample(xinpanList))
    .replace('{dayun}', sample(dayunList))
    .replace('{xiyong}', sample(xiyongList))
    .replace('{num}', String(Math.floor(Math.random() * 9000 + 1000)));
});
const advices = buildUnique(240, () => {
  return sample(adviceTemplates)
    .replace('{wuxing_color}', sample(wuxingColorList))
    .replace('{wuxing_elm}', sample(wuxingElmList))
    .replace('{shasha}', sample(shashaList))
    .replace('{fangwei}', sample(fangweiList))
    .replace('{xiyong}', sample(xiyongList))
    .replace('{bazi}', sample(baziList))
    .replace('{ziwei}', sample(ziweiList));
});
const data = { titles, fortunes, advices };
fs.mkdirSync(path.join('src','data'), { recursive: true });
fs.writeFileSync(path.join('src','data','fortuneData.json'), JSON.stringify(data, null, 2), 'utf8');
console.log('created', fs.existsSync(path.join('src','data','fortuneData.json')), titles.length, fortunes.length, advices.length);
