import { LanguageCode } from '../types';

export const getUnoGameStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    yourTurn: string;
    matchingCount: (count: number) => string;
    noMatches: string;
    chooseColorTitle: string;
    chooseColorSub: string;
    youWon: string;
    playerWon: (name: string) => string;
    wonSub: string;
    lostSub: string;
    playAgain: string;
    cardsCount: (count: number) => string;
    unoButton: string;
    drawCard: string;
    colors: Record<string, string>;
  }> = {
    as: {
      yourTurn: 'আপোনাৰ পাল — খেলিবলৈ কাৰ্ড বাছক',
      matchingCount: count => count === 1 ? '১ খন মিল থকা কাৰ্ড! খেলিবলৈ টিপক।' : `${count} খন মিল থকা কাৰ্ড! যিকোনো এখন খেলক।`,
      noMatches: 'মিল থকা কাৰ্ড নাই। ডেকলৈ টিপি নতুন কাৰ্ড লওক!',
      chooseColorTitle: 'এটা ৰং বাছক',
      chooseColorSub: 'খেল চলাই নিবলৈ তলৰ যিকোনো এটা ৰং বাছক:',
      youWon: 'আপুনি জিকিলে! 🎉',
      playerWon: name => `${name} জিকিল!`,
      wonSub: 'বৰ ধুনীয়া কৌশল আৰু মননশীল সিদ্ধান্ত! পুনৰ খেলিবনে?',
      lostSub: 'বৰ সুন্দৰ খেল হ’ল! কাৰ্ড খেলাই মনসংযোগ বৃদ্ধি কৰে।',
      playAgain: 'পুনৰ খেলক',
      cardsCount: count => `${count} খন কাৰ্ড`,
      unoButton: 'ইউনো!',
      drawCard: 'কাৰ্ড লওক',
      colors: { red: 'ৰঙা', yellow: 'হালধীয়া', green: 'সেউজীয়া', blue: 'নীলা' },
    },
    brx: {
      yourTurn: 'नोंथांनि पालि — गेलेनो कार्ड थु',
      matchingCount: count => `${count} थानै मिलिनाय कार्ड! थुना गेले।`,
      noMatches: 'मिलिनाय कार्ड गैया। डेकनिफ्राय गोदान कार्ड ला!',
      chooseColorTitle: 'गाब सायख’',
      chooseColorSub: 'गेलेनायखौ सालायनो गाब सायख’:',
      youWon: 'नोंथाङा देरहाबाय! 🎉',
      playerWon: name => `${name} देरहाबाय!`,
      wonSub: 'जोबोद गाहाम गेलेनाय! फिन गेलेगोन नामा?',
      lostSub: 'मोजां गेलेबाय! गेलेनाया गोसो सान्नायखौ मोजां खालामो।',
      playAgain: 'फिन गेले',
      cardsCount: count => `${count} कार्ड`,
      unoButton: 'युनो!',
      drawCard: 'कार्ड ला',
      colors: { red: 'गोजा', yellow: 'गोमो', green: 'गोथां', blue: 'गोथाव' },
    },
    mni: {
      yourTurn: 'অদোমগী তাঞ্জা — শান্নবা কাৰ্ড খল্লু',
      matchingCount: count => `${count} য়ান্নবা কাৰ্ড! শান্নবা নম্মু।`,
      noMatches: 'য়ান্নবা কাৰ্ড লৈত্রে। অনৌবা কাৰ্ড লৌথোকউ!',
      chooseColorTitle: 'মচু অমা খল্লু',
      chooseColorSub: 'মখাতাবা মচু খল্লু:',
      youWon: 'অদোম মায় পাক্লে! 🎉',
      playerWon: name => `${name} মায় পাক্লে!`,
      wonSub: 'য়াম্না ফবা শান্নবা! অমুক শান্নসিরা?',
      lostSub: 'ফরে! কাৰ্ড শান্নবনা পুক্নিং চোমহল্লি।',
      playAgain: 'অমুক শান্নসি',
      cardsCount: count => `${count} কাৰ্ড`,
      unoButton: 'ইউনো!',
      drawCard: 'কাৰ্ড লৌ',
      colors: { red: 'অঙাংবা', yellow: 'ঙাংবা', green: 'অশুংবা', blue: 'হিগোক' },
    },
    lus: {
      yourTurn: 'I hun chiah — khelh tur card thlang rawh',
      matchingCount: count => `${count} inmil a awm! Hmet la khel rawh.`,
      noMatches: 'Inmil card a awm lo. Card dang la rawh!',
      chooseColorTitle: 'Rawng Thlang Rawh',
      chooseColorSub: 'Kal zelna tur rawng thlang rawh:',
      youWon: 'I chak e! 🎉',
      playerWon: name => `${name} a chak e!`,
      wonSub: 'Khelh dan fing tak a ni! Khelh leh i duh em?',
      lostSub: 'I khel ṭha hle mai! Card khelh hian rilru a tiharh ṭhin.',
      playAgain: 'Khel Leh Rawh',
      cardsCount: count => `Card ${count}`,
      unoButton: 'UNO!',
      drawCard: 'Card La Rawh',
      colors: { red: 'Sen', yellow: 'Eng', green: 'Hring', blue: 'Pawl' },
    },
    kha: {
      yourTurn: 'Ka pali jong phi — jied ia ka card ban ialehkai',
      matchingCount: count => `${count} tylli ki card ba iadei! Tep ban ialeh.`,
      noMatches: 'Ym don card ba iadei. Shim card thymmai!',
      chooseColorTitle: 'Jied Rong',
      chooseColorSub: 'Jied ia ka rong ban bteng:',
      youWon: 'Phi la jop! 🎉',
      playerWon: name => `${name} u la jop!`,
      wonSub: 'Ka buit kaba bha shisha! Ialehkai biang?',
      lostSub: 'Ialehkai bha! Pynleit jingmut bha.',
      playAgain: 'Ialehkai Biang',
      cardsCount: count => `${count} tylli cards`,
      unoButton: 'UNO!',
      drawCard: 'Shim Card',
      colors: { red: 'Saw', yellow: 'Stem', green: 'Jyrngam', blue: 'Blei' },
    },
    grt: {
      yourTurn: 'Nang·ni somoi — kal·na card seokbo',
      matchingCount: count => `${count} meliatgipa card! Kal·na thikbo.`,
      noMatches: 'Meligipa card dongja. Gital cardko ra·bo!',
      chooseColorTitle: 'Rongko Seokbo',
      chooseColorSub: 'Kal·angkuna rongko seokbo:',
      youWon: 'Nang·a cheaha! 🎉',
      playerWon: name => `${name} cheaha!`,
      wonSub: 'Nambegipa buki! Taikali kal·noa?',
      lostSub: 'Namaha! Kal·ani gisikko seng·ata.',
      playAgain: 'Kal·taibo',
      cardsCount: count => `Card ${count}`,
      unoButton: 'UNO!',
      drawCard: 'Card Ra·bo',
      colors: { red: 'Gitchak', yellow: 'Rimit', green: 'Giting', blue: 'Tangsim' },
    },
    trp: {
      yourTurn: 'Nini somoi — card saikha',
      matchingCount: count => `${count} milinai card! Khlengdi.`,
      noMatches: 'Milinai card kwrwi. Kwtal card laidi!',
      chooseColorTitle: 'Rong Saikha',
      chooseColorSub: 'Khlengna bagwi rong saikha:',
      youWon: 'Nung chekha! 🎉',
      playerWon: name => `${name} chekha!`,
      wonSub: 'Kahalo khlengma! Uaisa khlengna?',
      lostSub: 'Kahalo! Card khlengma bisingo bukkha tang.',
      playAgain: 'Uaisa Khlengdi',
      cardsCount: count => `${count} card`,
      unoButton: 'UNO!',
      drawCard: 'Card Laidi',
      colors: { red: 'Kchak', yellow: 'Kwphang', green: 'Kthang', blue: 'Kbru' },
    },
    nag: {
      yourTurn: 'Apuni laga turn — card chunibi',
      matchingCount: count => `${count} milua card ase! Dababi khelebi.`,
      noMatches: 'Milua card nai. Naya card ulabi!',
      chooseColorTitle: 'Rang Chunibi',
      chooseColorSub: 'Khel aage barhabole rang chunibi:',
      youWon: 'Apuni jitishey! 🎉',
      playerWon: name => `${name} jitishey!`,
      wonSub: 'Bishi bhal khela hoishey! Aru khelebi niki?',
      lostSub: 'Bhal hoishey! Card game pora dhyan bhal thakey.',
      playAgain: 'Aru Khelebi',
      cardsCount: count => `${count} cards`,
      unoButton: 'UNO!',
      drawCard: 'Card Loboli',
      colors: { red: 'Lal', yellow: 'Haldi', green: 'Hariya', blue: 'Neela' },
    },
    ne: {
      yourTurn: 'तपाईँको पालो — खेल्नको लागि तास छान्नुहोस्',
      matchingCount: count => `${count} वटा मिल्ने तास! खेल्नलाई ट्याप गर्नुहोस्।`,
      noMatches: 'कुनै मिल्ने तास छैन। नयाँ तास तान्नुहोस्!',
      chooseColorTitle: 'रङ्ग छान्नुहोस्',
      chooseColorSub: 'खेल अघि बढाउन रङ्ग रोज्नुहोस्:',
      youWon: 'तपाईँले जित्नुभयो! 🎉',
      playerWon: name => `${name} ले जित्नुभयो!`,
      wonSub: 'धेरै राम्रो खेल! फेरि खेल्नुहुन्छ?',
      lostSub: 'राम्रो प्रयास! तासको खेलले ध्यान एकाग्र राख्न मद्दत गर्छ।',
      playAgain: 'फेरि खेल्नुहोस्',
      cardsCount: count => `${count} वटा तास`,
      unoButton: 'युनो!',
      drawCard: 'तास तान्नुहोस्',
      colors: { red: 'रातो', yellow: 'पहेँलो', green: 'हरियो', blue: 'नीलो' },
    },
    hi: {
      yourTurn: 'आपकी बारी — कार्ड पर टैप करके खेलें',
      matchingCount: count => `${count} मिलते कार्ड! खेलने के लिए किसी पर टैप करें।`,
      noMatches: 'कोई मिलता कार्ड नहीं है। गड्डी से नया कार्ड उठाएँ!',
      chooseColorTitle: 'रंग चुनें',
      chooseColorSub: 'खेल जारी रखने के लिए रंग चुनें:',
      youWon: 'आप जीत गए! 🎉',
      playerWon: name => `${name} जीत गए!`,
      wonSub: 'शानदार रणनीति! क्या एक और राउंड खेलेंगे?',
      lostSub: 'बहुत अच्छा खेले! कार्ड गेम मन को सक्रिय और ताज़ा रखता है।',
      playAgain: 'फिर से खेलें',
      cardsCount: count => `${count} कार्ड`,
      unoButton: 'यूनो!',
      drawCard: 'कार्ड उठाएँ',
      colors: { red: 'लाल', yellow: 'पीला', green: 'हरा', blue: 'नीला' },
    },
    en: {
      yourTurn: 'Your turn — tap a highlighted card to play.',
      matchingCount: count => `${count} matching card${count === 1 ? '' : 's'}! Tap any raised card below to play.`,
      noMatches: 'No matching cards. Tap the deck above to draw a card!',
      chooseColorTitle: 'Choose a Color',
      chooseColorSub: 'Select which color should continue the match:',
      youWon: 'You Won! 🎉',
      playerWon: name => `${name} Wins!`,
      wonSub: 'Great strategy and quick decisions! Ready for another round?',
      lostSub: 'Well played! Card games help maintain cognitive agility and focus.',
      playAgain: 'Play Again',
      cardsCount: count => `${count} cards`,
      unoButton: 'UNO!',
      drawCard: 'Draw Card',
      colors: { red: 'Red', yellow: 'Yellow', green: 'Green', blue: 'Blue' },
    },
  };

  return dict[lang] || dict.en;
};

export const getTargetSpottingStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    findPromptColor: (color: string) => string;
    findPromptShape: (shape: string) => string;
    findPromptBoth: (color: string, shape: string) => string;
    roundCount: (curr: number, total: number) => string;
    foundCount: (found: number, target: number) => string;
    roundSuccess: string;
    gameOver: string;
    playAgain: string;
    levels: { easy: string; medium: string; hard: string };
    colors: Record<string, string>;
    shapes: Record<string, string>;
    explainer: string;
  }> = {
    as: {
      findPromptColor: col => `সকলো ${col} ৰঙৰ বস্তু বিচাৰক`,
      findPromptShape: shp => `সকলো ${shp} বিচাৰক`,
      findPromptBoth: (col, shp) => `সকলো ${col} ৰঙৰ ${shp} বিচাৰক`,
      roundCount: (c, t) => `ৰাউণ্ড ${c} / ${t}`,
      foundCount: (f, t) => `${t} টাৰ ভিতৰত ${f} টা পোৱা গ’ল`,
      roundSuccess: 'বৰ সুন্দৰ! সকলো শুদ্ধকৈ ওলাল।',
      gameOver: 'আশ্চৰ্যজনক! আপোনাৰ মনোযোগ আৰু দৃষ্টিশক্তি অতি তীক্ষ্ণ।',
      playAgain: 'পুনৰ খেলক',
      levels: { easy: 'সহজ', medium: 'মধ্যম', hard: 'উন্নত' },
      colors: { red: 'ৰঙা', blue: 'নীলা', yellow: 'হালধীয়া', green: 'সেউজীয়া', purple: 'বেঙুনীয়া', orange: 'কমলা' },
      shapes: { circle: 'বৃত্ত', square: 'বৰ্গ', triangle: 'ত্ৰিভুজ', circles: 'বৃত্তবোৰ', squares: 'বৰ্গবোৰ', triangles: 'ত্ৰিভুজবোৰ' },
      explainer: 'এই খেলটোত স্ক্ৰীনত কিছুমান আকৃতি দেখুওৱা হৈছে। ওপৰত কোৱা ৰং আৰু আকৃতি মিলি থকা বস্তুবোৰত টিপক। লাহে লাহে খেলক।',
    },
    hi: {
      findPromptColor: col => `सभी ${col} आकृतियाँ खोजें`,
      findPromptShape: shp => `सभी ${shp} ढूँढें`,
      findPromptBoth: (col, shp) => `सभी ${col} ${shp} ढूँढें`,
      roundCount: (c, t) => `दौर ${c} / ${t}`,
      foundCount: (f, t) => `${t} में से ${f} मिल गए`,
      roundSuccess: 'शाबाश! आपने सही आकृतियाँ पहचानीं।',
      gameOver: 'बहुत बढ़िया! आपकी दृष्टि और ध्यान बहुत तेज़ है।',
      playAgain: 'फिर से खेलें',
      levels: { easy: 'सरल', medium: 'मध्यम', hard: 'कठिन' },
      colors: { red: 'लाल', blue: 'नीला', yellow: 'पीला', green: 'हरा', purple: 'बैंगनी', orange: 'नारंगी' },
      shapes: { circle: 'गोल', square: 'चौकोर', triangle: 'तिकोना', circles: 'गोलाकार', squares: 'चौकोर', triangles: 'तिकोने' },
      explainer: 'इस खेल में स्क्रीन पर कुछ आकृतियाँ दिखाई गई हैं। जो लक्ष्य से मेल खाती हैं, केवल उन्हीं पर टैप करें। आराम से खेलें।',
    },
    en: {
      findPromptColor: col => `Find all ${col} shapes`,
      findPromptShape: shp => `Find all ${shp}`,
      findPromptBoth: (col, shp) => `Find all ${col} ${shp}`,
      roundCount: (c, t) => `Round ${c} of ${t}`,
      foundCount: (f, t) => `${f} of ${t} found`,
      roundSuccess: 'Well done! All matching shapes found.',
      gameOver: 'Great focus and sharp vision! Session complete.',
      playAgain: 'Play Again',
      levels: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
      colors: { red: 'red', blue: 'blue', yellow: 'yellow', green: 'green', purple: 'purple', orange: 'orange' },
      shapes: { circle: 'circle', square: 'square', triangle: 'triangle', circles: 'circles', squares: 'squares', triangles: 'triangles' },
      explainer: 'Some shapes are shown on the screen. Find the ones that match the target prompt and tap them. Take your time.',
    },
    brx: {
      findPromptColor: col => `गासै ${col} गाबनि महरखौ नागिर`,
      findPromptShape: shp => `गासै ${shp} खौ नागिर`,
      findPromptBoth: (col, shp) => `गासै ${col} ${shp} खौ नागिर`,
      roundCount: (c, t) => `राउण्ड ${c} / ${t}`,
      foundCount: (f, t) => `${t} निफ्राय ${f} मोनबाय`,
      roundSuccess: 'जोबोद मोजां! गासैबो मिलिबाय।',
      gameOver: 'साबाश! नोंथांनि गोसो साननाया गोख्रों।',
      playAgain: 'फिन गेले',
      levels: { easy: 'गोरलै', medium: 'गेजेर', hard: 'गोब्राब' },
      colors: { red: 'गोजा', blue: 'गोथाव', yellow: 'गोमो', green: 'गोथां', purple: 'जाम्बुलि', orange: 'कमला' },
      shapes: { circle: 'गुबुल', square: 'बर्ग', triangle: 'खनानै', circles: 'गुबुलफोर', squares: 'बर्गफोर', triangles: 'खनानैफोर' },
      explainer: 'स्क्रिनआव महर देखायदों। थि गाब आरो महरखौ नागिरना थुदो।',
    },
    mni: {
      findPromptColor: col => `মচু ${col} ওইবা শক্লোনশিং থিদোকউ`,
      findPromptShape: shp => `${shp} পুম্নমক থিদোকউ`,
      findPromptBoth: (col, shp) => `${col} ওইবা ${shp} পুম্নমক থিদোকউ`,
      roundCount: (c, t) => `তানকোক ${c} / ${t}`,
      foundCount: (f, t) => `${t} গী মনুংদা ${f} ফংলে`,
      roundSuccess: 'য়াম্না ফরে! অচুম্বা শক্লোনশিং ফংলে।',
      gameOver: 'খুৎহৈবা অমসুং পুক্নিং চংবা ফরে!',
      playAgain: 'অমুক শান্নসি',
      levels: { easy: 'লাইবা', medium: 'ময়ায় ওইবা', hard: 'লূবা' },
      colors: { red: 'অঙাংবা', blue: 'হিগোক', yellow: 'ঙাংবা', green: 'অশুংবা', purple: 'কুমববা', orange: 'কমলা' },
      shapes: { circle: 'তেন্দোং', square: 'পাকচাও', triangle: 'মকোই অহুম', circles: 'তেন্দোংশিং', squares: 'পাকচাওশিং', triangles: 'মকোই অহুমশিং' },
      explainer: 'স্ক্রিন্দা শক্লোনশিং উরি। য়ান্নবা শক্লোনশিং খক্তদা নম্মু।',
    },
    lus: {
      findPromptColor: col => `Rawng ${col} awm zawng zawng zawng rawh`,
      findPromptShape: shp => `${shp} zawng zawng zawng rawh`,
      findPromptBoth: (col, shp) => `${shp} rawng ${col} awm zawng zawng zawng rawh`,
      roundCount: (c, t) => `Khelh ${c} / ${t}`,
      foundCount: (f, t) => `${t} zinga ${f} hmuh a ni tawh`,
      roundSuccess: 'I ti ṭha lutuk! A inmil zawng i hmu e.',
      gameOver: 'I mit a fiahin i rilru a fim hle mai!',
      playAgain: 'Khel Leh Rawh',
      levels: { easy: 'A awlsam', medium: 'A laihawl', hard: 'A harsa' },
      colors: { red: 'sen', blue: 'pawl', yellow: 'eng', green: 'hring', purple: 'sen duk', orange: 'serthlum' },
      shapes: { circle: 'bial', square: 'kil li nei', triangle: 'kil thum nei', circles: 'bialte', squares: 'kil li neite', triangles: 'kil thum neite' },
      explainer: 'Screen-a lang te hi en la, inmil chiah chiah te kha hmet rawh le.',
    },
    kha: {
      findPromptColor: col => `Wad ia ki dur ba rong ${col}`,
      findPromptShape: shp => `Wad ia ki ${shp}`,
      findPromptBoth: (col, shp) => `Wad ia ki ${shp} ba rong ${col}`,
      roundCount: (c, t) => `Kyntoit ${c} / ${t}`,
      foundCount: (f, t) => `${f} na ka ${t} la shem`,
      roundSuccess: 'Bha shisha! La shem lut baroh.',
      gameOver: 'Ka jingiohi bad jingpynleit jingmut kaba khraw!',
      playAgain: 'Ialehkai Biang',
      levels: { easy: 'Kaba suk', medium: 'Kaba hapdeng', hard: 'Kaba eh' },
      colors: { red: 'saw', blue: 'blei', yellow: 'stem', green: 'jyrngam', purple: 'sawbthuh', orange: 'sohlieh' },
      shapes: { circle: 'pyllun', square: 'sawdong', triangle: 'lai-dong', circles: 'ki dur pyllun', squares: 'ki dur sawdong', triangles: 'ki dur lai-dong' },
      explainer: 'Peit ia ki dur ha ka screen bad tep tang ia kiba iadei.',
    },
    grt: {
      findPromptColor: col => `Gimik ${col} ronggipa bimangko am·bo`,
      findPromptShape: shp => `Gimik ${shp} ko am·bo`,
      findPromptBoth: (col, shp) => `Gimik ${col} ${shp} ko am·bo`,
      roundCount: (c, t) => `Chang ${c} / ${t}`,
      foundCount: (f, t) => `${t} oni ${f} ko man·aha`,
      roundSuccess: 'Namaha! Gimik meligipako man·aha.',
      gameOver: 'Nang·ni mikron aro gisik seng·bea!',
      playAgain: 'Kal·taibo',
      levels: { easy: 'Altua', medium: 'Jatchi', hard: 'Rakka' },
      colors: { red: 'gitchak', blue: 'tangsim', yellow: 'rimit', green: 'giting', purple: 'golap', orange: 'kamla' },
      shapes: { circle: 'borom', square: 'sam bri', triangle: 'sam gitam', circles: 'boromrang', squares: 'sam brirang', triangles: 'sam gitamrang' },
      explainer: 'Screen-o bimangrangko nina man·gen. Meligipako thikbo.',
    },
    trp: {
      findPromptColor: col => `Bebak ${col} rong ni mohor saikha`,
      findPromptShape: shp => `Bebak ${shp} no saikha`,
      findPromptBoth: (col, shp) => `Bebak ${col} ${shp} no saikha`,
      roundCount: (c, t) => `Khleng ${c} / ${t}`,
      foundCount: (f, t) => `${t} oni ${f} mankha`,
      roundSuccess: 'Kahalo! Bebak milinai mankha.',
      gameOver: 'Nini mokol tei bukkha kwrak!',
      playAgain: 'Uaisa Khlengdi',
      levels: { easy: 'Kusu', medium: 'Bising', hard: 'Kwrak' },
      colors: { red: 'kchak', blue: 'kbru', yellow: 'kwphang', green: 'kthang', purple: 'bagan', orange: 'komla' },
      shapes: { circle: 'gorom', square: 'char-khorang', triangle: 'tham-khorang', circles: 'goromrok', squares: 'char-khorangrok', triangles: 'tham-khorangrok' },
      explainer: 'Screen o mohorrok tongkha. Milinai mohor o tekdi.',
    },
    nag: {
      findPromptColor: col => `Sob ${col} rang laga shape khujibi`,
      findPromptShape: shp => `Sob ${shp} khujibi`,
      findPromptBoth: (col, shp) => `Sob ${col} ${shp} khujibi`,
      roundCount: (c, t) => `Round ${c} / ${t}`,
      foundCount: (f, t) => `${t} pora ${f} ta milishey`,
      roundSuccess: 'Bishi bhal! Sob milua shape paishey.',
      gameOver: 'Apuni laga chokhu aru dhyan bishi bhal ase!',
      playAgain: 'Aru Khelebi',
      levels: { easy: 'Aasan', medium: 'Majhe', hard: 'Taan' },
      colors: { red: 'lal', blue: 'neela', yellow: 'haldi', green: 'hariya', purple: 'baiguni', orange: 'komola' },
      shapes: { circle: 'gol', square: 'chaukor', triangle: 'tikon', circles: 'gol khan', squares: 'chaukor khan', triangles: 'tikon khan' },
      explainer: 'Screen te shape khan dekhi ase. Juntu mile etu te touch koribi.',
    },
    ne: {
      findPromptColor: col => `सबै ${col} आकारहरू पत्ता लगाउनुहोस्`,
      findPromptShape: shp => `सबै ${shp} खोज्नुहोस्`,
      findPromptBoth: (col, shp) => `सबै ${col} ${shp} खोज्नुहोस्`,
      roundCount: (c, t) => `चरण ${c} / ${t}`,
      foundCount: (f, t) => `${t} मध्ये ${f} भेटिए`,
      roundSuccess: 'स्याबास! सबै मिल्ने आकारहरू फेला परे।',
      gameOver: 'धेरै राम्रो! हजुरको नजर र ध्यान निकै तीक्ष्ण छ।',
      playAgain: 'फेरि खेल्नुहोस्',
      levels: { easy: 'सजिलो', medium: 'मध्यम', hard: 'गाह्रो' },
      colors: { red: 'रातो', blue: 'नीलो', yellow: 'पहेँलो', green: 'हरियो', purple: 'बैजनी', orange: 'सुन्तला' },
      shapes: { circle: 'गोलो', square: 'चारपाटे', triangle: 'तीनपाटे', circles: 'गोलाकारहरू', squares: 'चारपाटेहरू', triangles: 'तीनपाटेहरू' },
      explainer: 'पर्दामा विभिन्न आकारहरू छन्। माथि सोधिएको अनुसार मिल्ने आकारहरूमा मात्र थिच्नुहोस्।',
    },
  };

  return dict[lang] || dict.en;
};

export const getPatternRecallStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    watchPattern: string;
    yourTurn: string;
    tryAgain: string;
    success: string;
    complete: string;
    playAgain: string;
    roundCount: (curr: number, total: number) => string;
    levels: { easy: string; medium: string; hard: string };
    explainer: string;
  }> = {
    as: {
      watchPattern: 'মন দি চাওক... বাকচবোৰ জ্বলি উঠিছে',
      yourTurn: 'আপোনাৰ পাল — একেই ক্ৰমত ঘৰবোৰ টিপক',
      tryAgain: 'নহ’ল, চিন্তা নকৰিব! পুনৰ এবাৰ চাওক।',
      success: 'বৰ ধুনীয়া! আপুনি শুদ্ধ ক্ৰম মনত ৰাখিলে।',
      complete: 'অভিনন্দন! আপোনাৰ স্মৃতিশক্তি অতি সতেজ।',
      playAgain: 'পুনৰ খেলক',
      roundCount: (c, t) => `ৰাউণ্ড ${c} / ${t}`,
      levels: { easy: 'সহজ (৩ টা)', medium: 'মধ্যম (৪ টা)', hard: 'উন্নত (৫ টা)' },
      explainer: 'বাকচবোৰ জ্বলি উঠা ক্ৰমটো মনত ৰাখক। তাৰ পিছত সেই একে ক্ৰমত বাকচবোৰত টিপক।',
    },
    hi: {
      watchPattern: 'ध्यान से देखें... डिब्बे जल रहे हैं',
      yourTurn: 'आपकी बारी — उसी क्रम में डिब्बों पर टैप करें',
      tryAgain: 'कोई बात नहीं! फिर से ध्यान से देखें।',
      success: 'बहुत बढ़िया! आपने सही क्रम याद रखा।',
      complete: 'शानदार! आपकी याददाश्त बहुत अच्छी है।',
      playAgain: 'फिर से खेलें',
      roundCount: (c, t) => `दौर ${c} / ${t}`,
      levels: { easy: 'सरल (3)', medium: 'मध्यम (4)', hard: 'कठिन (5)' },
      explainer: 'डिब्बों के जलने के क्रम को याद रखें। फिर उसी क्रम में उन पर टैप करें।',
    },
    en: {
      watchPattern: 'Watch closely... boxes lighting up',
      yourTurn: 'Your turn — tap the boxes in the same order',
      tryAgain: 'Not quite! Watch again and try once more.',
      success: 'Well done! Exact sequence recalled.',
      complete: 'Great memory work! Cognitive agility strengthened.',
      playAgain: 'Play Again',
      roundCount: (c, t) => `Round ${c} of ${t}`,
      levels: { easy: 'Easy (3)', medium: 'Medium (4)', hard: 'Hard (5)' },
      explainer: 'Watch the boxes light up. Remember the order, then tap them the same way.',
    },
    brx: {
      watchPattern: 'नेनानै नाय... खथाफोरा सोरां जादों',
      yourTurn: 'नोंथांनि पालि — बे फारियै थुदो',
      tryAgain: 'जायाखै, फिन नाय आरो गेले।',
      success: 'जोबोद मोजां! नोंथाङा गोसोखांबाय।',
      complete: 'साबाश! नोंथांनि गोसोखां मोन्थाइया गाहाम।',
      playAgain: 'फिन गेले',
      roundCount: (c, t) => `राउण्ड ${c} / ${t}`,
      levels: { easy: 'गोरलै', medium: 'गेजेर', hard: 'गोब्राब' },
      explainer: 'सोरां जाबोनाय फारिखौ गोसोखां। उनाव बे फारियै थु।',
    },
    mni: {
      watchPattern: 'পুক্নিং চংনা য়েংউ... মঙাল থোক্লে',
      yourTurn: 'অদোমগী তাঞ্জা — মথং মনাও নম্মু',
      tryAgain: 'হন্না য়েংদুনা শান্নসি।',
      success: 'য়াম্না ফরে! মথং মনাও নিংশিংলে।',
      complete: 'নুংশিরবা ইবেম্মাদা থাগৎচরি!',
      playAgain: 'অমুক শান্নসি',
      roundCount: (c, t) => `তানকোক ${c} / ${t}`,
      levels: { easy: 'লাইবা', medium: 'ময়ায় ওইবা', hard: 'লূবা' },
      explainer: 'মঙাল থোকপা অদু য়েংউ অমসুং মথং মনাও নম্মু।',
    },
    lus: {
      watchPattern: 'Ngun takin en rawh... a lo eng mek e',
      yourTurn: 'I hun ve thung — a indawtin hmet rawh le',
      tryAgain: 'A dik chiah lo! En nawn leh rawh le.',
      success: 'I ti ṭha lutuk! I hre dik chiah e.',
      complete: 'I rilru a chak hle mai!',
      playAgain: 'Khel Leh Rawh',
      roundCount: (c, t) => `Khelh ${c} / ${t}`,
      levels: { easy: 'Awlsam', medium: 'Laihawl', hard: 'Harsa' },
      explainer: 'Bawm eng te kha lo en la, a rik dan indawtin hmet ve rawh.',
    },
    kha: {
      watchPattern: 'Peit bha... ki synduk ki la meh',
      yourTurn: 'Ka pali jong phi — tep ha kajuh ka rukom',
      tryAgain: 'Ym dei satlak! Peit biang sa pyrshang.',
      success: 'Bha shisha! Kynmaw thik.',
      complete: 'Ka jingkynmaw kaba khlain bha!',
      playAgain: 'Ialehkai Biang',
      roundCount: (c, t) => `Kyntoit ${c} / ${t}`,
      levels: { easy: 'Suk', medium: 'Hapdeng', hard: 'Eh' },
      explainer: 'Peit ia ki synduk ba meh bad kynmaw ia ka rukom.',
    },
    grt: {
      watchPattern: 'Nisengbo... bakrang seng·enga',
      yourTurn: 'Nang·ni somoi — apsan daken thikbo',
      tryAgain: 'Ong·ja! Nitaibo aro daktaibo.',
      success: 'Namaha! Gisik ra·aha.',
      complete: 'Nang·ni gisik bilakbea!',
      playAgain: 'Kal·taibo',
      roundCount: (c, t) => `Chang ${c} / ${t}`,
      levels: { easy: 'Altua', medium: 'Jatchi', hard: 'Rakka' },
      explainer: 'Seng·gipa riko gisik ra·bo aro thikbo.',
    },
    trp: {
      watchPattern: 'Naisa tongdi... bati bar phaikha',
      yourTurn: 'Nini somoi — aini teta tekdi',
      tryAgain: 'Ongya! Naidi tei uaisa tekdi.',
      success: 'Kahalo! Uaisa gosong kha.',
      complete: 'Nini bukkha kotor!',
      playAgain: 'Uaisa Khlengdi',
      roundCount: (c, t) => `Khleng ${c} / ${t}`,
      levels: { easy: 'Kusu', medium: 'Bising', hard: 'Kwrak' },
      explainer: 'Bar phainai bati naidi tei aini tekdi.',
    },
    nag: {
      watchPattern: 'Dhyan pora sabibi... box khan joli ase',
      yourTurn: 'Apuni laga turn — thik order te dababi',
      tryAgain: 'Thik nahoishey! Aru ekbar sabibi.',
      success: 'Bishi bhal! Thik order yaad korishey.',
      complete: 'Apuni laga dimag bishi bhal ase!',
      playAgain: 'Aru Khelebi',
      roundCount: (c, t) => `Round ${c} / ${t}`,
      levels: { easy: 'Aasan', medium: 'Majhe', hard: 'Taan' },
      explainer: 'Box jolua sabibi aru etu order te touch koribi.',
    },
    ne: {
      watchPattern: 'ध्यान दिएर हेर्नुहोस्... बाकसहरू बलेका छन्',
      yourTurn: 'तपाईँको पालो — उही क्रममा बाकसहरू थिच्नुहोस्',
      tryAgain: 'मिलेन, फेरि एकपटक ध्यान दिएर हेर्नुहोस्।',
      success: 'धेरै राम्रो! हजुरले सही क्रम सम्झनुभयो।',
      complete: 'बधाई छ! हजुरको स्मरणशक्ति निकै प्रखर छ।',
      playAgain: 'फेरि खेल्नुहोस्',
      roundCount: (c, t) => `चरण ${c} / ${t}`,
      levels: { easy: 'सजिलो (३)', medium: 'मध्यम (४)', hard: 'गाह्रो (५)' },
      explainer: 'बाकसहरू कुन क्रममा बल्छन् हेर्नुहोस् र उही क्रममा थिच्नुहोस्।',
    },
  };

  return dict[lang] || dict.en;
};

export interface LocalizedGameMeta {
  title: string;
  subtitle: string;
  duration: string;
}

export const getGamesMenuStrings = (lang: LanguageCode): Record<'uno_game' | 'target_spotting' | 'pattern_recall', LocalizedGameMeta> => {
  const dict: Record<LanguageCode, Record<'uno_game' | 'target_spotting' | 'pattern_recall', LocalizedGameMeta>> = {
    as: {
      uno_game: {
        title: 'ইউনো কাৰ্ডৰ আনন্দ',
        subtitle: 'ৰং আৰু সংখ্যা মিলাই কাৰ্ড খেলক — শব্দ আৰু দৃশ্যমান এনিমেচনৰ সৈতে',
        duration: '৫ মিনিট',
      },
      target_spotting: {
        title: 'লক্ষ্য আৰু ৰং চিনাক্তকৰণ',
        subtitle: 'কেৱল লক্ষ্যৰ সৈতে মিল থকা আকৃতিবোৰত টিপক',
        duration: '৩ মিনিট',
      },
      pattern_recall: {
        title: 'ক্ৰম আৰু স্মৃতি পৰীক্ষা',
        subtitle: 'বাকচবোৰ জ্বলি উঠা লক্ষ্য কৰক আৰু একে ক্ৰমত টিপক',
        duration: '৩ মিনিট',
      },
    },
    hi: {
      uno_game: {
        title: 'यूएनओ कार्ड गेम',
        subtitle: 'रंग और संख्या मिलाकर कार्ड खेलें — सुंदर एनिमेशन और ध्वनि के साथ',
        duration: '5 मिनट',
      },
      target_spotting: {
        title: 'रंग और आकृति पहचान',
        subtitle: 'लक्ष्य से मेल खाने वाली आकृतियों पर टैप करें',
        duration: '3 मिनट',
      },
      pattern_recall: {
        title: 'पैटर्न और स्मृति खेल',
        subtitle: 'डिब्बों के जलने के क्रम को याद रखें और उसी क्रम में टैप करें',
        duration: '3 मिनट',
      },
    },
    en: {
      uno_game: {
        title: 'UNO Game Night',
        subtitle: 'Match colors & numbers vs bots with card animations and sound effects',
        duration: '5 min',
      },
      target_spotting: {
        title: 'Target & Color Spotting',
        subtitle: 'Tap only the shapes that match the target',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'Pattern Recall',
        subtitle: 'Watch the boxes light up, then tap in order',
        duration: '3 min',
      },
    },
    brx: {
      uno_game: {
        title: 'युनो कार्ड गेलेनाय',
        subtitle: 'गाब आरो अनजिमा गोरोबहोना कार्ड गेले',
        duration: '५ मिनिट',
      },
      target_spotting: {
        title: 'गाब आरो महर सायख’नाय',
        subtitle: 'थि महर आरो गाबखौ थु',
        duration: '३ मिनिट',
      },
      pattern_recall: {
        title: 'फारि गोसोखांनाय',
        subtitle: 'सोरां जाबोनाय फारिखौ गोसोखां आरो थु',
        duration: '३ मिनिट',
      },
    },
    mni: {
      uno_game: {
        title: 'ইউনো কাৰ্ড শান্নবা',
        subtitle: 'মচু অমসুং মশীং য়েংদুনা কাৰ্ড শান্নসি',
        duration: '৫ মিনিট',
      },
      target_spotting: {
        title: 'মচু অমসুং শক্লোন থিদোকপা',
        subtitle: 'লমদমগী য়ান্নবা শক্লোনশিং খক্তদা নম্মু',
        duration: '৩ মিনিট',
      },
      pattern_recall: {
        title: 'মথং মনাও নিংশিংবা',
        subtitle: 'মঙাল থোকপা অদু য়েংউ অমসুং মথং মনাও নম্মু',
        duration: '৩ মিনিট',
      },
    },
    lus: {
      uno_game: {
        title: 'UNO Card Khelh Nuam',
        subtitle: 'Rawng leh number inmil thlangin khel rawh',
        duration: '5 min',
      },
      target_spotting: {
        title: 'A Inmil Zawng Rawh',
        subtitle: 'Screen-a inmil chiah chiah te kha hmet rawh',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'A Indawt Hriatreng',
        subtitle: 'A lo eng indawt kha ngun takin en la, chumi hnuah hmet rawh',
        duration: '3 min',
      },
    },
    kha: {
      uno_game: {
        title: 'UNO Jingïalehkai Card',
        subtitle: 'Pynïadei ki rong bad ki jingkhein',
        duration: '5 min',
      },
      target_spotting: {
        title: 'Jied Rong bad Dur',
        subtitle: 'Tep tang ïa ki dur ba ïadei',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'Kynmaw ia ka Rukom',
        subtitle: 'Peit ia ki jingthaba bad pynbud ryntih',
        duration: '3 min',
      },
    },
    grt: {
      uno_game: {
        title: 'UNO Card Kal·ani',
        subtitle: 'Rong aro channiko milie kal·bo',
        duration: '5 min',
      },
      target_spotting: {
        title: 'Rong aro Bimang Niani',
        subtitle: 'Thik bimang aro rongko kal·bo',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'Riko Gisik Ra·ani',
        subtitle: 'Ching·ani riko gual·gija kal·bo',
        duration: '3 min',
      },
    },
    trp: {
      uno_game: {
        title: 'UNO Card Khalama',
        subtitle: 'Rong tei lekhani kok bai khalaidi',
        duration: '5 min',
      },
      target_spotting: {
        title: 'Rong tei Mukhum Nai',
        subtitle: 'Chongba rong tei mukhum khlai',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'Phaluk Uansuk',
        subtitle: 'Jwngnani phaluk no uansuk tei khlai',
        duration: '3 min',
      },
    },
    nag: {
      uno_game: {
        title: 'UNO Card Game',
        subtitle: 'Color aru number milai kene khelibi',
        duration: '5 min',
      },
      target_spotting: {
        title: 'Target & Color Spotting',
        subtitle: 'Target mil kora shapes khan te dababi',
        duration: '3 min',
      },
      pattern_recall: {
        title: 'Pattern Recall',
        subtitle: 'Light jola order yaad rakhikene dababi',
        duration: '3 min',
      },
    },
    ne: {
      uno_game: {
        title: 'युनो कार्ड खेल',
        subtitle: 'रङ र अङ्क मिलाएर कार्ड खेल्नुहोस् — सुन्दर एनिमेसन र ध्वनिसहित',
        duration: '५ मिनेट',
      },
      target_spotting: {
        title: 'रङ र आकृति पहिचान',
        subtitle: 'लक्ष्यसँग मेल खाने आकृतिहरू मात्र छान्नुहोस्',
        duration: '३ मिनेट',
      },
      pattern_recall: {
        title: 'क्रम र स्मृति अभ्यास',
        subtitle: 'डिब्बाहरू बलेको क्रम हेर्नुहोस् र सोही क्रममा थिच्नुहोस्',
        duration: '३ मिनेट',
      },
    },
  };

  return dict[lang] || dict.en;
};
